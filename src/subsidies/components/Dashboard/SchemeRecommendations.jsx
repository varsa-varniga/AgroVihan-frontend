// src/components/Dashboard/SchemeRecommendations.jsx
import React, { useState } from 'react';
import { applicationsAPI } from '../../services/api';
import { CheckCircle, Clock, DollarSign, AlertCircle } from 'lucide-react';

const SchemeRecommendations = ({ schemes, onApplySuccess }) => {
  const [applying, setApplying] = useState(null);

  const handleApply = async (schemeId) => {
    setApplying(schemeId);
    try {
      const response = await applicationsAPI.create({ schemeId });
      alert(response.data.message);
      if (onApplySuccess) {
        onApplySuccess();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Application failed');
    } finally {
      setApplying(null);
    }
  };

  if (!schemes || schemes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <div className="text-gray-400 text-6xl mb-4">💰</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Scheme Recommendations Yet
        </h3>
        <p className="text-gray-600 mb-4">
          Complete your financial profile to get personalized scheme recommendations
        </p>
        <a
          href="/profile"
          className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Complete Profile
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          🎯 Recommended Schemes For You
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Based on your profile and eligibility
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((recommendation) => (
            <div
              key={recommendation.scheme.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-white"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {recommendation.scheme.name}
                </h3>
                <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {recommendation.matchScore}% Match
                </div>
              </div>

              {recommendation.scheme.nameInTamil && (
                <p className="text-gray-600 text-sm mb-3 tamil-font">
                  {recommendation.scheme.nameInTamil}
                </p>
              )}

              <p className="text-gray-700 mb-4 text-sm">
                {recommendation.scheme.benefit}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                  Benefit: {recommendation.scheme.benefitAmount ? 
                    `₹${recommendation.scheme.benefitAmount.toLocaleString()}` : 
                    'Varies'
                  }
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  Processing: {recommendation.scheme.processingTime}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4 mr-2 text-purple-600" />
                  Category: {recommendation.scheme.category}
                </div>
              </div>

              {/* Match Score Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Eligibility Score</span>
                  <span>{recommendation.matchScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${recommendation.matchScore}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => handleApply(recommendation.scheme.id)}
                disabled={applying === recommendation.scheme.id}
                className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                {applying === recommendation.scheme.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Applying...
                  </>
                ) : (
                  'Apply Now →'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchemeRecommendations;