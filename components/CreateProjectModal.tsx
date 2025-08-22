
import React, { useState, useEffect, useMemo } from 'react';

interface CreateProjectModalProps {
  onClose: () => void;
  onCreate: (projectName: string) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onCreate }) => {
  const [projectName, setProjectName] = useState('');
  
  const MAX_CHARS = 20;
  
  const isValid = useMemo(() => {
    const trimmedName = projectName.trim();
    return trimmedName.length > 0 && trimmedName.length <= MAX_CHARS;
  }, [projectName]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onCreate(projectName.trim());
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const charCountColor = projectName.length > MAX_CHARS ? 'text-red-600' : 'text-gray-500';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-project-title"
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleCreate}>
          <h2 id="create-project-title" className="text-xl font-bold mb-4 text-gray-800">Create New Project</h2>
          
          <div className="space-y-4">
             <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">Project Name</label>
              <div className="relative mt-1">
                <input 
                  type="text" 
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  maxLength={MAX_CHARS + 5} // Allow user to type over, but show error
                  autoFocus
                  required
                />
                 <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono ${charCountColor}`}>
                  {projectName.length}/{MAX_CHARS}
                </span>
              </div>
              {projectName.length > MAX_CHARS && (
                <p className="mt-2 text-sm text-red-600">
                  Project name cannot exceed {MAX_CHARS} characters.
                </p>
              )}
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
              disabled={!isValid}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
