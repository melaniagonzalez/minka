
import React from 'react';

export const DashboardMockup: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
<svg viewBox="0 0 280 175" xmlns="http://www.w3.org/2000/svg" {...props}>
  <defs>
    <clipPath id="mockup_clip_dash">
      <rect x="0" y="0" width="280" height="175" rx="8" ry="8"/>
    </clipPath>
  </defs>
  <g clipPath="url(#mockup_clip_dash)">
    <rect x="0" y="0" width="280" height="175" fill="#F3F4F6"/>
    <rect x="0" y="0" width="280" height="20" fill="#E5E7EB"/>
    <circle cx="10" cy="10" r="3" fill="#FECACA"/>
    <circle cx="22" cy="10" r="3" fill="#FDE68A"/>
    <circle cx="34" cy="10" r="3" fill="#A7F3D0"/>
    <rect x="45" y="6" width="200" height="8" fill="#F9FAFB" rx="4"/>

    {/* Header */}
    <rect x="0" y="20" width="280" height="30" fill="#FFFFFF" stroke="#F3F4F6" strokeWidth="1"/>
    <rect x="8" y="27" width="40" height="16" fill="#4B5563" rx="4"/>
    <rect x="55" y="27" width="100" height="16" fill="#F3F4F6" rx="4"/>
    <rect x="165" y="27" width="50" height="16" fill="#3B82F6" rx="4"/>
    <rect x="225" y="27" width="45" height="16" fill="#F3F4F6" rx="4"/>

    {/* Main Content */}
    {/* KPI cards */}
    <rect x="10" y="58" width="60" height="25" fill="#FFFFFF" rx="4"/>
    <rect x="15" y="62" width="30" height="4" fill="#D1D5DB" rx="2"/>
    <rect x="15" y="70" width="40" height="8" fill="#6B7280" rx="2"/>

    <rect x="78" y="58" width="60" height="25" fill="#FFFFFF" rx="4"/>
    <rect x="83" y="62" width="30" height="4" fill="#D1D5DB" rx="2"/>
    <rect x="83" y="70" width="40" height="8" fill="#6B7280" rx="2"/>
    
    <rect x="146" y="58" width="60" height="25" fill="#FFFFFF" rx="4"/>
    <rect x="151" y="62" width="30" height="4" fill="#D1D5DB" rx="2"/>
    <rect x="151" y="70" width="40" height="8" fill="#6B7280" rx="2"/>

    <rect x="214" y="58" width="60" height="25" fill="#FFFFFF" rx="4"/>
    <rect x="219" y="62" width="30" height="4" fill="#D1D5DB" rx="2"/>
    <rect x="219" y="70" width="40" height="8" fill="#6B7280" rx="2"/>

    {/* Chart Cards */}
    <rect x="10" y="91" width="125" height="74" fill="#FFFFFF" rx="4"/>
    <circle cx="45" cy="130" r="18" fill="none" stroke="#10B981" strokeWidth="8" strokeDasharray="60 113.09"/>
    <circle cx="45" cy="130" r="18" fill="none" stroke="#F59E0B" strokeWidth="8" strokeDasharray="30 113.09" transform="rotate(190 45 130)"/>
    <rect x="75" y="105" width="45" height="4" fill="#E5E7EB" rx="2"/>
    <rect x="75" y="115" width="35" height="4" fill="#E5E7EB" rx="2"/>
    <rect x="75" y="125" width="50" height="4" fill="#E5E7EB" rx="2"/>
    <rect x="75" y="135" width="40" height="4" fill="#E5E7EB" rx="2"/>


    <rect x="145" y="91" width="125" height="74" fill="#FFFFFF" rx="4"/>
    <circle cx="180" cy="130" r="18" fill="none" stroke="#8B5CF6" strokeWidth="8" strokeDasharray="40 113.09"/>
    <circle cx="180"cy="130" r="18" fill="none" stroke="#EC4899" strokeWidth="8" strokeDasharray="35 113.09" transform="rotate(125 180 130)"/>
    <circle cx="180"cy="130" r="10" fill="#FFFFFF"/>
    <rect x="210" y="105" width="45" height="4" fill="#E5E7EB" rx="2"/>
    <rect x="210" y="115" width="35" height="4" fill="#E5E7EB" rx="2"/>
    <rect x="210" y="125" width="50" height="4" fill="#E5E7EB" rx="2"/>
    <rect x="210" y="135" width="40" height="4" fill="#E5E7EB" rx="2"/>
  </g>
</svg>
);