'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface BookingChartProps {
  data?: Array<{
    date: string;
    count: number;
  }>;
}

export default function BookingChart({ data }: BookingChartProps) {
  // Handle undefined or null data
  if (!data || !Array.isArray(data)) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p>No data available</p>
        </div>
      </div>
    );
  }

  const chartData = data.map(item => ({
    ...item,
    formattedDate: format(new Date(item.date), 'MMM dd'),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="formattedDate" 
          tick={{ fontSize: 12 }}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip 
          labelFormatter={(label) => `Date: ${label}`}
          formatter={(value: number) => [`${value} bookings`, 'Bookings']}
        />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke="#3b82f6" 
          strokeWidth={2}
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 