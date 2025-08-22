import React, { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import { PlusIcon } from './icons/PlusIcon';
import { ExportIcon } from './icons/ExportIcon';
import { PdfIcon } from './icons/PdfIcon';
import { Project, TimelineView } from '../types';
import { FolderPlusIcon } from './icons/FolderPlusIcon';
import { UsersIcon } from './icons/UsersIcon';
import { CogIcon } from './icons/CogIcon';
import { ImageIcon } from './icons/ImageIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { GanttChartIcon } from './icons/GanttChartIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { LogoutIcon } from './icons/LogoutIcon';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  projects: Project[];
  activeProject: Project | undefined;
  onSwitchProject: (id: number) => void;
  onCreateProject: () => void;
  onManageProjects: () => void;
  onAddTask: () => void;
  onAddGroup: () => void;
  onExportExcel: () => void;
  onExportRequest: (type: 'pdf' | 'png') => void;
  onManageUsers: () => void;
  onConfigureWorkdays: () => void;
  isExporting: boolean;
  currentView: 'gantt' | 'dashboard';
  onViewChange: (view: 'gantt' | 'dashboard') => void;
  timelineView: TimelineView;
  onTimelineViewChange: (view: TimelineView) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentUser,
  onLogout,
  projects,
  activeProject,
  onSwitchProject,
  onCreateProject,
  onManageProjects,
  onAddTask, 
  onAddGroup,
  onExportExcel, 
  onExportRequest,
  onManageUsers,
  onConfigureWorkdays,
  isExporting,
  currentView,
  onViewChange,
  timelineView,
  onTimelineViewChange 
}) => {
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const exportMenuRef = useRef<HTMLDivElement>(null);
    const projectMenuRef = useRef<HTMLDivElement>(null);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
                setIsExportMenuOpen(false);
            }
            if (projectMenuRef.current && !projectMenuRef.current.contains(event.target as Node)) {
                setIsProjectMenuOpen(false);
            }
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const mainViewButtonClasses = (view: 'gantt' | 'dashboard') =>
    `flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${
      currentView === view
        ? 'bg-blue-600 text-white shadow'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`;

    const timelineButtonClasses = (view: TimelineView) => 
    `px-3 py-1 text-sm font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${
      timelineView === view 
        ? 'bg-blue-600 text-white shadow' 
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`;
    
    const handleExportClick = (type: 'excel' | 'pdf' | 'png') => {
        if (isExporting) return;
        if (type === 'excel') onExportExcel();
        else onExportRequest(type);
        setIsExportMenuOpen(false);
    };

    const handleProjectSwitch = (id: number) => {
        onSwitchProject(id);
        setIsProjectMenuOpen(false);
    }
    
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0 z-20">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-gray-700">Minka</span>
          <div className="w-px h-6 bg-gray-300"></div>

          <div className="relative" ref={projectMenuRef}>
            <button
              onClick={() => setIsProjectMenuOpen(prev => !prev)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-blue-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <BriefcaseIcon className="w-5 h-5 text-blue-500" />
              <span className="max-w-xs truncate">{activeProject?.name ?? 'No Project Selected'}</span>
              <svg className={`w-4 h-4 text-blue-500 transition-transform ${isProjectMenuOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isProjectMenuOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg z-30 border border-gray-200">
                  <div className="p-2 text-xs font-semibold text-gray-500 border-b">SWITCH PROJECT</div>
                  <ul className="py-1 max-h-48 overflow-y-auto">
                      {projects.map(p => (
                          <li key={p.id}>
                              <button onClick={() => handleProjectSwitch(p.id)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                  {p.name}
                                  {p.id === activeProject?.id && <span className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></span>}
                              </button>
                          </li>
                      ))}
                  </ul>
                  <div className="border-t">
                    <button onClick={() => { onCreateProject(); setIsProjectMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Create New Project
                    </button>
                    <button onClick={() => { onManageProjects(); setIsProjectMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Manage Projects...
                    </button>
                  </div>
              </div>
            )}
          </div>
          
          {activeProject && (
              <div className="flex items-center p-1 bg-gray-100 rounded-lg">
                <button onClick={() => onViewChange('gantt')} className={mainViewButtonClasses('gantt')}>
                  <GanttChartIcon className="w-5 h-5" /> Gantt
                </button>
                <button onClick={() => onViewChange('dashboard')} className={mainViewButtonClasses('dashboard')}>
                    <ChartBarIcon className="w-5 h-5" /> Dashboard
                </button>
              </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
            <div className="relative" ref={profileMenuRef}>
            <button
                onClick={() => setIsProfileMenuOpen(prev => !prev)}
                className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                aria-label="Open user menu"
                aria-haspopup="true"
                aria-expanded={isProfileMenuOpen}
            >
                <UserCircleIcon className="w-6 h-6 text-gray-600" />
            </button>
            {isProfileMenuOpen && currentUser && (
                <div 
                    className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-30 border border-gray-200"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                >
                    <div className="p-4 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800 truncate" title={currentUser.email ?? ''}>
                            {currentUser.email}
                        </p>
                        {currentUser.metadata.creationTime && (
                            <p className="text-xs text-gray-500 mt-1">
                                Member since {new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </p>
                        )}
                    </div>
                    <div className="p-2">
                        <button 
                            onClick={() => { onLogout(); setIsProfileMenuOpen(false); }} 
                            className="w-full text-left flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                            role="menuitem"
                        >
                            <LogoutIcon className="w-5 h-5 mr-3 text-gray-500" />
                            Log Out
                        </button>
                    </div>
                </div>
            )}
            </div>
        </div>
      </div>
      
      {/* Bottom Action Row / Toolbar */}
      {activeProject && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center gap-3">
                {currentView === 'gantt' && (
                    <>
                        <button onClick={onAddGroup} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-150">
                          <FolderPlusIcon className="w-5 h-5 mr-2" />Add Group
                        </button>
                        <button onClick={onAddTask} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150">
                          <PlusIcon className="w-5 h-5 mr-2" />Add Task
                        </button>
                    </>
                )}
            </div>
            <div className="flex items-center gap-3">
                {currentView === 'gantt' && (
                    <div className="flex items-center p-1 bg-gray-100 rounded-lg">
                        <button onClick={() => onTimelineViewChange('day')} className={timelineButtonClasses('day')}>Day</button>
                        <button onClick={() => onTimelineViewChange('week')} className={timelineButtonClasses('week')}>Week</button>
                    </div>
                )}
                <button onClick={onConfigureWorkdays} className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-150">
                  <CogIcon className="w-5 h-5 mr-2" />Workdays
                </button>
                <button onClick={onManageUsers} className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-150">
                  <UsersIcon className="w-5 h-5 mr-2" />Manage Users
                </button>
                <div className="relative" ref={exportMenuRef}>
                    <button
                        onClick={() => setIsExportMenuOpen(prev => !prev)}
                        disabled={isExporting || !activeProject}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        <ExportIcon className="w-5 h-5 mr-2" />
                        {isExporting ? 'Exporting...' : 'Export'}
                        <svg className={`w-4 h-4 ml-1 transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {isExportMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                            <ul className="py-1">
                                <li>
                                    <button onClick={() => handleExportClick('png')} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <ImageIcon className="w-5 h-5 mr-3 text-teal-600" /><span>as PNG</span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => handleExportClick('pdf')} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <PdfIcon className="w-5 h-5 mr-3 text-red-600" /><span>as PDF</span>
                                    </button>
                                </li>
                                {currentView === 'gantt' && (
                                     <li>
                                        <button onClick={() => handleExportClick('excel')} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <ExportIcon className="w-5 h-5 mr-3 text-emerald-600" /><span>as Excel</span>
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </header>
  );
};

export default Header;