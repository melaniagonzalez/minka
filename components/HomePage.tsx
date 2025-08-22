
import React from 'react';
import { GanttMockup } from './icons/GanttMockup';
import { DashboardMockup } from './icons/DashboardMockup';
import { Footer } from './Footer';

interface HomePageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToLogin, onNavigateToSignup }) => {
  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-700">Minka</h1>
        <div className="flex items-center gap-4">
          <button onClick={onNavigateToLogin} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150">
              Log In
          </button>
          <button onClick={onNavigateToSignup} className="text-sm font-medium text-blue-600 hover:underline">
              Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 md:py-32 px-6 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Organize, Visualize, Achieve.
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-600">
            The modern, intuitive platform for managing your projects from start to finish. Bring clarity to your team and deliver results faster.
          </p>
          <button onClick={onNavigateToSignup} className="mt-8 px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-150">
            Get Started for Free
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-24 px-6">
        <div className="container mx-auto space-y-24">
          
          {/* Gantt Chart Feature */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-3xl font-bold text-gray-900">Dynamic Gantt Charts</h3>
              <p className="mt-4 text-lg text-gray-600">
                Effortlessly plan and track your project timeline. Our interactive Gantt charts allow you to drag, drop, and resize tasks, set dependencies, and visualize your critical path with ease. Keep everyone aligned and on schedule.
              </p>
              <ul className="mt-6 space-y-2 text-gray-700">
                  <li className="flex items-center"><svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Interactive Drag & Drop Interface</li>
                  <li className="flex items-center"><svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Task Dependencies & Grouping</li>
                  <li className="flex items-center"><svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Assign Team Members & Track Progress</li>
              </ul>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <GanttMockup className="max-w-md w-full h-auto shadow-2xl rounded-lg" />
            </div>
          </div>
          
          {/* Dashboard Feature */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <DashboardMockup className="max-w-md w-full h-auto shadow-2xl rounded-lg" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">Insightful Dashboards</h3>
              <p className="mt-4 text-lg text-gray-600">
                Go beyond timelines with a powerful dashboard that gives you a 360-degree view of your project's health. Monitor key metrics, track task status, and analyze workload distribution to make data-driven decisions.
              </p>
              <ul className="mt-6 space-y-2 text-gray-700">
                  <li className="flex items-center"><svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>At-a-glance Project KPIs</li>
                  <li className="flex items-center"><svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Task Status & Workload Breakdowns</li>
                  <li className="flex items-center"><svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Upcoming Deadline Tracking</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;