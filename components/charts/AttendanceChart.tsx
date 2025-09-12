import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { AttendanceData } from '../../types';

export const attendanceChartData: AttendanceData[] = [
  { class: 'JSS 1A', present: 2, absent: 0 },
  { class: 'JSS 1B', present: 1, absent: 1 },
  { class: 'JSS 2A', present: 3, absent: 0 },
  { class: 'JSS 2B', present: 2, absent: 0 },
  { class: 'JSS 3A', present: 2, absent: 1 },
  { class: 'JSS 3B', present: 2, absent: 0 },
];

type Theme = 'light' | 'dark';
interface ChartProps {
    theme: Theme;
}

const AttendanceChart: React.FC<ChartProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const tickColor = isDark ? '#9CA3AF' : '#6B7280';
  const tooltipBg = isDark ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDark ? '#374151' : '#e0e0e0';

  return (
    <div className="p-5 bg-card dark:bg-gray-800 rounded-xl shadow-sm h-96">
      <h3 className="mb-4 text-lg font-semibold text-text-primary dark:text-gray-100">Today's Attendance</h3>
       <ResponsiveContainer width="100%" height="85%">
        <BarChart data={attendanceChartData} layout="vertical" margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <XAxis type="number" hide tick={{ fill: tickColor }} />
            <YAxis type="category" dataKey="class" tick={{ fill: tickColor }} fontSize={12} width={50}/>
            <Tooltip
                contentStyle={{ 
                    backgroundColor: tooltipBg, 
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: '0.5rem'
                }} 
            />
            <Legend wrapperStyle={{fontSize: "14px", color: tickColor}}/>
            <Bar dataKey="present" stackId="a" fill="#3B82F6" name="Present" />
            <Bar dataKey="absent" stackId="a" fill="#EF4444" name="Absent" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;