
import React, { useState } from 'react';
import { DeleteIcon } from './icons/DeleteIcon';

interface UserManagementModalProps {
  users: string[];
  onClose: () => void;
  onAddUser: (newUser: string) => void;
  onDeleteUser: (user: string) => void;
}

const WarningIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);


const UserManagementModal: React.FC<UserManagementModalProps> = ({ users, onClose, onAddUser, onDeleteUser }) => {
  const [newUser, setNewUser] = useState('');
  const [userPendingDeletion, setUserPendingDeletion] = useState<string | null>(null);

  const handleAdd = () => {
    if (newUser.trim()) {
      onAddUser(newUser.trim());
      setNewUser('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const confirmDelete = () => {
    if (userPendingDeletion) {
      onDeleteUser(userPendingDeletion);
      setUserPendingDeletion(null);
    }
  };

  const cancelDelete = () => {
    setUserPendingDeletion(null);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-management-title"
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative"
        onClick={e => e.stopPropagation()}
      >
        <h2 id="user-management-title" className="text-xl font-bold mb-4 text-gray-800">Manage Users</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter new user name"
              className="flex-grow mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              aria-label="New user name"
            />
            <button 
              onClick={handleAdd} 
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 self-end"
            >
              Add
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto border rounded-md ">
            <ul className="divide-y divide-gray-200">
              {users.map(user => (
                <li key={user} className="p-2 flex justify-between items-center text-sm">
                  <span>{user}</span>
                  {user !== 'Unassigned' && (
                    <button 
                      onClick={() => setUserPendingDeletion(user)} 
                      className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors"
                      aria-label={`Delete user ${user}`}
                    >
                      <DeleteIcon className="w-5 h-5" />
                    </button>
                  )}
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
        
        {userPendingDeletion && (
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
                            Delete User
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Are you sure you want to delete "{userPendingDeletion}"? All tasks assigned to this user will be set to "Unassigned". This action cannot be undone.
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
                        onClick={cancelDelete}
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

export default UserManagementModal;