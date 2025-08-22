
import React, { useMemo, useRef } from 'react';
import { ProcessedTask, TimelineView, Task } from '../types';
import { DAY_WIDTH, ROW_HEIGHT, HEADER_HEIGHT, WEEK_COL_WIDTH } from '../constants';
import GanttBar from './GanttBar';

interface GanttChartProps {
  allTasks: Task[];
  visibleTasks: ProcessedTask[];
  users: string[];
  onUpdateTask: (updatedFields: Partial<Task> & { id: number }) => void;
  isExporting: boolean;
  timelineView: TimelineView;
  workdays: number[];
}

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const dayOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Helper to get the start of the week (Sunday)
const getStartOfWeek = (d: Date) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(date.setDate(diff));
};

const GanttChart: React.FC<GanttChartProps> = ({ allTasks, visibleTasks, users, onUpdateTask, isExporting, timelineView, workdays }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const workdaySet = useMemo(() => new Set(workdays), [workdays]);
  
  const { startDate, endDate, totalCols, months, weeks } = useMemo(() => {
    if (visibleTasks.length === 0) {
      const today = new Date();
      const end = new Date();
      end.setDate(today.getDate() + 30);
      return { startDate: today, endDate: end, totalCols: 31, months: [], weeks: [] };
    }

    let minDate = visibleTasks[0].start;
    let maxDate = visibleTasks[0].end;
    visibleTasks.forEach(task => {
      if (task.start < minDate) minDate = task.start;
      if (task.end > maxDate) maxDate = task.end;
    });

    let startDate: Date;
    let endDate: Date;

    if (timelineView === 'day') {
      startDate = new Date(minDate);
      if (!isExporting) {
        startDate.setDate(startDate.getDate() - 5);
      }
      endDate = new Date(maxDate);
      endDate.setDate(endDate.getDate() + 5);
    } else { // 'week' view
      startDate = getStartOfWeek(minDate);
      if (!isExporting) {
        startDate.setDate(startDate.getDate() - 7); // a week before
      }
      
      const endOfWeek = getStartOfWeek(maxDate);
      endOfWeek.setDate(endOfWeek.getDate() + 6); // end of that week
      endDate = new Date(endOfWeek);
      endDate.setDate(endDate.getDate() + 7); // a week after
    }

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    const totalCols = timelineView === 'day' ? totalDays : Math.ceil(totalDays / 7);

    // Calculate months for day view
    const months = [];
    if (timelineView === 'day') {
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth();
          const daysInMonth = getDaysInMonth(year, month);
          
          let daysToAdd: number;
          if(currentDate.getMonth() === startDate.getMonth() && currentDate.getFullYear() === startDate.getFullYear()){
              daysToAdd = daysInMonth - startDate.getDate() + 1;
          } else if (currentDate.getMonth() === endDate.getMonth() && currentDate.getFullYear() === endDate.getFullYear()) {
              daysToAdd = endDate.getDate();
          } else {
              daysToAdd = daysInMonth;
          }

          months.push({
              name: currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }),
              days: daysToAdd
          });
          currentDate.setMonth(currentDate.getMonth() + 1);
          currentDate.setDate(1);
      }
    }

    // Calculate weeks for week view
    const weeks = [];
    if (timelineView === 'week') {
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        weeks.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 7);
      }
    }

    return { startDate, endDate, totalCols, months, weeks };
  }, [visibleTasks, isExporting, timelineView]);

  const todayMarkerPosition = useMemo(() => {
      const today = new Date();
      const normToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const normStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const normEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

      if (normToday < normStartDate || normToday > normEndDate) {
          return null;
      }

      const msInDay = 1000 * 60 * 60 * 24;
      const offsetInMs = normToday.getTime() - normStartDate.getTime();
      const offsetInDays = offsetInMs / msInDay;

      let left;
      if (timelineView === 'day') {
          left = offsetInDays * DAY_WIDTH;
      } else { // 'week' view
          const offsetInWeeks = offsetInDays / 7;
          left = offsetInWeeks * WEEK_COL_WIDTH;
      }
      return left;
  }, [startDate, endDate, timelineView]);


  const colWidth = timelineView === 'day' ? DAY_WIDTH : WEEK_COL_WIDTH;
  const chartWidth = totalCols * colWidth;

  const renderDayHeader = () => (
    <>
      <div className="flex h-1/2" style={{ width: chartWidth }}>
        {months.map((month, i) => (
          <div 
            key={i} 
            className="flex-shrink-0 text-center font-semibold border-b border-r border-gray-200 h-full flex items-center justify-center" 
            style={{ width: month.days * colWidth }}
          >
            {month.name}
          </div>
        ))}
      </div>
      <div className="flex bg-gray-50 h-1/2" style={{ width: chartWidth }}>
        {Array.from({ length: totalCols }).map((_, i) => {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          const isNonWorkday = !workdaySet.has(date.getDay());
          return (
            <div 
              key={i} 
              className={`flex-shrink-0 text-center border-b border-r border-gray-200 flex flex-col justify-center ${isNonWorkday ? 'bg-gray-100' : ''}`} 
              style={{ width: colWidth }}
            >
              <div className="text-xs text-gray-500 leading-tight">{dayOfWeek[date.getDay()]}</div>
              <div className="text-sm font-medium leading-tight">{date.getDate()}</div>
            </div>
          );
        })}
      </div>
    </>
  );

  const renderWeekHeader = () => {
    const monthNames: { name: string, weeks: number }[] = [];
    weeks.forEach(weekStartDate => {
      const monthName = weekStartDate.toLocaleString('default', { month: 'short', year: 'numeric' });
      const lastMonth = monthNames[monthNames.length - 1];
      if (lastMonth && lastMonth.name === monthName) {
        lastMonth.weeks++;
      } else {
        monthNames.push({ name: monthName, weeks: 1 });
      }
    });

    return (
      <>
        <div className="flex h-1/2" style={{ width: chartWidth }}>
          {monthNames.map((month, i) => (
            <div 
              key={i} 
              className="flex-shrink-0 text-center font-semibold border-b border-r border-gray-200 h-full flex items-center justify-center" 
              style={{ width: month.weeks * colWidth }}
            >
              {month.name}
            </div>
          ))}
        </div>
        <div className="flex bg-gray-50 h-1/2" style={{ width: chartWidth }}>
          {weeks.map((weekStartDate, i) => (
            <div 
              key={i} 
              className="flex-shrink-0 text-center border-b border-r border-gray-200 flex flex-col justify-center"
              style={{ width: colWidth }}
            >
              <div className="text-sm font-medium leading-tight">{weekStartDate.getDate()}</div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const getBarPositions = (task: ProcessedTask) => {
      const msInDay = 1000 * 60 * 60 * 24;
      const normalizeToDayStart = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

      const normGridStart = normalizeToDayStart(startDate);
      const normTaskStart = normalizeToDayStart(task.start);
      const normTaskEnd = normalizeToDayStart(task.end);

      const endOfTaskDay = new Date(normTaskEnd);
      endOfTaskDay.setDate(endOfTaskDay.getDate() + 1);

      const durationInMs = endOfTaskDay.getTime() - normTaskStart.getTime();
      const offsetInMs = normTaskStart.getTime() - normGridStart.getTime();

      const msPerUnit = timelineView === 'day' ? msInDay : msInDay * 7;
      
      const width = (durationInMs / msPerUnit) * colWidth;
      const left = (offsetInMs / msPerUnit) * colWidth;
      return { left, width };
  };

  const getVisibleRepresentative = (taskId: number, visibleTasks: ProcessedTask[], allTasks: Task[]): ProcessedTask | null => {
      const taskInVisibleList = visibleTasks.find(t => t.id === taskId);
      if (taskInVisibleList) {
          return taskInVisibleList; // Task itself is visible
      }

      const task = allTasks.find(t => t.id === taskId);
      if (!task || !task.parentId) {
          return null; // No parent or not found, cannot trace up
      }

      // Recursively find the first visible parent
      return getVisibleRepresentative(task.parentId, visibleTasks, allTasks);
  };
  
  return (
    <div className="relative" ref={chartRef}>
      <div 
        className="sticky top-0 z-10 bg-white flex flex-col" 
        style={{ height: `${HEADER_HEIGHT}px` }}
      >
        {timelineView === 'day' ? renderDayHeader() : renderWeekHeader()}
      </div>

      <div className="relative" style={{ height: `${visibleTasks.length * ROW_HEIGHT}px`, width: chartWidth }}>
        {Array.from({ length: totalCols }).map((_, i) => {
          let isNonWorkdayCol = false;
          if (timelineView === 'day') {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            isNonWorkdayCol = !workdaySet.has(date.getDay());
          }
          return (
            <div key={i} className={`absolute top-0 bottom-0 border-r border-gray-200 ${isNonWorkdayCol ? 'bg-gray-100/50' : ''}`} style={{ left: i * colWidth, width: colWidth }}></div>
          )
        })}
        
        {todayMarkerPosition !== null && !isExporting && (
          <div
            className="absolute top-0 bottom-0 z-10 pointer-events-none"
            style={{ left: `${todayMarkerPosition}px` }}
            aria-hidden="true"
          >
            <div className="w-0.5 h-full bg-red-500 opacity-75"></div>
          </div>
        )}

        {visibleTasks.map((task, index) => (
          <GanttBar 
            key={task.id} 
            task={task} 
            index={index} 
            startDate={startDate}
            users={users}
            onUpdateTask={onUpdateTask}
            containerRef={chartRef}
            isExporting={isExporting}
            timelineView={timelineView}
          />
        ))}

        <svg className="absolute top-0 left-0" width={chartWidth} height={visibleTasks.length * ROW_HEIGHT} style={{ pointerEvents: 'none' }}>
           <defs>
               <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto" markerUnits="userSpaceOnUse">
                   <polygon points="0 0, 6 3, 0 6" fill="#64748B" />
               </marker>
           </defs>
           {allTasks.map((dependentTask) => {
               if (!dependentTask.dependencies || dependentTask.type !== 'task') return null;

               const visibleDependent = getVisibleRepresentative(dependentTask.id, visibleTasks, allTasks);
               if (!visibleDependent) return null;

               return dependentTask.dependencies.map(depId => {
                   const visiblePrereq = getVisibleRepresentative(depId, visibleTasks, allTasks);
                   if (!visiblePrereq || visiblePrereq.id === visibleDependent.id) return null;

                   const prereqIndex = visibleTasks.findIndex(t => t.id === visiblePrereq.id);
                   const dependentIndex = visibleTasks.findIndex(t => t.id === visibleDependent.id);

                   if (prereqIndex === -1 || dependentIndex === -1) return null;

                   const getBarYCoordinates = (task: ProcessedTask, index: number) => {
                       if (task.type === 'group') {
                           const top = (index * ROW_HEIGHT) + (ROW_HEIGHT - 12) / 2;
                           return { top, bottom: top + 12 };
                       }
                       const top = (index * ROW_HEIGHT) + 8;
                       return { top, bottom: top + 32 };
                   };

                   const prereqPos = getBarPositions(visiblePrereq);
                   const dependentPos = getBarPositions(visibleDependent);
                   
                   const prereqY = getBarYCoordinates(visiblePrereq, prereqIndex);
                   const dependentY = getBarYCoordinates(visibleDependent, dependentIndex);

                   const arrowOffset = 6; // Should match markerWidth and refX
                   let path;
                   
                   if (prereqIndex < dependentIndex) { // Prereq is ABOVE dependent, line goes down
                       const startX = prereqPos.left + prereqPos.width / 2;
                       const startY = prereqY.bottom;
                       const endX = dependentPos.left + dependentPos.width / 2;
                       const endY = dependentY.top;
                       
                       const midY = (startY + endY) / 2;
                       path = `M ${startX} ${startY} V ${midY} H ${endX} V ${endY - arrowOffset}`;

                   } else { // Prereq is BELOW dependent, line goes up
                       const startX = prereqPos.left + prereqPos.width / 2;
                       const startY = prereqY.top;
                       const endX = dependentPos.left + dependentPos.width / 2;
                       const endY = dependentY.bottom;

                       const midY = (startY + endY) / 2;
                       path = `M ${startX} ${startY} V ${midY} H ${endX} V ${endY + arrowOffset}`;
                   }
                   
                   return <path key={`${depId}-${dependentTask.id}`} d={path} stroke="#64748B" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />;
               });
           })}
        </svg>
      </div>
    </div>
  );
};

export default GanttChart;
