import React, { useState, useEffect } from 'react';
import { driversApi } from '../../services/api';
import DataTable from '../Common/DataTable';
import Modal from '../Common/Modal';
import FormField from '../Common/FormField';
import { Box, Typography, Button } from '@mui/material';
import { Add, GetApp } from '@mui/icons-material';

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleId: '',
    status: 'Active',
    rating: '0'
  });

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const data = await driversApi.getAll(search);
      setDrivers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [search]);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingDriver(item);
      setFormData({
        name: item.name || '',
        phone: item.phone || '',
        email: item.email || '',
        vehicleId: item.vehicleId || '',
        status: item.status || 'Active',
        rating: item.rating || '0'
      });
    } else {
      setEditingDriver(null);
      setFormData({ name: '', phone: '', email: '', vehicleId: '', status: 'Active', rating: '0' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDriver) {
        await driversApi.update(editingDriver.id, formData);
      } else {
        await driversApi.create(formData);
      }
      setIsModalOpen(false);
      fetchDrivers();
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save driver');
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Delete Driver: ${item.name}?`)) {
      try {
        await driversApi.delete(item.id);
        fetchDrivers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const columns = [
    { header: 'Driver ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Contact', render: (row) => (
      <div>
        <div>{row.phone}</div>
        <div className="text-xs text-gray-400">{row.email}</div>
      </div>
    )},
    { header: 'Vehicle Assigned', accessor: 'vehicleId' },
    { header: 'Status', render: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
        row.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
      }`}>
        {row.status}
      </span>
    )},
    { header: 'Rating', render: (row) => `⭐ ${row.rating}` },
  ];

  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#9C27B0' }}>Drivers</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Manage team members and drivers</Typography>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outlined"
              startIcon={<GetApp />}
              href={driversApi.exportUrl}
              target="_blank"
              sx={{ color: '#9C27B0', borderColor: '#9C27B0' }}
            >
              Export Excel
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenModal()}
              sx={{ background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)' }}
            >
              Add Driver
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search drivers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <DataTable
          columns={columns}
          data={drivers}
          loading={loading}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingDriver ? 'Edit Driver' : 'Add New Driver'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <FormField
                label="Assigned Vehicle ID"
                name="vehicleId"
                value={formData.vehicleId}
                onChange={e => setFormData({...formData, vehicleId: e.target.value})}
              />
              <FormField
                label="Rating (0-5)"
                name="rating"
                type="number"
                value={formData.rating}
                onChange={e => setFormData({...formData, rating: e.target.value})}
              />
              <FormField
                label="Status"
                name="status"
                type="select"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                  { value: 'Leave', label: 'On Leave' },
                ]}
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
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
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
