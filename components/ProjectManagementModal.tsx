
import React, { useState } from 'react';
import { Project } from '../types';
import { DeleteIcon } from './icons/DeleteIcon';
import { PencilIcon } from './icons/PencilIcon';

interface ProjectManagementModalProps {
  projects: Project[];
  onClose: () => void;
  onUpdateProject: (projectId: number, newName: string) => void;
  onDeleteProject: (projectId: number) => void;
}

const WarningIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);


const ProjectManagementModal: React.FC<ProjectManagementModalProps> = ({ projects, onClose, onUpdateProject, onDeleteProject }) => {
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectPendingDeletion, setProjectPendingDeletion] = useState<Project | null>(null);

  const handleStartEdit = (project: Project) => {
    setEditingProjectId(project.id);
    setProjectName(project.name);
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setProjectName('');
  };

  const handleSaveEdit = () => {
    if (editingProjectId && projectName.trim()) {
      onUpdateProject(editingProjectId, projectName.trim());
      handleCancelEdit();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const confirmDelete = () => {
    if (projectPendingDeletion) {
      onDeleteProject(projectPendingDeletion.id);
      setProjectPendingDeletion(null);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-management-title"
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative"
        onClick={e => e.stopPropagation()}
      >
        <h2 id="project-management-title" className="text-xl font-bold mb-4 text-gray-800">Manage Projects</h2>
        <div className="space-y-4">
          <div className="max-h-80 overflow-y-auto border rounded-md ">
            <ul className="divide-y divide-gray-200">
              {projects.map(project => (
                <li key={project.id} className="p-2 flex justify-between items-center text-sm">
                  {editingProjectId === project.id ? (
                    <input
                        type="text"
                        value={projectName}
                        onChange={e => setProjectName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSaveEdit}
                        autoFocus
                        className="flex-grow px-2 py-1 bg-white border border-blue-400 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <span>{project.name}</span>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <button 
                        onClick={() => handleStartEdit(project)} 
                        className="p-1 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                        aria-label={`Rename project ${project.name}`}
                    >
                        <PencilIcon className="w-5 h-5" />
                    </button>
                    {projects.length > 1 && (
                         <button 
                            onClick={() => setProjectPendingDeletion(project)} 
                            className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors"
                            aria-label={`Delete project ${project.name}`}
                        >
                            <DeleteIcon className="w-5 h-5" />
                        </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Done
          </button>
        </div>
        
        {projectPendingDeletion && (
          <div 
            className="absolute inset-0 bg-white bg-opacity-95 flex justify-center items-center rounded-lg p-4"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
          >
            <div className="bg-white p-6 rounded-lg shadow-2xl border border-gray-200 max-w-sm w-full">
                <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <WarningIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="delete-confirm-title">
                            Delete Project
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Are you sure you want to delete "{projectPendingDeletion.name}"? All of its tasks will be permanently removed. This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={confirmDelete}
                    >
                        Confirm Delete
                    </button>
                    <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => setProjectPendingDeletion(null)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManagementModal;