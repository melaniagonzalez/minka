
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { Task, TimelineView, ProcessedTask, Project, AuthView } from './types';
import { INITIAL_PROJECTS, INITIAL_USERS } from './constants';
import Header from './components/Header';
import TaskList from './components/TaskList';
import GanttChart from './components/GanttChart';
import Dashboard from './components/Dashboard';
import UserManagementModal from './components/UserManagementModal';
import WorkdayConfigModal from './components/WorkdayConfigModal';
import ProjectManagementModal from './components/ProjectManagementModal';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { calculateBusinessDays, calculateEndDate } from './components/utils';
import { BriefcaseIcon } from './components/icons/BriefcaseIcon';

const MIN_SIDEBAR_WIDTH = 280;
const MAX_SIDEBAR_WIDTH = 900;

const App: React.FC = () => {
  const [view, setView] = useState<AuthView>('homepage');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<number | null>(INITIAL_PROJECTS[0]?.id ?? null);
  const [users, setUsers] = useState<string[]>(INITIAL_USERS);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [timelineView, setTimelineView] = useState<TimelineView>('day');
  const [exportRequest, setExportRequest] = useState<'pdf' | 'png' | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [taskListWidth, setTaskListWidth] = useState(650);
  const [workdays, setWorkdays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [isWorkdayModalOpen, setIsWorkdayModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'gantt' | 'dashboard'>('gantt');
  
  const printRef = useRef<HTMLDivElement>(null);
  const taskListRef = useRef<HTMLDivElement>(null);
  const ganttContainerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setIsAuthenticated(true);
        setView('app');
      } else {
        setIsAuthenticated(false);
        // Don't reset view to homepage automatically, allow user to be on login/signup
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const activeProject = useMemo(() => 
    projects.find(p => p.id === activeProjectId), 
    [projects, activeProjectId]
  );
  const tasks = useMemo(() => activeProject?.tasks ?? [], [activeProject]);

  const handleLogout = useCallback(async () => {
    try {
        await signOut(auth);
        setView('homepage');
    } catch (error) {
        console.error("Error signing out: ", error);
        alert("Could not log out. Please try again.");
    }
  }, []);

  const processedTasks = useMemo((): ProcessedTask[] => {
    if (!tasks.length) return [];

    type ProcessedTaskNode = ProcessedTask & { children: ProcessedTaskNode[] };

    const taskMap = new Map<number, ProcessedTaskNode>();
    tasks.forEach(task => taskMap.set(task.id, { ...task, level: 0, children: [] }));

    const tree: ProcessedTaskNode[] = [];
    tasks.forEach(task => {
        const processed = taskMap.get(task.id)!;
        if (task.parentId && taskMap.has(task.parentId)) {
            taskMap.get(task.parentId)!.children.push(processed);
        } else {
            tree.push(processed);
        }
    });
    
    const memoizedDates = new Map<number, { start: Date, end: Date }>();
    const calculateGroupDates = (task: ProcessedTaskNode): { start: Date, end: Date } => {
        if (memoizedDates.has(task.id)) {
            return memoizedDates.get(task.id)!;
        }

        if (task.type !== 'group' || task.children.length === 0) {
            const startDate = task.start || new Date();
            const endDate = task.end || new Date();
            return { start: new Date(startDate), end: new Date(endDate) };
        }

        const childDates = task.children.map(calculateGroupDates);
        
        const minStart = new Date(Math.min(...childDates.map(d => d.start.getTime())));
        const maxEnd = new Date(Math.max(...childDates.map(d => d.end.getTime())));

        memoizedDates.set(task.id, { start: minStart, end: maxEnd });
        return { start: minStart, end: maxEnd };
    };

    taskMap.forEach(task => {
        if (task.type === 'group') {
            const dates = calculateGroupDates(task);
            task.start = dates.start;
            task.end = dates.end;
        }
    });

    const visibleTasks: ProcessedTask[] = [];
    const buildVisibleList = (currentTasks: ProcessedTaskNode[], level: number) => {
      currentTasks.sort((a, b) => tasks.findIndex(t => t.id === a.id) - tasks.findIndex(t => t.id === b.id));
      for (const task of currentTasks) {
        const { children, ...restOfTask } = task;
        visibleTasks.push({ ...restOfTask, level });
        if (task.type === 'group' && !task.isCollapsed && children.length > 0) {
          buildVisibleList(children, level + 1);
        }
      }
    };

    buildVisibleList(tree, 0);
    return visibleTasks;
  }, [tasks]);

  const updateActiveProjectTasks = (updater: (tasks: Task[]) => Task[]) => {
    setProjects(prevProjects => prevProjects.map(p => {
        if (p.id !== activeProjectId) return p;
        const newTasks = updater(p.tasks);
        return { ...p, tasks: newTasks };
    }));
  };

  const handleToggleCollapse = useCallback((taskId: number) => {
    updateActiveProjectTasks(currentTasks => 
        currentTasks.map(task =>
            task.id === taskId && task.type === 'group'
                ? { ...task, isCollapsed: !task.isCollapsed }
                : task
        )
    );
  }, [activeProjectId]);

  const handleAddGroup = useCallback(() => {
    updateActiveProjectTasks(currentTasks => {
        const newGroup: Task = {
            id: Date.now(),
            name: 'New Group',
            assignee: 'Unassigned',
            start: new Date(),
            end: new Date(),
            type: 'group',
            isCollapsed: false,
        };
        return [...currentTasks, newGroup];
    });
  }, [activeProjectId]);

  const handleAddTask = useCallback(() => {
    updateActiveProjectTasks(currentTasks => {
        let newStartDate: Date;

        if (currentTasks.length === 0) {
            newStartDate = new Date();
        } else {
            const latestEndDate = currentTasks.reduce((maxDate, task) => {
                const endDate = new Date(task.end);
                return endDate > maxDate ? endDate : maxDate;
            }, new Date(0));
            
            newStartDate = new Date(latestEndDate);
            newStartDate.setDate(newStartDate.getDate() + 1);
        }
        
        const workdaySet = new Set(workdays);
        // Ensure the task starts on a workday
        while (!workdaySet.has(newStartDate.getDay())) {
            newStartDate.setDate(newStartDate.getDate() + 1);
        }

        const newEndDate = calculateEndDate(newStartDate, 5, workdays);

        const newTask: Task = {
            id: Date.now(),
            name: 'New Task',
            assignee: 'Unassigned',
            start: newStartDate,
            end: newEndDate,
            duration: 5,
            color: '#3B82F6',
            type: 'task',
        };
        return [...currentTasks, newTask];
    });
  }, [activeProjectId, workdays]);

  const handleDeleteTask = useCallback((taskId: number) => {
    updateActiveProjectTasks(currentTasks => {
        const tasksToDelete = new Set<number>([taskId]);
        const findChildren = (parentId: number) => {
            currentTasks.forEach(task => {
                if (task.parentId === parentId) {
                    tasksToDelete.add(task.id);
                    if (task.type === 'group') findChildren(task.id);
                }
            });
        };
        
        const taskToDelete = currentTasks.find(t => t.id === taskId);
        if (taskToDelete?.type === 'group') findChildren(taskId);
        
        return currentTasks.filter(task => !tasksToDelete.has(task.id));
    });
  }, [activeProjectId]);

  const handleUpdateTask = useCallback((updatedFields: Partial<Task> & { id: number }) => {
    updateActiveProjectTasks(currentTasks => 
        currentTasks.map(task => {
            if (task.id !== updatedFields.id) return task;
            
            const newTask = { ...task, ...updatedFields };

            if (task.type === 'task') {
                if (updatedFields.duration !== undefined && updatedFields.duration !== task.duration) {
                    const newDuration = Math.max(1, updatedFields.duration);
                    newTask.duration = newDuration;
                    newTask.end = calculateEndDate(newTask.start, newDuration, workdays);
                } 
                else if (updatedFields.start || updatedFields.end) {
                    newTask.duration = calculateBusinessDays(newTask.start, newTask.end, workdays);
                }
            }
            return newTask;
        })
    );
  }, [activeProjectId, workdays]);

  const handleReorderTask = useCallback((draggedId: number, dropTargetId: number) => {
    if (draggedId === dropTargetId) return;

    updateActiveProjectTasks(currentTasks => {
        const newTasks = [...currentTasks];
        const draggedTask = newTasks.find(t => t.id === draggedId);
        const dropTargetTask = newTasks.find(t => t.id === dropTargetId);
        if (!draggedTask || !dropTargetTask) return currentTasks;

        const isDescendant = (parentId: number, childId: number): boolean => {
            const child = newTasks.find(t => t.id === childId);
            if (!child?.parentId) return false;
            if (child.parentId === parentId) return true;
            return isDescendant(parentId, child.parentId);
        };
        if (draggedTask.type === 'group' && isDescendant(draggedTask.id, dropTargetTask.id)) {
            console.warn("Action prevented: Cannot move a group into one of its own children.");
            return currentTasks;
        }

        const tasksWithoutDragged = newTasks.filter(t => t.id !== draggedId);
        let updatedDraggedTask: Task;
        let insertionIndex: number;

        if (dropTargetTask.type === 'group') {
            updatedDraggedTask = { ...draggedTask, parentId: dropTargetTask.id };
            insertionIndex = tasksWithoutDragged.findIndex(t => t.id === dropTargetId) + 1;
        } else {
            updatedDraggedTask = { ...draggedTask, parentId: dropTargetTask.parentId };
            insertionIndex = tasksWithoutDragged.findIndex(t => t.id === dropTargetId);
        }

        if (insertionIndex === -1) {
            tasksWithoutDragged.push(updatedDraggedTask);
            return tasksWithoutDragged;
        }
        tasksWithoutDragged.splice(insertionIndex, 0, updatedDraggedTask);
        return tasksWithoutDragged;
    });
  }, [activeProjectId]);

  const handleExportToExcel = useCallback(() => {
    const dataForExport = processedTasks.map(task => ({
      'Task Name': `${' '.repeat(task.level * 2)}${task.name}`,
      'Type': task.type,
      'Assignee': task.assignee,
      'Start Date': task.start.toLocaleDateString(),
      'End Date': task.end.toLocaleDateString(),
      'Duration (workdays)': task.type === 'task' ? task.duration : '',
      'Color': task.color,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
    XLSX.writeFile(workbook, `${activeProject?.name ?? 'Gantt'}-Tasks.xlsx`);
  }, [processedTasks, activeProject]);

  const handleRequestExport = useCallback((type: 'pdf' | 'png') => {
    if (isExporting) return;
    setIsExporting(true);
    setExportRequest(type);
  }, [isExporting]);

  const handleTimelineViewChange = useCallback((view: TimelineView) => {
    setTimelineView(view);
  }, []);
  
  const handleWorkdaysChange = useCallback((newWorkdays: number[]) => {
    setWorkdays(newWorkdays);
    updateActiveProjectTasks(currentTasks => 
        currentTasks.map(task => {
            if (task.type === 'task' && task.duration) {
                const newEnd = calculateEndDate(task.start, task.duration, newWorkdays);
                return { ...task, end: newEnd };
            }
            return task;
        })
    );
  }, [activeProjectId]);

  const handleAddUser = useCallback((newUser: string) => {
    if (newUser && !users.includes(newUser)) {
      setUsers(prev => [...prev, newUser].sort((a, b) => a.localeCompare(b)));
    } else {
      alert(`User "${newUser}" already exists.`);
    }
  }, [users]);

  const handleDeleteUser = useCallback((userToDelete: string) => {
    if (userToDelete === 'Unassigned') {
      alert("Cannot delete the 'Unassigned' user.");
      return;
    }
    setUsers(prev => prev.filter(u => u !== userToDelete));
    
    setProjects(prevProjects => 
        prevProjects.map(p => ({
            ...p,
            tasks: p.tasks.map(task => 
                task.assignee === userToDelete ? { ...task, assignee: 'Unassigned' } : task
            )
        }))
    );
  }, []);

  const handleCreateProject = useCallback(() => {
    const newProjectName = prompt("Enter the name for the new project:");
    if (newProjectName?.trim()) {
      const newProject: Project = {
        id: Date.now(),
        name: newProjectName.trim(),
        tasks: [],
      };
      setProjects(prev => [...prev, newProject]);
      setActiveProjectId(newProject.id);
    }
  }, []);
  
  const handleUpdateProject = useCallback((projectId: number, newName: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, name: newName } : p));
  }, []);

  const handleDeleteProject = useCallback((projectId: number) => {
    setProjects(prev => {
        const newProjects = prev.filter(p => p.id !== projectId);
        if (activeProjectId === projectId) {
            setActiveProjectId(newProjects[0]?.id ?? null);
        }
        return newProjects;
    });
  }, [activeProjectId]);
  
  useEffect(() => {
    if (!exportRequest) return;
    const exportAsync = async () => {
        const mainElement = printRef.current;
        if (!mainElement) { setExportRequest(null); setIsExporting(false); return; }
        try {
            const isGantt = currentView === 'gantt';
            const totalWidth = isGantt && taskListRef.current && ganttContainerRef.current
                ? taskListRef.current.offsetWidth + ganttContainerRef.current.scrollWidth
                : mainElement.scrollWidth;

            const canvas = await html2canvas(mainElement, {
                scale: 2, useCORS: true, width: totalWidth, height: mainElement.scrollHeight,
                windowWidth: totalWidth, windowHeight: mainElement.scrollHeight,
                ...(isGantt && { x: taskListRef.current?.offsetLeft ?? 0 })
            });
            
            const fileName = `Minka-${activeProject?.name ?? 'Export'}-${currentView}`;
            if (exportRequest === 'png') {
                const link = document.createElement('a');
                link.download = `${fileName}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            } else if (exportRequest === 'pdf') {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({ orientation: isGantt ? 'landscape' : 'portrait', unit: 'pt', format: 'a4' });
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgAspectRatio = canvas.width / canvas.height;
                if (isGantt) {
                    const scaledImgHeight = pdfHeight; const scaledImgWidth = scaledImgHeight * imgAspectRatio;
                    const totalPages = Math.ceil(scaledImgWidth / pdfWidth);
                    for (let i = 0; i < totalPages; i++) {
                        if (i > 0) pdf.addPage();
                        pdf.addImage(imgData, 'PNG', -(i * pdfWidth), 0, scaledImgWidth, scaledImgHeight);
                    }
                } else {
                    const scaledImgWidth = pdfWidth; const scaledImgHeight = scaledImgWidth / imgAspectRatio;
                    const totalPages = Math.ceil(scaledImgHeight / pdfHeight);
                    for (let i = 0; i < totalPages; i++) {
                        if (i > 0) pdf.addPage();
                        pdf.addImage(imgData, 'PNG', 0, -(i * pdfHeight), scaledImgWidth, scaledImgHeight);
                    }
                }
                pdf.save(`${fileName}.pdf`);
            }
        } catch (error) {
            console.error(`Error exporting to ${exportRequest.toUpperCase()}:`, error);
            alert(`Could not export to ${exportRequest.toUpperCase()}. Please try again.`);
        } finally {
            setExportRequest(null);
            setIsExporting(false);
        }
    };
    const timer = setTimeout(exportAsync, 100);
    return () => clearTimeout(timer);
  }, [exportRequest, currentView, activeProject]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    const handleMouseMove = (event: MouseEvent) => {
      if (!isResizing.current) return;
      const newWidth = event.clientX;
      const clampedWidth = Math.max(MIN_SIDEBAR_WIDTH, Math.min(newWidth, MAX_SIDEBAR_WIDTH));
      setTaskListWidth(clampedWidth);
    };
    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  if (isAuthLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    switch (view) {
      case 'login':
        return <LoginPage 
          onNavigateToSignup={() => setView('signup')}
          onGoHome={() => setView('homepage')}
        />;
      case 'signup':
        return <SignupPage 
          onNavigateToLogin={() => setView('login')}
          onGoHome={() => setView('homepage')}
        />;
      default:
        return <HomePage 
          onNavigateToLogin={() => setView('login')}
          onNavigateToSignup={() => setView('signup')}
        />;
    }
  }

  return (
    <div className="flex flex-col h-screen font-sans text-gray-800 bg-gray-100">
      <Header 
        currentUser={currentUser}
        onLogout={handleLogout}
        projects={projects}
        activeProject={activeProject}
        onSwitchProject={setActiveProjectId}
        onCreateProject={handleCreateProject}
        onManageProjects={() => setIsProjectModalOpen(true)}
        onAddTask={handleAddTask} 
        onAddGroup={handleAddGroup}
        onExportExcel={handleExportToExcel}
        onExportRequest={handleRequestExport}
        isExporting={isExporting}
        currentView={currentView}
        onViewChange={setCurrentView}
        timelineView={timelineView}
        onTimelineViewChange={handleTimelineViewChange}
        onManageUsers={() => setIsUserModalOpen(true)}
        onConfigureWorkdays={() => setIsWorkdayModalOpen(true)}
      />
      <main ref={printRef} className="flex-grow overflow-y-auto bg-gray-50">
        {!activeProject ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <BriefcaseIcon className="w-16 h-16 mx-auto text-gray-400" />
              <h2 className="mt-4 text-2xl font-semibold text-gray-700">No Projects Found</h2>
              <p className="mt-2 text-gray-500">Create a new project to get started.</p>
              <button
                onClick={handleCreateProject}
                className="mt-6 flex items-center mx-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create New Project
              </button>
            </div>
          </div>
        ) : currentView === 'gantt' ? (
           <div className="flex items-start h-full">
            <div 
              ref={taskListRef} 
              className="bg-white border-r border-gray-200 flex-shrink-0 h-full overflow-y-auto"
              style={{ width: `${taskListWidth}px` }}
            >
              <TaskList 
                tasks={processedTasks} 
                users={users}
                onUpdateTask={handleUpdateTask} 
                onDeleteTask={handleDeleteTask}
                onReorderTask={handleReorderTask}
                onToggleCollapse={handleToggleCollapse}
              />
            </div>
            <div
              onMouseDown={handleMouseDown}
              className="w-1.5 cursor-col-resize bg-gray-200 hover:bg-blue-400 transition-colors duration-200 flex-shrink-0 self-stretch"
              title="Resize Panel"
            />
            <div ref={ganttContainerRef} className="flex-1 overflow-x-auto h-full">
              <GanttChart 
                allTasks={tasks}
                visibleTasks={processedTasks} 
                users={users}
                onUpdateTask={handleUpdateTask} 
                isExporting={isExporting}
                timelineView={timelineView}
                workdays={workdays}
              />
            </div>
           </div>
        ) : (
          <Dashboard tasks={tasks} users={users} />
        )}
      </main>
      {isUserModalOpen && (
        <UserManagementModal
            users={users}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
            onClose={() => setIsUserModalOpen(false)}
        />
      )}
      {isProjectModalOpen && (
        <ProjectManagementModal
            projects={projects}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            onClose={() => setIsProjectModalOpen(false)}
        />
      )}
      {isWorkdayModalOpen && (
        <WorkdayConfigModal 
          currentWorkdays={workdays}
          onSave={handleWorkdaysChange}
          onClose={() => setIsWorkdayModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
