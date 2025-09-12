import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { EnrollmentData } from '../../types';

const data: EnrollmentData[] = [
  { month: 'Jan', students: 800 },
  { month: 'Feb', students: 850 },
  { month: 'Mar', students: 950 },
  { month: 'Apr', students: 980 },
  { month: 'May', students: 1100 },
  { month: 'Jun', students: 1150 },
  { month: 'Jul', students: 1200 },
  { month: 'Aug', students: 1250 },
];

type Theme = 'light' | 'dark';
interface ChartProps {
    theme: Theme;
}

const EnrollmentChart: React.FC<ChartProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const tickColor = isDark ? '#9CA3AF' : '#6B7280';
  const gridColor = isDark ? '#374151' : '#e0e0e0';
  const tooltipBg = isDark ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDark ? '#374151' : '#e0e0e0';


  return (
    <div className="p-5 bg-card dark:bg-gray-800 rounded-xl shadow-sm h-96">
      <h3 className="mb-4 text-lg font-semibold text-text-primary dark:text-gray-100">Student Enrollment Trend</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="month" tick={{ fill: tickColor }} fontSize={12} />
          <YAxis tick={{ fill: tickColor }} fontSize={12} />
          <Tooltip 
            contentStyle={{ 
                backgroundColor: tooltipBg, 
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '0.5rem',
                color: tickColor
            }} 
          />
          <Legend wrapperStyle={{fontSize: "14px", color: tickColor}}/>
          <Line type="monotone" dataKey="students" stroke="#3B82F6" strokeWidth={2} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnrollmentChart;