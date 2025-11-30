// src/pages/Applications.jsx
import React, { useState, useEffect } from "react";
import { applicationsAPI } from "../services/api";
import Header from "../components/Common/Header";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import {
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationsAPI.getAll();
      setApplications(response.data.applications || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      alert("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      submitted: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <Clock className="h-5 w-5" />,
        text: "Submitted",
        description:
          "Your application has been submitted and is awaiting review",
      },
      under_review: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <FileText className="h-5 w-5" />,
        text: "Under Review",
        description: "Your application is being reviewed by authorities",
      },
      approved: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircle className="h-5 w-5" />,
        text: "Approved",
        description: "Congratulations! Your application has been approved",
      },
      rejected: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <XCircle className="h-5 w-5" />,
        text: "Rejected",
        description: "Your application has been rejected",
      },
      disbursed: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: <CheckCircle className="h-5 w-5" />,
        text: "Disbursed",
        description: "Benefits have been disbursed to your account",
      },
    };
    return configs[status] || configs.submitted;
  };

  const getTimelineSteps = (application) => {
    const steps = [
      {
        name: "Submitted",
        description: "Application submitted",
        date: application.submittedAt,
        completed: true,
      },
      {
        name: "Under Review",
        description: "Application under review",
        date: application.reviewedAt,
        completed: [
          "under_review",
          "approved",
          "rejected",
          "disbursed",
        ].includes(application.status),
      },
      {
        name: "Approved",
        description: "Application approved",
        date: application.approvedAt,
        completed: ["approved", "disbursed"].includes(application.status),
      },
      {
        name: "Disbursed",
        description: "Benefits disbursed",
        date: application.disbursedAt,
        completed: application.status === "disbursed",
      },
    ];

    if (application.status === "rejected") {
      steps.push({
        name: "Rejected",
        description: "Application rejected",
        date: application.rejectedAt,
        completed: true,
      });
    }

    return steps;
  };

  if (loading) {
    return (
      <>
        <Header />
        <LoadingSpinner text="Loading your applications..." />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-2">
            Track and manage all your scheme applications
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Applications Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start by applying for government schemes to track your
              applications here
            </p>
            <a
              href="/schemes"
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Browse Schemes
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Applications List */}
            <div className="lg:col-span-2 space-y-6">
              {applications.map((application) => {
                const statusConfig = getStatusConfig(application.status);

                return (
                  <div
                    key={application.id}
                    className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedApplication(application)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 text-lg">💰</span>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-semibold text-gray-900">
                                {application.scheme?.name}
                              </h3>
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}
                              >
                                {statusConfig.icon}
                                <span className="ml-1.5">
                                  {statusConfig.text}
                                </span>
                              </span>
                            </div>

                            <p className="text-gray-600 mb-3">
                              {application.scheme?.benefit}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-1">
                                <p className="text-gray-600">
                                  <span className="font-medium">
                                    Application ID:
                                  </span>{" "}
                                  {application.applicationId}
                                </p>
                                <p className="text-gray-600">
                                  <span className="font-medium">
                                    Submitted:
                                  </span>{" "}
                                  {new Date(
                                    application.submittedAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>

                              <div className="space-y-1">
                                {application.processingTime && (
                                  <p className="text-gray-600">
                                    <span className="font-medium">
                                      Processing Time:
                                    </span>{" "}
                                    {application.processingTime} days
                                  </p>
                                )}
                                {application.scheme?.benefitAmount && (
                                  <p className="text-green-600 font-medium">
                                    <span className="font-medium">
                                      Benefit:
                                    </span>{" "}
                                    ₹
                                    {application.scheme.benefitAmount.toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                          {statusConfig.description}
                        </p>
                        {application.canTrack && (
                          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                            Track Status →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Application Details Sidebar */}
            <div className="lg:col-span-1">
              {selectedApplication ? (
                <div className="bg-white rounded-xl shadow-md border border-gray-200 sticky top-8">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Application Details
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Timeline
                        </h4>
                        <div className="space-y-3">
                          {getTimelineSteps(selectedApplication).map(
                            (step, index) => (
                              <div
                                key={index}
                                className="flex items-start space-x-3"
                              >
                                <div
                                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                                    step.completed
                                      ? "bg-green-500"
                                      : "bg-gray-300"
                                  }`}
                                >
                                  {step.completed && (
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p
                                    className={`text-sm font-medium ${
                                      step.completed
                                        ? "text-gray-900"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {step.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {step.date
                                      ? new Date(step.date).toLocaleDateString()
                                      : "Pending"}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Application Information
                        </h4>
                        <dl className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Reference ID:</dt>
                            <dd className="font-medium">
                              {selectedApplication.applicationId}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Scheme:</dt>
                            <dd className="font-medium">
                              {selectedApplication.scheme?.name}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Category:</dt>
                            <dd className="font-medium capitalize">
                              {selectedApplication.scheme?.category}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Submitted:</dt>
                            <dd className="font-medium">
                              {new Date(
                                selectedApplication.submittedAt
                              ).toLocaleDateString()}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      {selectedApplication.reviewComments && (
                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Review Comments
                          </h4>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {selectedApplication.reviewComments}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
                  <div className="text-gray-400 text-4xl mb-4">📄</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select an Application
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Click on any application to view detailed information and
                    tracking
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Applications;
