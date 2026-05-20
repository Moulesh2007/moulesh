import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { worksApi, vehiclesApi } from '../../services/api';

export default function MainDashboard() {
  const { userRole, user } = useAuth();
  const navigate = useNavigate();
  
  const [works, setWorks] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [worksData, vehiclesData] = await Promise.all([
          worksApi.getAll(),
          vehiclesApi.getAll()
        ]);
        setWorks(worksData);
        setVehicles(vehiclesData);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getRoleGreeting = () => {
    const greetings = { admin: 'System Admin', manager: 'Plant Manager', client: 'Welcome', driver: 'Driver' };
    return greetings[userRole] || 'Welcome';
  };

  const quickActions = [
    { label: 'Manage Works', route: '/works', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', hover: 'hover:bg-orange-500/20 hover:shadow-orange-500/30' },
    { label: 'Manage Vehicles', route: '/vehicles', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/30', hover: 'hover:bg-green-500/20 hover:shadow-green-500/30' },
    { label: 'Raw Materials', route: '/raw-materials', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', hover: 'hover:bg-blue-500/20 hover:shadow-blue-500/30' },
    { label: 'Drivers', route: '/drivers', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30', hover: 'hover:bg-purple-500/20 hover:shadow-purple-500/30' },
  ];

  if (loading) {
    return <div className="min-h-screen p-8 text-white flex items-center justify-center">Loading Dashboard...</div>;
  }

  const activeWorksCount = works.filter(w => w.status !== 'Completed').length;
  const activeVehiclesCount = vehicles.filter(v => v.status === 'in-transit' || v.status === 'dispatched').length;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative bg-[#0d1117] text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-gray-900/60 p-6 rounded-2xl border border-gray-800 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center text-xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-tight">
                {getRoleGreeting()}, {user?.name || user?.email?.split('@')[0]}! 👋
              </h1>
              <p className="text-sm text-gray-400">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-gray-900/60 p-6 rounded-2xl border border-blue-500/30 hover:-translate-y-1 transition-transform">
              <div className="text-blue-500 text-sm font-semibold mb-2">Total Works</div>
              <div className="text-4xl font-bold">{works.length}</div>
              <div className="text-sm text-gray-400 mt-2">{activeWorksCount} active</div>
            </div>

            <div className="bg-gray-900/60 p-6 rounded-2xl border border-green-500/30 hover:-translate-y-1 transition-transform">
              <div className="text-green-500 text-sm font-semibold mb-2">Fleet Size</div>
              <div className="text-4xl font-bold">{vehicles.length}</div>
              <div className="text-sm text-gray-400 mt-2">{activeVehiclesCount} on the move</div>
            </div>

            <div className="bg-gray-900/60 p-6 rounded-2xl border border-orange-500/30 hover:-translate-y-1 transition-transform">
              <div className="text-orange-500 text-sm font-semibold mb-2">Total Deliveries</div>
              <div className="text-4xl font-bold">
                {vehicles.reduce((sum, v) => sum + parseInt(v.deliveries || 0), 0)}
              </div>
              <div className="text-sm text-gray-400 mt-2">Across all active vehicles</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.route)}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border ${action.bg} ${action.border} ${action.color} ${action.hover} transition-all duration-300 shadow-lg`}
              >
                <span className="font-bold text-sm">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Projects */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Works</h2>
            <button onClick={() => navigate('/works')} className="text-orange-500 text-sm font-semibold hover:underline">
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {works.length === 0 ? (
              <div className="col-span-2 text-center py-10 bg-gray-900/40 rounded-2xl border border-gray-800 text-gray-400">
                No works found. Add some in the Works Management page.
              </div>
            ) : (
              works.slice(0, 4).map(work => (
                <div key={work.id} className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 hover:border-gray-600 transition-colors">
                  <h3 className="text-lg font-bold mb-1">{work.workName}</h3>
                  <div className="flex gap-2 mb-4">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">{work.clientName}</span>
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">{work.status}</span>
                  </div>
                  <div className="text-sm text-gray-400">Timeline: {work.startDate} to {work.endDate}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Proprietor Details */}
        <div className="mt-8">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contact & Support</h2>
          <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/50 p-6 rounded-2xl border border-gray-700/50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Proprietor Details</h3>
              <p className="text-sm text-gray-400">Please reach out for administrative support or queries.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm">
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Name</div>
                <div className="font-semibold text-gray-200">[Proprietor Name]</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Email</div>
                <div className="font-semibold text-gray-200">[proprietor@email.com]</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Phone</div>
                <div className="font-semibold text-gray-200">[+91-9876543210]</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
