
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface PurchaseChartProps {
  data: { date: string; sales: number }[] | undefined;
}

const PurchaseChart: React.FC<PurchaseChartProps> = ({ data }) => {
  if (!data) {
    return <div className="text-center text-slate-400">Loading chart data...</div>;
  }
  
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              borderColor: '#374151',
            }}
            labelStyle={{ color: '#d1d5db' }}
          />
          <Legend wrapperStyle={{ color: '#d1d5db' }} />
          <Bar dataKey="sales" fill="#3b82f6" name="Stars Earned (⭐)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PurchaseChart;
