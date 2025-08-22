
import React from 'react';

export const GanttIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <clipPath id="ganttClip">
                <rect width="200" height="120" rx="8" />
            </clipPath>
        </defs>
        <g clipPath="url(#ganttClip)">
            <rect width="200" height="120" fill="white" />
            {/* Sidebar */}
            <rect width="80" height="120" fill="#F9FAFB" />
            <rect x="0" y="0" width="80" height="20" fill="#F3F4F6" />
            <line x1="0" y1="20" x2="200" y2="20" stroke="#E5E7EB" strokeWidth="1" />
            <rect x="8" y="6" width="30" height="8" rx="2" fill="#A1A1AA" />
            <rect x="45" y="6" width="30" height="8" rx="2" fill="#A1A1AA" />
            
            {/* Sidebar content */}
            <rect x="8" y="28" width="50" height="6" rx="2" fill="#71717A" />
            <rect x="8" y="48" width="60" height="6" rx="2" fill="#71717A" />
            <path d="M 8 68 L 12 65 L 12 71 Z" fill="#A1A1AA" />
            <rect x="16" y="68" width="50" height="6" rx="2" fill="#71717A" font-weight="bold" />
            <rect x="24" y="88" width="40" height="6" rx="2" fill="#71717A" />
            
            {/* Chart Area */}
            <rect x="80" y="0" width="120" height="120" fill="white" />
            <line x1="120" y1="20" x2="120" y2="120" stroke="#F3F4F6" strokeWidth="1" />
            <line x1="160" y1="20" x2="160" y2="120" stroke="#F3F4F6" strokeWidth="1" />
            
            {/* Timeline header */}
            <rect x="80" y="0" width="120" height="20" fill="#F9FAFB" />
            <rect x="95" y="6" width="10" height="8" rx="2" fill="#A1A1AA" />
            <rect x="135" y="6" width="10" height="8" rx="2" fill="#A1A1AA" />
            <rect x="175" y="6" width="10" height="8" rx="2" fill="#A1A1AA" />
            
            {/* Gantt Bars */}
            <rect x="85" y="25" width="50" height="12" rx="3" fill="#60A5FA" />
            <rect x="95" y="45" width="90" height="12" rx="3" fill="#34D399" />
            {/* Group Bar */}
            <rect x="100" y="67" width="80" height="4" rx="2" fill="#A8A29E" />
            <path d="M 99 71 L 101 71 L 100 73 Z" fill="#A8A29E" />
            <path d="M 181 71 L 179 71 L 180 73 Z" fill="#A8A29E" />
            
            <rect x="110" y="85" width="60" height="12" rx="3" fill="#FBBF24" />
            
            {/* Dependency Line */}
            <path d="M 135 37 v 8 h 50 v 35" stroke="#64748B" strokeWidth="1.5" fill="none" />
            <path d="M 185 85 L 182 81 L 188 81 Z" fill="#64748B" transform="rotate(90 185 85)" />
        </g>
    </svg>
);