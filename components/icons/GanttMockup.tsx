
import React from 'react';

export const GanttMockup: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
<svg viewBox="0 0 280 175" xmlns="http://www.w3.org/2000/svg" {...props}>
  <defs>
    <clipPath id="mockup_clip_gantt">
      <rect x="0" y="0" width="280" height="175" rx="8" ry="8"/>
    </clipPath>
  </defs>
  <g clipPath="url(#mockup_clip_gantt)">
    <rect x="0" y="0" width="280" height="175" fill="#FFFFFF"/>
    <rect x="0" y="0" width="280" height="20" fill="#E5E7EB"/>
    <circle cx="10" cy="10" r="3" fill="#FECACA"/>
    <circle cx="22" cy="10" r="3" fill="#FDE68A"/>
    <circle cx="34" cy="10" r="3" fill="#A7F3D0"/>
    <rect x="45" y="6" width="200" height="8" fill="#F3F4F6" rx="4"/>

    {/* Header */}
    <rect x="0" y="20" width="280" height="30" fill="#FFFFFF" stroke="#F3F4F6" strokeWidth="1"/>
    <rect x="8" y="27" width="40" height="16" fill="#4B5563" rx="4"/>
    <rect x="55" y="27" width="100" height="16" fill="#F3F4F6" rx="4"/>
    <rect x="165" y="27" width="50" height="16" fill="#F3F4F6" rx="4"/>
    <rect x="225" y="27" width="45" height="16" fill="#3B82F6" rx="4"/>

    {/* Main Content */}
    <rect x="0" y="50" width="120" height="125" fill="#FFFFFF" stroke="#F3F4F6" strokeWidth="1"/>
    <rect x="120" y="50" width="160" height="125" fill="#FFFFFF" stroke="#F3F4F6" strokeWidth="1"/>

    {/* Task List */}
    <rect x="8" y="58" width="104" height="8" fill="#D1D5DB" rx="2"/>
    <rect x="8" y="74" width="80" height="8" fill="#E5E7EB" rx="2"/>
    <rect x="8" y="90" width="90" height="8" fill="#E5E7EB" rx="2"/>
    <rect x="8" y="106" width="60" height="8" fill="#FBBF24" opacity="0.4" rx="2"/>
    <rect x="16" y="122" width="70" height="8" fill="#E5E7EB" rx="2"/>
    <rect x="16" y="138" width="80" height="8" fill="#E5E7EB" rx="2"/>
    <rect x="8" y="154" width="75" height="8" fill="#E5E7EB" rx="2"/>

    {/* Gantt Area Header */}
    <rect x="120" y="50" width="160" height="15" fill="#F9FAFB"/>
    <rect x="135" y="54" width="20" height="7" fill="#D1D5DB" rx="2"/>
    <rect x="180" y="54" width="20" height="7" fill="#D1D5DB" rx="2"/>
    <rect x="225" y="54" width="20" height="7" fill="#D1D5DB" rx="2"/>
    <line x1="160" y1="65" x2="160" y2="175" stroke="#F3F4F6" strokeWidth="1"/>
    <line x1="200" y1="65" x2="200" y2="175" stroke="#F3F4F6" strokeWidth="1"/>
    <line x1="240" y1="65" x2="240" y2="175" stroke="#F3F4F6" strokeWidth="1"/>

    {/* Gantt Bars */}
    <rect x="125" y="72" width="50" height="12" fill="#60A5FA" rx="3"/>
    <rect x="135" y="88" width="90" height="12" fill="#34D399" rx="3"/>
    <rect x="140" y="104" width="80" height="4" fill="#A8A29E" rx="2"/>
    <rect x="150" y="120" width="60" height="12" fill="#FBBF24" rx="3"/>
    <rect x="145" y="136" width="100" height="12" fill="#8B5CF6" rx="3"/>
    <rect x="130" y="152" width="75" height="12" fill="#F97316" rx="3"/>
  </g>
</svg>
);