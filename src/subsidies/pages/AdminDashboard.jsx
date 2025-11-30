import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  DollarSign,
  Settings,
  LogOut
} from 'lucide-react';

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({});
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    checkAdminAuth();
    fetchDashboardData();
  }, []);

  const checkAdminAuth = () => {
    const adminData = localStorage.getItem('admin_data');
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    } else {
      window.location.href = '/login';
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      
      const [statsRes, applicationsRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/admin/applications?limit=10', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const statsData = await statsRes.json();
      const appsData = await applicationsRes.json();

      if (statsData.success) setStats(statsData.statistics);
      if (appsData.success) setApplications(appsData.applications);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
    window.location.href = '/login';
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:5000/api/admin/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();
      if (data.success) {
        alert('Application status updated!');
        fetchDashboardData();
      }
    } catch (error) {
      alert('Error updating status: ' + error.message);
    }
  };

  if (!admin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🌾</span>
              <h1 className="text-xl font-bold">AgroVihan Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span>Welcome, {admin.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
              { id: 'applications', name: 'Applications', icon: FileText },
              { id: 'users', name: 'Users', icon: Users },
              { id: 'schemes', name: 'Schemes', icon: DollarSign },
              { id: 'settings', name: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.users?.total || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.applications?.total || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.applications?.byStatus?.approved || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.applications?.byStatus?.submitted || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">Recent Applications</h2>
              </div>
              <div className="divide-y">
                {applications.map((app) => (
                  <div key={app.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{app.scheme?.name}</h3>
                        <p className="text-sm text-gray-600">
                          {app.user?.name} • {app.applicationId}
                        </p>
                        <p className="text-sm text-gray-500">
                          Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          app.status === 'approved' ? 'bg-green-100 text-green-800' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {app.status}
                        </span>
                        <select
                          value={app.status}
                          onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="submitted">Submitted</option>
                          <option value="under_review">Under Review</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                          <option value="disbursed">Disbursed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">All Applications</h2>
            </div>
            {/* Applications table would go here */}
            <div className="p-8 text-center text-gray-500">
              Applications management interface - Implement full table with filters
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;