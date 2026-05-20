import React, { useState, useEffect } from 'react';
import { vehiclesApi } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function FleetTracking() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehiclesApi.getAll();
        // The API returns static records from Excel. 
        // Real-time map is disabled since mock data is removed.
        setVehicles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading Fleet Data...</div>;
  }

  const filteredVehicles = filter === 'all' ? vehicles : vehicles.filter(v => v.status === filter);

  const statusCounts = {
    all: vehicles.length,
    'in-transit': vehicles.filter(v => v.status === 'in-transit').length,
    dispatched: vehicles.filter(v => v.status === 'dispatched').length,
    available: vehicles.filter(v => v.status === 'available').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length,
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'in-transit': return 'bg-orange-500 text-white';
      case 'dispatched': return 'bg-blue-500 text-white';
      case 'available': return 'bg-green-500 text-white';
      case 'maintenance': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-[#0d1117] text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold">Fleet Tracking</h1>
            <p className="text-gray-400 mt-2">Overview of all registered vehicles</p>
          </div>
          <button 
            onClick={() => navigate('/vehicles')}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-colors"
          >
            Manage Vehicles
          </button>
        </div>

        {/* Status Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'in-transit', label: 'In Transit', color: 'border-orange-500', bg: 'bg-orange-500/10' },
            { key: 'dispatched', label: 'Dispatched', color: 'border-blue-500', bg: 'bg-blue-500/10' },
            { key: 'available', label: 'Available', color: 'border-green-500', bg: 'bg-green-500/10' },
            { key: 'maintenance', label: 'Maintenance', color: 'border-red-500', bg: 'bg-red-500/10' },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setFilter(filter === item.key ? 'all' : item.key)}
              className={`p-4 rounded-xl border ${filter === item.key ? item.color + ' ' + item.bg : 'border-gray-800 bg-gray-900/50'} hover:bg-gray-800 transition-all text-center`}
            >
              <div className="text-3xl font-bold">{statusCounts[item.key]}</div>
              <div className="text-sm text-gray-400 mt-1">{item.label}</div>
            </button>
          ))}
        </div>

        {/* Note about Maps */}
        <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl text-blue-200 text-sm">
          <strong>Note:</strong> The real-time map has been disabled because all mock/sample GPS data was permanently removed. Vehicle records below are loaded directly from the database.
        </div>

        {/* Vehicle List */}
        <div className="bg-gray-900/60 rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vehicle ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Driver Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Speed</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fuel %</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Deliveries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No vehicles found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map(vehicle => (
                    <tr key={vehicle.id} className="hover:bg-gray-800/30">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{vehicle.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{vehicle.driverName || 'Unassigned'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(vehicle.status)}`}>
                          {vehicle.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{vehicle.speed}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${Math.min(100, Math.max(0, parseInt(vehicle.fuel) || 0))}%` }}></div>
                          </div>
                          <span>{vehicle.fuel}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{vehicle.deliveries}</td>
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
