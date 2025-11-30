// src/components/Dashboard/StatsCards.jsx
import React from 'react';
import { TrendingUp, CheckCircle, FileText, Award } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const statItems = [
    {
      title: 'Eligibility Score',
      value: stats?.eligibilityScore || 0,
      suffix: '%',
      color: 'bg-green-500',
      icon: <Award className="h-6 w-6" />,
      description: 'Scheme matching potential'
    },
    {
      title: 'Profile Completion',
      value: stats?.profileCompletionPercentage || 0,
      suffix: '%',
      color: 'bg-blue-500',
      icon: <CheckCircle className="h-6 w-6" />,
      description: 'Profile completeness'
    },
    {
      title: 'Applications',
      value: stats?.applications || 0,
      suffix: '',
      color: 'bg-purple-500',
      icon: <FileText className="h-6 w-6" />,
      description: 'Total submissions'
    },
    {
      title: 'Documents',
      value: `${stats?.documentsUploaded || 0}/${stats?.totalDocuments || 4}`,
      suffix: '',
      color: 'bg-orange-500',
      icon: <TrendingUp className="h-6 w-6" />,
      description: 'Uploaded documents'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">
                  {stat.value}
                  {stat.suffix}
                </p>
                {stat.title === 'Eligibility Score' && (
                  <span className={`ml-2 text-sm font-medium ${
                    stat.value >= 80 ? 'text-green-600' :
                    stat.value >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {stat.value >= 80 ? 'Excellent' :
                     stat.value >= 60 ? 'Good' : 'Needs Improvement'}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
              <div className={stat.color.replace('bg-', 'text-')}>
                {stat.icon}
              </div>
            </div>
          </div>
          
          {/* Progress bar for completion scores */}
          {(stat.title === 'Eligibility Score' || stat.title === 'Profile Completion') && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    stat.value >= 80 ? 'bg-green-500' :
                    stat.value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${stat.value}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsCards;