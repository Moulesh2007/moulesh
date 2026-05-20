import React, { useState, useEffect } from 'react';
import { vehiclesApi } from '../../services/api';
import DataTable from '../Common/DataTable';
import Modal from '../Common/Modal';
import FormField from '../Common/FormField';
import { Box, Typography, Button } from '@mui/material';
import { Add, GetApp } from '@mui/icons-material';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  
  const [formData, setFormData] = useState({
    driverName: '',
    status: 'available',
    speed: '0 km/h',
    fuel: '100',
    load: '0',
    deliveries: '0'
  });

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehiclesApi.getAll(search);
      setVehicles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [search]);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingVehicle(item);
      setFormData({
        driverName: item.driverName || '',
        status: item.status || 'available',
        speed: item.speed || '0 km/h',
        fuel: item.fuel || '100',
        load: item.load || '0',
        deliveries: item.deliveries || '0'
      });
    } else {
      setEditingVehicle(null);
      setFormData({ driverName: '', status: 'available', speed: '0 km/h', fuel: '100', load: '0', deliveries: '0' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        await vehiclesApi.update(editingVehicle.id, formData);
      } else {
        await vehiclesApi.create(formData);
      }
      setIsModalOpen(false);
      fetchVehicles();
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save vehicle');
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Delete Vehicle ID: ${item.id}?`)) {
      try {
        await vehiclesApi.delete(item.id);
        fetchVehicles();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const columns = [
    { header: 'Vehicle ID', accessor: 'id' },
    { header: 'Driver Name', accessor: 'driverName' },
    { header: 'Status', render: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
        row.status === 'in-transit' ? 'bg-orange-500/20 text-orange-400' :
        row.status === 'dispatched' ? 'bg-blue-500/20 text-blue-400' :
        row.status === 'maintenance' ? 'bg-red-500/20 text-red-400' :
        'bg-green-500/20 text-green-400'
      }`}>
        {row.status.toUpperCase()}
      </span>
    )},
    { header: 'Speed', accessor: 'speed' },
    { header: 'Fuel %', render: (row) => `${row.fuel}%` },
    { header: 'Load', accessor: 'load' },
    { header: 'Deliveries', accessor: 'deliveries' },
  ];

  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#2ECC71' }}>Vehicles & Fleet</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Manage all tracking vehicles</Typography>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outlined"
              startIcon={<GetApp />}
              href={vehiclesApi.exportUrl}
              target="_blank"
              sx={{ color: '#2ECC71', borderColor: '#2ECC71' }}
            >
              Export Excel
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenModal()}
              sx={{ background: 'linear-gradient(135deg, #2ECC71, #27AE60)' }}
            >
              Add Vehicle
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search vehicles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <DataTable
          columns={columns}
          data={vehicles}
          loading={loading}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Driver Name"
              name="driverName"
              value={formData.driverName}
              onChange={e => setFormData({...formData, driverName: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Status"
                name="status"
                type="select"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                options={[
                  { value: 'available', label: 'Available' },
                  { value: 'dispatched', label: 'Dispatched' },
                  { value: 'in-transit', label: 'In Transit' },
                  { value: 'maintenance', label: 'Maintenance' },
                ]}
              />
              <FormField
                label="Speed (e.g. 40 km/h)"
                name="speed"
                value={formData.speed}
                onChange={e => setFormData({...formData, speed: e.target.value})}
              />
              <FormField
                label="Fuel Level (%)"
                name="fuel"
                type="number"
                value={formData.fuel}
                onChange={e => setFormData({...formData, fuel: e.target.value})}
              />
              <FormField
                label="Load"
                name="load"
                value={formData.load}
                onChange={e => setFormData({...formData, load: e.target.value})}
              />
              <FormField
                label="Deliveries Today"
                name="deliveries"
                type="number"
                value={formData.deliveries}
                onChange={e => setFormData({...formData, deliveries: e.target.value})}
              />
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Box>
  );
}
