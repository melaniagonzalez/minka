
import React, { useState, useCallback, useRef } from 'react';
import { Task, TimelineView } from '../types';
import { DAY_WIDTH, ROW_HEIGHT, WEEK_COL_WIDTH } from '../constants';
import EditTaskModal from './EditTaskModal';

interface GanttBarProps {
  task: Task;
  index: number;
  startDate: Date;
  users: string[];
  onUpdateTask: (updatedFields: Partial<Task> & { id: number }) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  isExporting: boolean;
  timelineView: TimelineView;
}

const GanttBar: React.FC<GanttBarProps> = ({ task, index, startDate, users, onUpdateTask, containerRef, isExporting, timelineView }) => {
  const barRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const [initialX, setInitialX] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const colWidth = timelineView === 'day' ? DAY_WIDTH : WEEK_COL_WIDTH;
  const msInDay = 1000 * 60 * 60 * 24;

  const normalizeToDayStart = (date: Date) => {
    // Creates a new date object at midnight in the local timezone to avoid timezone issues.
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const normGridStart = normalizeToDayStart(startDate);
  const normTaskStart = normalizeToDayStart(task.start);
  const normTaskEnd = normalizeToDayStart(task.end);

  // Calculate duration by using the day *after* the end date. This correctly captures the full duration of the last day.
  const endOfTaskDay = new Date(normTaskEnd);
  endOfTaskDay.setDate(endOfTaskDay.getDate() + 1);

  const durationInMs = endOfTaskDay.getTime() - normTaskStart.getTime();
  const offsetInMs = normTaskStart.getTime() - normGridStart.getTime();

  const msPerUnit = timelineView === 'day' ? msInDay : msInDay * 7;
  
  const width = (durationInMs / msPerUnit) * colWidth;
  const left = (offsetInMs / msPerUnit) * colWidth;
  const top = index * ROW_HEIGHT + 8;
  const isGroup = task.type === 'group';

  const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isGroup) return;
    e.preventDefault();
    setIsDragging(true);
    setInitialX(e.clientX);
  }, [isGroup]);

  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>, side: 'left' | 'right') => {
    if (isGroup) return;
    e.preventDefault();
    e.stopPropagation();
    if (side === 'left') setIsResizingLeft(true);
    if (side === 'right') setIsResizingRight(true);
    setInitialX(e.clientX);
  };
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if ((!isDragging && !isResizingLeft && !isResizingRight) || isGroup) return;
    
    const currentDeltaX = e.clientX - initialX;
    const colDelta = Math.round(currentDeltaX / colWidth);

    if (colDelta === 0) return; // No change needed if we haven't moved a full column width
    
    const timeUnit = timelineView === 'day' ? 1 : 7;
    const dayDelta = colDelta * timeUnit;

    if (isDragging) {
      const newStart = new Date(task.start);
      newStart.setDate(task.start.getDate() + dayDelta);
      const newEnd = new Date(task.end);
      newEnd.setDate(task.end.getDate() + dayDelta);
      onUpdateTask({ id: task.id, start: newStart, end: newEnd });
    } else if (isResizingLeft) {
      const newStart = new Date(task.start);
      newStart.setDate(task.start.getDate() + dayDelta);
      if (newStart <= task.end) {
        onUpdateTask({ id: task.id, start: newStart });
      }
    } else if (isResizingRight) {
      const newEnd = new Date(task.end);
      newEnd.setDate(task.end.getDate() + dayDelta);
      if (newEnd >= task.start) {
        onUpdateTask({ id: task.id, end: newEnd });
      }
    }
    // Update initialX to prevent cumulative deltas on each mousemove event
    setInitialX(initialX + colDelta * colWidth);
  }, [isDragging, isResizingLeft, isResizingRight, initialX, colWidth, timelineView, task, onUpdateTask, isGroup]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizingLeft(false);
    setIsResizingRight(false);
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  React.useEffect(() => {
    if (isDragging || isResizingLeft || isResizingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizingLeft, isResizingRight, handleMouseMove, handleMouseUp]);

  const handleSaveModal = (updatedTask: Task) => {
    onUpdateTask({
        id: updatedTask.id,
        name: updatedTask.name,
        assignee: updatedTask.assignee,
        start: updatedTask.start,
        end: updatedTask.end,
        color: updatedTask.color
    });
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        ref={barRef}
        className={`absolute flex items-center group shadow-md border ${isGroup ? 'cursor-default h-3 rounded-sm' : 'h-8 rounded-lg cursor-move'}`}
        style={{ 
          top: isGroup ? index * ROW_HEIGHT + (ROW_HEIGHT - 12) / 2 : top,
          left, 
          width, 
          minWidth: isGroup ? 0 : colWidth,
          backgroundColor: isGroup ? '#A8A29E' : (task.color || '#3B82F6'),
          borderColor: isGroup ? '#78716C' : (task.color ? 'rgba(0,0,0,0.2)' : '#2563EB'),
        }}
        onMouseDown={handleDragStart}
        onDoubleClick={isGroup ? undefined : () => setIsModalOpen(true)}
      >
        {!isGroup ? (
          <>
            <div 
              className="absolute left-0 top-0 h-full w-2 cursor-ew-resize rounded-l-lg"
              onMouseDown={(e) => handleResizeStart(e, 'left')}
            />
            <div className={`px-2 text-white text-sm font-medium ${isExporting ? 'whitespace-nowrap' : 'truncate'}`}>
              {task.name}
            </div>
            <div 
              className="absolute right-0 top-0 h-full w-2 cursor-ew-resize rounded-r-lg"
              onMouseDown={(e) => handleResizeStart(e, 'right')}
            />
          </>
        ) : (
          <>
            <div className="absolute -left-1 -bottom-1 w-2 h-2 border-l-2 border-b-2 border-stone-600"></div>
            <div className="absolute -right-1 -bottom-1 w-2 h-2 border-r-2 border-b-2 border-stone-600"></div>
          </>
        )}
        <div className={`absolute -bottom-5 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded-md transition-opacity whitespace-nowrap z-20 ${isExporting ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`}>
          {task.assignee}: {task.start.toLocaleDateString()} - {task.end.toLocaleDateString()}
        </div>
      </div>
      {isModalOpen && !isGroup && (
        <EditTaskModal 
          task={task}
          users={users}
          onSave={handleSaveModal}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default GanttBar;