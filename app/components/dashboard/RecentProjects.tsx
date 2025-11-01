import React from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, Clock, ChevronRight } from 'lucide-react';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';

const recentProjects = [
  {
    id: '1',
    startupName: 'EcoDelivery App',
    description: 'Sustainable food delivery platform',
    lastActivity: '2 hours ago',
    status: 'active'
  },
  {
    id: '2',
    startupName: 'AI Writing Assistant',
    description: 'Content creation tool for marketers',
    lastActivity: '1 day ago',
    status: 'completed'
  },
  {
    id: '3',
    startupName: 'Fitness Tracker SaaS',
    description: 'Personal training optimization platform',
    lastActivity: '3 days ago',
    status: 'active'
  }
];

export const RecentProjects: React.FC = () => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
        <Button variant="glass" size="sm">
          View All
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {recentProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-white">{project.startupName}</h3>
                <p className="text-sm text-gray-400">{project.description}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                project.status === 'active' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-blue-500/20 text-blue-400'
              }`}>
                {project.status}
              </div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Clock className="w-3 h-3 mr-1" />
                {project.lastActivity}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};