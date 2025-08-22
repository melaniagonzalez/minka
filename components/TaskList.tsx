
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Task, ProcessedTask } from '../types';
import { DeleteIcon } from './icons/DeleteIcon';
import { DragHandleIcon } from './icons/DragHandleIcon';
import { ROW_HEIGHT, HEADER_HEIGHT } from '../constants';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { FolderIcon } from './icons/FolderIcon';
import { TaskIcon } from './icons/TaskIcon';

const MIN_COL_WIDTH = 80; // Minimum column width in pixels

interface EditableCellProps {
  value: string;
  onSave: (value: string) => void;
  type?: 'text' | 'number';
  className?: string;
  suffix?: string;
}

const EditableCell: React.FC<EditableCellProps> = ({ value, onSave, type = 'text', className = '', suffix = '' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleSave = () => {
    onSave(currentValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type={type}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        autoFocus
        className={`w-full px-2 py-1 text-sm border border-blue-400 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`w-full px-2 py-1 text-sm truncate cursor-pointer hover:bg-gray-100 rounded-md ${className}`}
    >
      {value ? `${value}${suffix}` : <span className="text-gray-400">--</span>}
    </div>
  );
};

interface TaskListProps {
  tasks: ProcessedTask[];
  users: string[];
  onUpdateTask: (updatedFields: Partial<Task> & { id: number }) => void;
  onDeleteTask: (taskId: number) => void;
  onReorderTask: (draggedId: number, dropTargetId: number) => void;
  onToggleCollapse: (taskId: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, users, onUpdateTask, onDeleteTask, onReorderTask, onToggleCollapse }) => {
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<number | null>(null);
  
  const [colFlex, setColFlex] = useState({
    taskName: 6,
    assignee: 4,
    duration: 2,
    dependencies: 2,
  });

  const resizingRef = useRef<{ active: boolean; handle: 'taskName' | 'assignee' | 'duration'; startX: number; startFlex: typeof colFlex; } | null>(null);
  
  const handleResizeStart = useCallback((e: React.MouseEvent, handle: 'taskName' | 'assignee' | 'duration') => {
    e.preventDefault();
    resizingRef.current = {
      active: true,
      handle,
      startX: e.clientX,
      startFlex: colFlex,
    };

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [colFlex]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizingRef.current?.active) return;

    const { handle, startX, startFlex } = resizingRef.current;
    const deltaX = e.clientX - startX;
    
    const container = e.target instanceof Element ? e.target.parentElement?.parentElement : null;
    if (!container) return;
    
    const containerWidth = container.offsetWidth;
    const totalFlex = startFlex.taskName + startFlex.assignee + startFlex.duration + startFlex.dependencies;
    const pixelPerFlex = containerWidth / totalFlex;

    if (pixelPerFlex <= 0) return;

    const deltaFlex = deltaX / pixelPerFlex;

    if (handle === 'taskName') {
      const newFlex1 = startFlex.taskName + deltaFlex;
      const newFlex2 = startFlex.assignee - deltaFlex;
      if (newFlex1 * pixelPerFlex > MIN_COL_WIDTH && newFlex2 * pixelPerFlex > MIN_COL_WIDTH) {
        setColFlex(prev => ({ ...prev, taskName: newFlex1, assignee: newFlex2 }));
      }
    } else if (handle === 'assignee') {
      const newFlex1 = startFlex.assignee + deltaFlex;
      const newFlex2 = startFlex.duration - deltaFlex;
      if (newFlex1 * pixelPerFlex > MIN_COL_WIDTH && newFlex2 * pixelPerFlex > MIN_COL_WIDTH) {
        setColFlex(prev => ({ ...prev, assignee: newFlex1, duration: newFlex2 }));
      }
    } else if (handle === 'duration') {
      const newFlex1 = startFlex.duration + deltaFlex;
      const newFlex2 = startFlex.dependencies - deltaFlex;
      if (newFlex1 * pixelPerFlex > MIN_COL_WIDTH && newFlex2 * pixelPerFlex > MIN_COL_WIDTH) {
        setColFlex(prev => ({ ...prev, duration: newFlex1, dependencies: newFlex2 }));
      }
    }
  }, []);

  const handleResizeEnd = useCallback(() => {
    resizingRef.current = null;
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleResizeMove]);

  const { taskIdToRowNumberMap, rowNumberToTaskIdMap } = useMemo(() => {
    const idToRow = new Map<number, number>();
    const rowToId = new Map<number, number>();
    let taskCounter = 0;
    tasks.forEach(task => {
      if (task.type === 'task') {
        taskCounter++;
        idToRow.set(task.id, taskCounter);
        rowToId.set(taskCounter, task.id);
      }
    });
    return { taskIdToRowNumberMap: idToRow, rowNumberToTaskIdMap: rowToId };
  }, [tasks]);

  const getDependenciesString = useCallback((dependencies?: number[]): string => {
      if (!dependencies) return '';
      return dependencies.map(id => taskIdToRowNumberMap.get(id)).filter(Boolean).join(', ');
  }, [taskIdToRowNumberMap]);

  const handleUpdateDependencies = useCallback((task: ProcessedTask, value: string) => {
      const rowNumbers = value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      const dependencyIds = rowNumbers
          .map(num => rowNumberToTaskIdMap.get(num))
          .filter((id): id is number => id !== undefined);
      
      onUpdateTask({ id: task.id, dependencies: dependencyIds.length > 0 ? dependencyIds : undefined });
  }, [rowNumberToTaskIdMap, onUpdateTask]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: number) => {
    e.dataTransfer.setData('text/plain', taskId.toString());
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, taskId: number) => {
    e.preventDefault();
    if (taskId !== draggedTaskId) {
      setDragOverTaskId(taskId);
    }
  };

  const handleDragLeave = () => {
    setDragOverTaskId(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropTaskId: number) => {
    e.preventDefault();
    const draggedId = Number(e.dataTransfer.getData('text/plain'));
    if (draggedId && draggedId !== dropTaskId) {
      onReorderTask(draggedId, dropTaskId);
    }
    setDraggedTaskId(null);
    setDragOverTaskId(null);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverTaskId(null);
  };

  return (
    <div className="w-full flex flex-col">
      <div 
        className="flex p-2 bg-gray-50 border-b font-semibold text-sm text-gray-600 sticky top-0 z-10 items-center gap-2"
        style={{ height: `${HEADER_HEIGHT}px` }}
      >
        <div className="w-8 text-center flex-shrink-0">#</div>
        <div className="w-6 flex-shrink-0" aria-label="Drag handle column"></div>
        <div className="pr-2 truncate" style={{ flex: `${colFlex.taskName}` }}>
          <span className="pl-14">Task Name</span>
        </div>
        <div 
          className="w-1.5 h-6 flex-shrink-0 cursor-col-resize rounded-full bg-gray-300 hover:bg-blue-400 transition-colors"
          onMouseDown={(e) => handleResizeStart(e, 'taskName')}
        />
        <div className="px-2 truncate" style={{ flex: `${colFlex.assignee}` }}>Assignee</div>
        <div 
          className="w-1.5 h-6 flex-shrink-0 cursor-col-resize rounded-full bg-gray-300 hover:bg-blue-400 transition-colors"
          onMouseDown={(e) => handleResizeStart(e, 'assignee')}
        />
        <div className="px-2 truncate" style={{ flex: `${colFlex.duration}` }}>Duration (d)</div>
        <div 
          className="w-1.5 h-6 flex-shrink-0 cursor-col-resize rounded-full bg-gray-300 hover:bg-blue-400 transition-colors"
          onMouseDown={(e) => handleResizeStart(e, 'duration')}
        />
        <div className="px-2 truncate text-center" style={{ flex: `${colFlex.dependencies}` }}>Dependencies</div>
        <div className="w-16 text-right flex-shrink-0">Action</div>
      </div>
      <div className="divide-y divide-gray-200">
        {tasks.map((task) => {
          const isBeingDragged = draggedTaskId === task.id;
          const isDragOver = dragOverTaskId === task.id;

          return (
            <div 
              key={task.id} 
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              onDragOver={(e) => handleDragOver(e, task.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, task.id)}
              onDragEnd={handleDragEnd}
              className={`
                flex p-2 items-center transition-all duration-150 cursor-grab gap-2
                ${isBeingDragged
                  ? 'opacity-30 bg-blue-50'
                  : isDragOver && task.type === 'group'
                    ? 'bg-blue-100 ring-1 ring-blue-400'
                    : task.type === 'group'
                      ? 'bg-stone-100 font-medium hover:bg-stone-200'
                      : 'hover:bg-gray-50'
                }
                ${isDragOver && task.type === 'task'
                  ? 'border-t-2 border-blue-500'
                  : 'border-t-2 border-transparent'
                }
              `}
              style={{ height: `${ROW_HEIGHT}px` }}
            >
              <div className="w-8 flex items-center justify-center text-sm text-gray-500 flex-shrink-0">
                {task.type === 'task' ? taskIdToRowNumberMap.get(task.id) : ''}
              </div>
              <div className="w-6 flex-shrink-0 flex items-center justify-center text-gray-400" title="Drag to reorder">
                <DragHandleIcon className="w-5 h-5" />
              </div>
              <div className="pr-2 flex items-center" style={{ flex: `${colFlex.taskName}`, minWidth: 0, paddingLeft: `${task.level * 24}px` }}>
                  {task.type === 'group' ? (
                    <button 
                        onClick={() => onToggleCollapse(task.id)}
                        className="mr-1 p-0.5 rounded-full hover:bg-gray-200 flex-shrink-0"
                        aria-label={task.isCollapsed ? `Expand ${task.name}` : `Collapse ${task.name}`}
                    >
                        <ChevronRightIcon className={`w-4 h-4 text-gray-500 transition-transform duration-150 ${!task.isCollapsed ? 'rotate-90' : ''}`} />
                    </button>
                  ) : (
                    <div className="w-6 mr-1 flex-shrink-0" />
                  )}
                  
                  {task.type === 'group' ? (
                      <FolderIcon className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" />
                  ) : (
                      <TaskIcon className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                  )}

                  <EditableCell 
                    value={task.name} 
                    onSave={(name) => onUpdateTask({ id: task.id, name })} 
                  />
              </div>
              <div className="w-1.5 flex-shrink-0" />
              <div className="px-2" style={{ flex: `${colFlex.assignee}`, minWidth: 0 }}>
                 <select
                    value={task.assignee}
                    onChange={(e) => onUpdateTask({ id: task.id, assignee: e.target.value })}
                    className="w-full px-2 py-1 text-sm border border-transparent hover:border-gray-300 rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer transition-colors"
                  >
                    {users.map(user => (
                      <option key={user} value={user}>{user}</option>
                    ))}
                    {!users.includes(task.assignee) && (
                      <option key={task.assignee} value={task.assignee}>{task.assignee} (deleted)</option>
                    )}
                  </select>
              </div>
              <div className="w-1.5 flex-shrink-0" />
              <div className="px-2" style={{ flex: `${colFlex.duration}`, minWidth: 0 }}>
                 {task.type === 'task' ? (
                  <EditableCell
                    value={(task.duration || 0).toString()}
                    onSave={(newDurationStr) => {
                        const newDuration = parseInt(newDurationStr, 10);
                        if (!isNaN(newDuration) && newDuration > 0) {
                            onUpdateTask({ id: task.id, duration: newDuration });
                        }
                    }}
                    type="number"
                    className="text-center"
                    suffix="d"
                  />
                 ) : (
                  <div className="w-full px-2 py-1 text-sm text-center text-gray-400 truncate">--</div>
                 )}
              </div>
              <div className="w-1.5 flex-shrink-0" />
              <div className="px-2" style={{ flex: `${colFlex.dependencies}`, minWidth: 0 }}>
                 {task.type === 'task' ? (
                  <EditableCell 
                    value={getDependenciesString(task.dependencies)} 
                    onSave={(value) => handleUpdateDependencies(task, value)} 
                    type="text"
                    className="text-center"
                  />
                 ) : (
                  <div className="w-full px-2 py-1 text-sm text-gray-400 truncate text-center">--</div>
                 )}
              </div>
              <div className="w-16 flex justify-end flex-shrink-0">
                <button onClick={() => onDeleteTask(task.id)} className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors duration-150">
                  <DeleteIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskList;