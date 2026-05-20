import React, { useState, useEffect } from 'react';
import { usersManagementApi } from '../../services/api';
import DataTable from '../Common/DataTable';
import Modal from '../Common/Modal';
import FormField from '../Common/FormField';
import { Box, Typography, Button } from '@mui/material';
import { Add, GetApp } from '@mui/icons-material';

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'Active',
    lastSeen: 'Never'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersManagementApi.getAll(search);
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingUser(item);
      setFormData({
        name: item.name || '',
        email: item.email || '',
        role: item.role || 'user',
        status: item.status || 'Active',
        lastSeen: item.lastSeen || 'Never'
      });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'user', status: 'Active', lastSeen: 'Never' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await usersManagementApi.update(editingUser.id, formData);
      } else {
        await usersManagementApi.create(formData);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save user');
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Delete User: ${item.name}?`)) {
      try {
        await usersManagementApi.delete(item.id);
        fetchUsers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', render: (row) => (
      <span className="capitalize text-blue-400 font-semibold">{row.role}</span>
    )},
    { header: 'Status', render: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
        row.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
      }`}>
        {row.status}
      </span>
    )},
    { header: 'Last Seen', accessor: 'lastSeen' },
  ];

  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#E91E63' }}>Users Management</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>System Access and Roles (Admin Only)</Typography>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outlined"
              startIcon={<GetApp />}
              href={usersManagementApi.exportUrl}
              target="_blank"
              sx={{ color: '#E91E63', borderColor: '#E91E63' }}
            >
              Export Excel
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenModal()}
              sx={{ background: 'linear-gradient(135deg, #E91E63, #C2185B)' }}
            >
              Add User
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-pink-500"
          />
        </div>

        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingUser ? 'Edit User' : 'Add New User'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Role"
                name="role"
                type="select"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
                options={[
                  { value: 'admin', label: 'Admin' },
                  { value: 'manager', label: 'Manager' },
                  { value: 'client', label: 'Client' },
                  { value: 'driver', label: 'Driver' },
                  { value: 'user', label: 'User (No access)' },
                ]}
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
                  { value: 'Suspended', label: 'Suspended' },
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
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium"
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
