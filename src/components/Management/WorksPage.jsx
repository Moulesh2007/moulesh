import React, { useState, useEffect } from 'react';
import { worksApi } from '../../services/api';
import DataTable from '../Common/DataTable';
import Modal from '../Common/Modal';
import FormField from '../Common/FormField';
import { Box, Typography, Button } from '@mui/material';
import { Add, GetApp } from '@mui/icons-material';

export default function WorksPage() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState(null);
  
  const [formData, setFormData] = useState({
    workName: '',
    clientName: '',
    startDate: '',
    endDate: '',
    status: 'Pending'
  });

  const fetchWorks = async () => {
    try {
      setLoading(true);
      const data = await worksApi.getAll(search);
      setWorks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, [search]);

  const handleOpenModal = (work = null) => {
    if (work) {
      setEditingWork(work);
      setFormData({
        workName: work.workName || '',
        clientName: work.clientName || '',
        startDate: work.startDate || '',
        endDate: work.endDate || '',
        status: work.status || 'Pending'
      });
    } else {
      setEditingWork(null);
      setFormData({ workName: '', clientName: '', startDate: '', endDate: '', status: 'Pending' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingWork) {
        await worksApi.update(editingWork.id, formData);
      } else {
        await worksApi.create(formData);
      }
      setIsModalOpen(false);
      fetchWorks();
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save work');
    }
  };

  const handleDelete = async (work) => {
    if (window.confirm(`Delete work ${work.workName}?`)) {
      try {
        await worksApi.delete(work.id);
        fetchWorks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Work Name', accessor: 'workName' },
    { header: 'Client', accessor: 'clientName' },
    { header: 'Timeline', render: (row) => `${row.startDate} - ${row.endDate}` },
    { header: 'Status', render: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
        row.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
        row.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
        'bg-yellow-500/20 text-yellow-400'
      }`}>
        {row.status}
      </span>
    )}
  ];

  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#FF6F00' }}>Works Management</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Manage all projects and works</Typography>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outlined"
              startIcon={<GetApp />}
              href={worksApi.exportUrl}
              target="_blank"
              sx={{ color: '#FF6F00', borderColor: '#FF6F00' }}
            >
              Export Excel
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenModal()}
              sx={{ background: 'linear-gradient(135deg, #FF6F00, #E65100)' }}
            >
              Add Work
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search works..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-orange-500"
          />
        </div>

        <DataTable
          columns={columns}
          data={works}
          loading={loading}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingWork ? 'Edit Work' : 'Add New Work'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Work Name"
              name="workName"
              value={formData.workName}
              onChange={e => setFormData({...formData, workName: e.target.value})}
              required
            />
            <FormField
              label="Client Name"
              name="clientName"
              value={formData.clientName}
              onChange={e => setFormData({...formData, clientName: e.target.value})}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
              />
              <FormField
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={e => setFormData({...formData, endDate: e.target.value})}
              />
            </div>
            <FormField
              label="Status"
              name="status"
              type="select"
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
              options={[
                { value: 'Pending', label: 'Pending' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Completed', label: 'Completed' }
              ]}
            />
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
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium"
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
