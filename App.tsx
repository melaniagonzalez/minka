
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, firebaseConfig } from './firebaseConfig';
import { Task, TimelineView, ProcessedTask, Project, AuthView } from './types';
import { INITIAL_PROJECTS, INITIAL_USERS } from './constants';
import Header from './components/Header';
import TaskList from './components/TaskList';
import GanttChart from './components/GanttChart';
import Dashboard from './components/Dashboard';
import UserManagementModal from './components/UserManagementModal';
import WorkdayConfigModal from './components/WorkdayConfigModal';
import ProjectManagementModal from './components/ProjectManagementModal';
import CreateProjectModal from './components/CreateProjectModal';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { calculateBusinessDays, calculateEndDate } from './components/utils';
import { BriefcaseIcon } from './components/icons/BriefcaseIcon';

const MIN_SIDEBAR_WIDTH = 280;
const MAX_SIDEBAR_WIDTH = 900;

interface UserDocument {
  projects: Project[];
  users: string[];
  workdays: number[];
}

const ApiKeyErrorDisplay: React.FC = () => (
  <div className="flex h-screen items-center justify-center bg-red-50 text-red-900 p-4">
    <div className="max-w-2xl w-full bg-white border-2 border-red-300 rounded-lg shadow-lg p-8 text-center">
      <h1 className="text-3xl font-bold text-red-700">Configuration Error</h1>
      <p className="mt-4 text-lg">Your Firebase API key is missing.</p>
      <p className="mt-2 text-gray-700">
        The application cannot connect to Firebase without a valid API key. Please follow these steps to fix this:
      </p>
      <ol className="text-left mt-6 space-y-3 bg-gray-50 p-6 rounded-md border border-gray-200">
        <li>
          <strong>1. Go to your Firebase Console:</strong> Open your project settings.
        </li>
        <li>
          <strong>2. Find your API Key:</strong> In the 'General' tab, under 'Your apps', find the <code>firebaseConfig</code> object and copy the value for <code>apiKey</code>.
        </li>
        <li>
          <strong>3. Update the code:</strong> Open the file named <code>firebaseConfig.ts</code> in the editor.
        </li>
        <li>
          <strong>4. Replace the placeholder:</strong> Find the line <code>apiKey: "YOUR_FIREBASE_API_KEY",</code> and replace <code>"YOUR_FIREBASE_API_KEY"</code> with the