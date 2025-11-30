// src/components/Dashboard/RecentApplications.jsx
import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, FileSearch } from 'lucide-react';

const RecentApplications = ({ applications }) => {
  const getStatusConfig = (status) => {
    const configs = {
      submitted: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Clock className="h-4 w-4" />,
        text: 'Submitted'
      },
      under_review: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <FileSearch className="h-4 w-4" />,
        text: 'Under Review'
      },
      approved: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="h-4 w-4" />,
        text: 'Approved'
      },
      rejected: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="h-4 w-4" />,
        text: 'Rejected'
      },
      disbursed: {
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: <CheckCircle className="h-4 w-4" />,
        text: 'Disbursed'
      }
    };
    return configs[status] || configs.submitted;
  };

  const getStatusInTamil = (status) => {
    const tamilStatus = {
      submitted: 'சமர்ப்பிக்கப்பட்டது',
      under_review: 'மதிப்பீட்டில்',
      approved: 'அனுமதிக்கப்பட்டது',
      rejected: 'நிராகரிக்கப்பட்டது',
      disbursed: 'வழங்கப்பட்டது'
    };
    return tamilStatus[status] || status;
  };

  if (!applications || applications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Applications Yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start by applying for government schemes to see your applications here
          </p>
          <a
            href="/schemes"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Browse Schemes
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            📋 Recent Applications
          </h2>
          <a
            href="/applications"
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            View All →
          </a>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {applications.slice(0, 5).map((application) => {
          const statusConfig = getStatusConfig(application.status);
          
          return (
            <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-lg">💰</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {application.scheme?.name}
                      </h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                        {statusConfig.icon}
                        <span className="ml-1.5">{statusConfig.text}</span>
                        {application.statusInTamil && (
                          <span className="ml-2 text-xs tamil-font">
                            ({application.statusInTamil})
                          </span>
                        )}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">
                          <span className="font-medium">Application ID:</span> {application.applicationId}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Submitted:</span> {new Date(application.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div>
                        {application.processingTime && (
                          <p className="text-gray-600">
                            <span className="font-medium">Processing:</span> {application.processingTime} days
                          </p>
                        )}
                        {application.scheme?.benefitAmount && (
                          <p className="text-green-600 font-medium">
                            Benefit: ₹{application.scheme.benefitAmount.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  {application.canTrack && (
                    <a
                      href={`/applications/track/${application.applicationId}`}
                      className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
                    >
                      Track Status →
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentApplications;