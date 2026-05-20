import React, { useEffect, useState } from 'react';
import { vehiclesApi, driversApi } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function ManagerDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vData, dData] = await Promise.all([
          vehiclesApi.getAll(),
          driversApi.getAll()
        ]);
        setVehicles(vData);
        setDrivers(dData);
      } catch (error) {
        console.error('Failed to fetch manager data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading Manager Dashboard...</div>;
  }

  const activeVehicles = vehicles.filter(v => v.status === 'in-transit' || v.status === 'dispatched');

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-[#0d1117] text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-blue-500">Fleet Manager Dashboard</h1>
          <p className="text-gray-400 mt-2">Monitor your fleet and team performance in real-time.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30">
            <div className="text-sm text-blue-400 font-semibold mb-1">Active Fleet</div>
            <div className="text-4xl font-bold text-white">{activeVehicles.length} / {vehicles.length}</div>
          </div>
          <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30">
            <div className="text-sm text-blue-400 font-semibold mb-1">Team Members</div>
            <div className="text-4xl font-bold text-white">{drivers.length}</div>
          </div>
          <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30">
            <div className="text-sm text-blue-400 font-semibold mb-1">Deliveries Today</div>
            <div className="text-4xl font-bold text-white">
              {vehicles.reduce((sum, v) => sum + parseInt(v.deliveries || 0), 0)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Fleet Grid */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-400">Active Fleet</h2>
              <button onClick={() => navigate('/vehicles')} className="text-sm text-blue-500 hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {activeVehicles.length === 0 ? (
                <div className="p-6 bg-gray-900/50 rounded-xl text-center text-gray-500 border border-gray-800">No active vehicles.</div>
              ) : (
                activeVehicles.map(v => (
                  <div key={v.id} className="p-4 bg-gray-900/60 rounded-xl border border-gray-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-lg">{v.id}</div>
                      <div className="text-sm text-gray-400">{v.driverName}</div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 block mb-2">{v.status}</span>
                      <div className="text-sm text-gray-400">Fuel: {v.fuel}%</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Team Members List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-400">Team Management</h2>
              <button onClick={() => navigate('/drivers')} className="text-sm text-blue-500 hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {drivers.length === 0 ? (
                <div className="p-6 bg-gray-900/50 rounded-xl text-center text-gray-500 border border-gray-800">No drivers added yet.</div>
              ) : (
                drivers.map(d => (
                  <div key={d.id} className="p-4 bg-gray-900/60 rounded-xl border border-gray-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold">{d.name}</div>
                      <div className="text-sm text-gray-400">{d.phone} • {d.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-yellow-500">⭐ {d.rating}</div>
                      <div className="text-xs text-gray-500 mt-1">{d.vehicleId ? `Vehicle: ${d.vehicleId}` : 'Unassigned'}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
