import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/app/components/ui/Card';
import type { StartupDetailData } from '@/lib/types';
import { useThemeStore } from '@/lib/store/themeStore';

interface ActivityLogProps {
  activityLog: StartupDetailData['activityLog'];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ activityLog }) => {
  const { theme } = useThemeStore();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card>
        <div className={`p-6 border-b ${
          theme === 'dark' ? 'border-white/10' : 'border-gray-400/70'
        }`}>
          <h3 className={`text-base font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-light-900'
          }`}>Activity Log</h3>
        </div>
        <div className="p-6 space-y-4">
          {activityLog.map(activity => (
            <div key={activity.id} className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <div className="flex-1">
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-light-900'
                }`}>{activity.agent}</div>
                <div className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                }`}>{activity.timestamp} by {activity.user}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
);
};