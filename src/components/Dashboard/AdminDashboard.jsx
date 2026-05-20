import React, { useEffect, useState } from 'react';
import { vehiclesApi, usersManagementApi } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vData, uData] = await Promise.all([
          vehiclesApi.getAll(),
          usersManagementApi.getAll()
        ]);
        setVehicles(vData);
        setUsers(uData);
      } catch (error) {
        console.error('Failed to fetch admin data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading Admin Dashboard...</div>;
  }

  const activeUsers = users.filter(u => u.status === 'Active').length;
  const activeVehicles = vehicles.filter(v => v.status === 'in-transit' || v.status === 'dispatched').length;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-[#0d1117] text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-2">System overview and user management.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Total Users</div>
            <div className="text-3xl font-bold text-orange-500">{users.length}</div>
          </div>
          <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Active Users</div>
            <div className="text-3xl font-bold text-green-500">{activeUsers}</div>
          </div>
          <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Total Fleet</div>
            <div className="text-3xl font-bold text-blue-500">{vehicles.length}</div>
          </div>
          <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Active Vehicles</div>
            <div className="text-3xl font-bold text-purple-500">{activeVehicles}</div>
          </div>
        </div>

        {/* Fleet Preview */}
        <div className="bg-gray-900/60 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-lg font-bold">Fleet Status</h2>
            <button onClick={() => navigate('/vehicles')} className="text-orange-500 text-sm hover:underline">Manage Fleet</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Vehicle ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Driver</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Fuel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {vehicles.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No vehicles added yet.</td></tr>
                ) : (
                  vehicles.slice(0, 5).map(v => (
                    <tr key={v.id}>
                      <td className="px-6 py-4 text-sm font-medium">{v.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{v.driverName}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-800 text-gray-300">
                          {v.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{v.fuel}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Preview */}
        <div className="bg-gray-900/60 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-lg font-bold">User Management</h2>
            <button onClick={() => navigate('/users-management')} className="text-orange-500 text-sm hover:underline">Manage Users</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No users found.</td></tr>
                ) : (
                  users.slice(0, 5).map(u => (
                    <tr key={u.id}>
                      <td className="px-6 py-4 text-sm font-medium">{u.name}</td>
                      <td className="px-6 py-4 text-sm text-blue-400 capitalize">{u.role}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{u.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
