
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="overflow-hidden rounded-lg bg-slate-800 shadow-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="bg-slate-700 p-3 rounded-md text-white">
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="truncate text-sm font-medium text-slate-400">
                {title}
              </dt>
              <dd className="text-2xl font-bold text-white">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
