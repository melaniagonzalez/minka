
import React from 'react';

export const DashboardIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <clipPath id="dashClip">
                <rect width="200" height="120" rx="8"/>
            </clipPath>
        </defs>
        <g clipPath="url(#dashClip)">
            <rect width="200" height="120" fill="#F3F4F6"/>
            
            {/* KPI Cards */}
            <rect x="8" y="8" width="42" height="24" rx="4" fill="white"/>
            <rect x="14" y="14" width="15" height="3" rx="1.5" fill="#D1D5DB"/>
            <rect x="14" y="22" width="25" height="5" rx="2" fill="#71717A"/>
            
            <rect x="56" y="8" width="42" height="24" rx="4" fill="white"/>
            <rect x="62" y="14" width="15" height="3" rx="1.5" fill="#D1D5DB"/>
            <rect x="62" y="22" width="25" height="5" rx="2" fill="#71717A"/>
            
            <rect x="104" y="8" width="42" height="24" rx="4" fill="white"/>
            <rect x="110" y="14" width="15" height="3" rx="1.5" fill="#D1D5DB"/>
            <rect x="110" y="22" width="25" height="5" rx="2" fill="#71717A"/>

            <rect x="152" y="8" width="42" height="24" rx="4" fill="white"/>
            <rect x="158" y="14" width="15" height="3" rx="1.5" fill="#D1D5DB"/>
            <rect x="158" y="22" width="25" height="5" rx="2" fill="#71717A"/>

            {/* Progress Bar Card */}
            <rect x="8" y="38" width="184" height="20" rx="4" fill="white"/>
            <rect x="14" y="45" width="140" height="6" rx="3" fill="#E5E7EB"/>
            <rect x="14" y="45" width="100" height="6" rx="3" fill="#3B82F6"/>
            <rect x="160" y="44" width="25" height="8" rx="2" fill="#A1A1AA"/>
            
            {/* Chart Cards */}
            <rect x="8" y="64" width="89" height="48" rx="4" fill="white"/>
            <circle cx="32" cy="88" r="12" fill="none" stroke="#10B981" strokeWidth="5" strokeDasharray="45 100"/>
            <circle cx="32" cy="88" r="12" fill="none" stroke="#F59E0B" strokeWidth="5" strokeDasharray="20 100" transform="rotate(215 32 88)"/>
            <circle cx="32" cy="88" r="12" fill="none" stroke="#6B7280" strokeWidth="5" strokeDasharray="10 100" transform="rotate(310 32 88)"/>
            <rect x="52" y="74" width="8" height="3" rx="1.5" fill="#10B981"/>
            <rect x="62" y="74" width="20" height="3" rx="1.5" fill="#E5E7EB"/>
            <rect x="52" y="84" width="8" height="3" rx="1.5" fill="#F59E0B"/>
            <rect x="62" y="84" width="25" height="3" rx="1.5" fill="#E5E7EB"/>
            <rect x="52" y="94" width="8" height="3" rx="1.5" fill="#6B7280"/>
            <rect x="62" y="94" width="18" height="3" rx="1.5" fill="#E5E7EB"/>
            
            <rect x="103" y="64" width="89" height="48" rx="4" fill="white"/>
            <circle cx="127" cy="88" r="12" fill="none" stroke="#8B5CF6" strokeWidth="5" strokeDasharray="30 100"/>
            <circle cx="127" cy="88" r="12" fill="none" stroke="#EC4899" strokeWidth="5" strokeDasharray="25 100" transform="rotate(145 127 88)"/>
            <circle cx="127" cy="88" r="12" fill="none" stroke="#6366F1" strokeWidth="5" strokeDasharray="20 100" transform="rotate(265 127 88)"/>
            <circle cx="127" cy="88" r="8" fill="white"/>
            <rect x="147" y="74" width="8" height="3" rx="1.5" fill="#8B5CF6"/>
            <rect x="157" y="74" width="20" height="3" rx="1.5" fill="#E5E7EB"/>
            <rect x="147" y="84" width="8" height="3" rx="1.5" fill="#EC4899"/>
            <rect x="157" y="84" width="25" height="3" rx="1.5" fill="#E5E7EB"/>
            <rect x="147" y="94" width="8" height="3" rx="1.5" fill="#6366F1"/>
            <rect x="157" y="94" width="18" height="3" rx="1.5" fill="#E5E7EB"/>
        </g>
    </svg>
);