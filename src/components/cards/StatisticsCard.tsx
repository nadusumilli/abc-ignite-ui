import { LucideIcon } from 'lucide-react';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  trendValue?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export default function StatisticsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = 'blue' 
}: StatisticsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
  };

  const trendClasses = {
    up: 'text-green-600',
    down: 'text-red-600',
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && trendValue && (
            <p className={`text-sm font-medium ${trendClasses[trend]}`}>
              {trend === 'up' ? '↗' : '↘'} {trendValue}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
} 