
import React from 'react';

interface PieChartProps {
    data: { label: string; value: number; color: string }[];
    type?: 'pie' | 'donut';
}

const getCoordinatesForPercent = (percent: number, radius: number) => {
    const x = radius * Math.cos(2 * Math.PI * percent);
    const y = radius * Math.sin(2 * Math.PI * percent);
    return [x, y];
};

const PieChart: React.FC<PieChartProps> = ({ data, type = 'pie' }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    if (total === 0) {
        return <div className="text-center text-gray-500">No data to display</div>;
    }

    let cumulativePercent = 0;

    const paths = data.map(item => {
        const percent = item.value / total;
        const [startX, startY] = getCoordinatesForPercent(cumulativePercent, 50);
        cumulativePercent += percent;
        const [endX, endY] = getCoordinatesForPercent(cumulativePercent, 50);

        const largeArcFlag = percent > 0.5 ? 1 : 0;
        
        const pathData = [
            `M ${startX} ${startY}`, // Move
            `A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
            `L 0 0`, // Line to center
        ].join(' ');

        return <path key={item.label} d={pathData} fill={item.color} />;
    });

    const isDonut = type === 'donut';
    const innerRadius = isDonut ? 30 : 0;
    const donutText = isDonut ? `${data.length} Members` : '';

    return (
        <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-shrink-0">
                <svg viewBox="-55 -55 110 110" width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
                    {paths}
                    {isDonut && <circle cx="0" cy="0" r={innerRadius} fill="white" />}
                </svg>
                {isDonut && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold text-gray-800">{total}</span>
                        <span className="text-xs text-gray-500">Total Days</span>
                    </div>
                )}
            </div>
            <div className="flex-grow w-full">
                <ul className="space-y-2">
                    {data.map(item => (
                        <li key={item.label} className="flex justify-between items-center text-sm">
                            <div className="flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                                <span className="text-gray-600">{item.label}</span>
                            </div>
                            <span className="font-semibold text-gray-800">{((item.value / total) * 100).toFixed(0)}% ({item.value}d)</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PieChart;