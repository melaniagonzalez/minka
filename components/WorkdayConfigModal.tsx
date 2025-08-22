
import React, { useState } from 'react';

interface WorkdayConfigModalProps {
  currentWorkdays: number[];
  onClose: () => void;
  onSave: (newWorkdays: number[]) => void;
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const WorkdayConfigModal: React.FC<WorkdayConfigModalProps> = ({ currentWorkdays, onClose, onSave }) => {
  const [selectedDays, setSelectedDays] = useState(new Set(currentWorkdays));

  const handleDayToggle = (dayIndex: number) => {
    const newSelection = new Set(selectedDays);
    if (newSelection.has(dayIndex)) {
      newSelection.delete(dayIndex);
    } else {
      newSelection.add(dayIndex);
    }
    setSelectedDays(newSelection);
  };

  const handleSave = () => {
    onSave(Array.from(selectedDays).sort());
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="workday-config-title"
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <h2 id="workday-config-title" className="text-xl font-bold mb-4 text-gray-800">Configure Workdays</h2>
        <p className="text-sm text-gray-600 mb-4">Select the days to be considered as working days for duration calculations.</p>
        
        <div className="space-y-2">
          {dayNames.map((day, index) => (
            <label key={index} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedDays.has(index)}
                onChange={() => handleDayToggle(index)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700 font-medium">{day}</span>
            </label>
          ))}
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
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkdayConfigModal;