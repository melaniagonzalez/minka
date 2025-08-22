
import React, { useState } from 'react';
import { Task } from '../types';

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
  users: string[];
}

// Helper to format date for input[type=date]
const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Helper to get contrasting text color (black or white)
const getContrastYIQ = (hexcolor: string) => {
	hexcolor = hexcolor.replace("#", "");
	const r = parseInt(hexcolor.substr(0,2),16);
	const g = parseInt(hexcolor.substr(2,2),16);
	const b = parseInt(hexcolor.substr(4,2),16);
	const yiq = ((r*299)+(g*587)+(b*114))/1000;
	return (yiq >= 128) ? '#000000' : '#FFFFFF';
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, users, onClose, onSave }) => {
  const [name, setName] = useState(task.name);
  const [assignee, setAssignee] = useState(task.assignee);
  const [startDate, setStartDate] = useState(formatDateForInput(task.start));
  const [endDate, setEndDate] = useState(formatDateForInput(task.end));
  const [color, setColor] = useState(task.color || '#3B82F6');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // The date from the input is at UTC midnight. To avoid timezone issues where the date might shift
    // by a day, we construct the new Date object by appending T00:00:00 which interprets it in the local timezone.
    const newStartDate = new Date(startDate + 'T00:00:00');
    const newEndDate = new Date(endDate + 'T00:00:00');

    if (newEndDate < newStartDate) {
      alert('End date cannot be before start date.');
      return;
    }

    onSave({
      ...task,
      name,
      assignee,
      start: newStartDate,
      end: newEndDate,
      color: color,
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-task-title"
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <form onSubmit={handleSave}>
          <h2 id="edit-task-title" className="text-xl font-bold mb-4 text-gray-800">Edit Task</h2>
          
          <div className="space-y-4">
             <div>
              <label htmlFor="taskName" className="block text-sm font-medium text-gray-700">Task Name</label>
              <input 
                type="text" 
                id="taskName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">Assignee</label>
              <select
                id="assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {users.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
                {!users.includes(task.assignee) && (
                  <option key={task.assignee} value={task.assignee}>{task.assignee} (deleted)</option>
                )}
              </select>
            </div>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
              <input 
                type="date" 
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
              <input 
                type="date" 
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700">Bar Color</label>
              <div className="mt-1 flex items-center gap-3">
                <input 
                  type="color" 
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 w-10 p-1 border-none rounded-md cursor-pointer bg-white"
                />
                <div className="flex-grow px-3 py-2 rounded-md border border-gray-300" style={{ backgroundColor: color }}>
                  <span style={{ color: getContrastYIQ(color), mixBlendMode: 'difference' }}>
                    {color.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;