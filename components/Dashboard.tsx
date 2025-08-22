
import React, { useMemo } from 'react';
import { Task } from '../types';
import PieChart from './PieChart';

interface DashboardProps {
    tasks: Task[];
    users: string[];
}

// A simple hashing function to generate a color from a string
const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
};

const StatCard: React.FC<{ title: string; value: string | number; description?: string }> = ({ title, value, description }) => (
    <div className="bg-white px-6 pt-6 pb-7 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 truncate pb-1">{title}</h3>
        <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ tasks, users }) => {
    const metrics = useMemo(() => {
        const projectTasks = tasks.filter(t => t.type === 'task');
        if (projectTasks.length === 0) {
            return {
                startDate: null,
                endDate: null,
                totalDurationDays: 0,
                totalDurationWeeks: 0,
                progress: 0,
                totalTasks: 0,
                totalUsers: 0,
                statusData: [],
                workloadData: [],
                upcomingTasks: [],
            };
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Timeline Metrics
        const startDates = projectTasks.map(t => t.start.getTime());
        const endDates = projectTasks.map(t => t.end.getTime());
        const minDate = new Date(Math.min(...startDates));
        const maxDate = new Date(Math.max(...endDates));
        
        const totalDurationMs = maxDate.getTime() - minDate.getTime();
        const totalDurationDays = Math.max(1, Math.ceil(totalDurationMs / (1000 * 60 * 60 * 24)) + 1);
        const totalDurationWeeks = (totalDurationDays / 7).toFixed(1);

        const elapsedMs = Math.max(0, today.getTime() - minDate.getTime());
        const progress = totalDurationMs > 0 ? Math.min(100, Math.round((elapsedMs / totalDurationMs) * 100)) : 0;

        // Status Metrics
        const statusCounts = { completed: 0, inProgress: 0, upcoming: 0 };
        projectTasks.forEach(task => {
            const taskStart = new Date(task.start);
            taskStart.setHours(0, 0, 0, 0);
            const taskEnd = new Date(task.end);
            taskEnd.setHours(0, 0, 0, 0);

            if (taskEnd < today) {
                statusCounts.completed++;
            } else if (taskStart <= today && taskEnd >= today) {
                statusCounts.inProgress++;
            } else {
                statusCounts.upcoming++;
            }
        });

        const statusData = [
            { label: 'Completed', value: statusCounts.completed, color: '#10B981' },
            { label: 'In Progress', value: statusCounts.inProgress, color: '#F59E0B' },
            { label: 'Upcoming', value: statusCounts.upcoming, color: '#6B7280' },
        ].filter(item => item.value > 0);

        // Workload Metrics
        const workload: { [key: string]: number } = {};
        projectTasks.forEach(task => {
            const assignee = task.assignee || 'Unassigned';
            workload[assignee] = (workload[assignee] || 0) + (task.duration || 1);
        });

        const workloadData = Object.entries(workload)
            .map(([label, value]) => ({ label, value, color: stringToColor(label) }))
            .sort((a, b) => b.value - a.value);

        // Upcoming Deadlines
        const sevenDaysFromNow = new Date(today);
        sevenDaysFromNow.setDate(today.getDate() + 7);
        const upcomingTasks = projectTasks.filter(task => {
            const taskEnd = new Date(task.end);
            return taskEnd >= today && taskEnd <= sevenDaysFromNow;
        }).sort((a, b) => a.end.getTime() - b.end.getTime());


        return {
            startDate: minDate,
            endDate: maxDate,
            totalDurationDays,
            totalDurationWeeks,
            progress,
            totalTasks: projectTasks.length,
            totalUsers: users.length,
            statusData,
            workloadData,
            upcomingTasks,
        };
    }, [tasks, users]);

    if (tasks.filter(t => t.type === 'task').length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-700">No Task Data Available</h2>
                    <p className="mt-2 text-gray-500">Add some tasks in the Gantt view to see your project dashboard.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="p-6 space-y-6 pb-10">
             {/* KPIs Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Duration" value={`${metrics.totalDurationDays} days`} description={`About ${metrics.totalDurationWeeks} weeks`} />
                <StatCard title="Total Tasks" value={metrics.totalTasks} description={`${users.length} team members`} />
                <StatCard title="Project Start" value={metrics.startDate?.toLocaleDateString() ?? '--'} />
                <StatCard title="Project End" value={metrics.endDate?.toLocaleDateString() ?? '--'} />
            </div>

            {/* Progress Bar */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                 <h3 className="text-lg font-medium text-gray-900">Project Progress</h3>
                 <div className="mt-4 flex items-center gap-4">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${metrics.progress}%` }}
                        ></div>
                    </div>
                    <span className="font-semibold text-blue-600 text-lg">{metrics.progress}%</span>
                 </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Task Status</h3>
                    <PieChart data={metrics.statusData} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Workload Distribution (by duration)</h3>
                    <PieChart data={metrics.workloadData} type="donut" />
                </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Deadlines (Next 7 Days)</h3>
                {metrics.upcomingTasks.length > 0 ? (
                    <ul className="space-y-3 max-h-80 overflow-y-auto">
                        {metrics.upcomingTasks.map(task => (
                            <li key={task.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                <div>
                                    <p className="font-medium text-gray-800">{task.name}</p>
                                    <p className="text-sm text-gray-500">{task.assignee}</p>
                                </div>
                                <span className="inline-flex items-center text-sm font-semibold text-red-600 bg-red-100 px-3 py-1.5 rounded-full">
                                    Due: {task.end.toLocaleDateString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No tasks are due in the next 7 days. Great job!</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;