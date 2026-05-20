import React, { useState, useEffect } from 'react';
import { rawMaterialsApi } from '../../services/api';
import DataTable from '../Common/DataTable';
import Modal from '../Common/Modal';
import FormField from '../Common/FormField';
import { Box, Typography, Button } from '@mui/material';
import { Add, GetApp } from '@mui/icons-material';

export default function RawMaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  
  const [formData, setFormData] = useState({
    materialName: '',
    quantity: '',
    unit: 'Tons',
    supplier: '',
    dateAdded: ''
  });

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const data = await rawMaterialsApi.getAll(search);
      setMaterials(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [search]);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingMaterial(item);
      setFormData({
        materialName: item.materialName || '',
        quantity: item.quantity || '',
        unit: item.unit || 'Tons',
        supplier: item.supplier || '',
        dateAdded: item.dateAdded || ''
      });
    } else {
      setEditingMaterial(null);
      setFormData({ materialName: '', quantity: '', unit: 'Tons', supplier: '', dateAdded: new Date().toISOString().split('T')[0] });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMaterial) {
        await rawMaterialsApi.update(editingMaterial.id, formData);
      } else {
        await rawMaterialsApi.create(formData);
      }
      setIsModalOpen(false);
      fetchMaterials();
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save raw material');
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Delete ${item.materialName}?`)) {
      try {
        await rawMaterialsApi.delete(item.id);
        fetchMaterials();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Material Name', accessor: 'materialName' },
    { header: 'Quantity', render: (row) => `${row.quantity} ${row.unit}` },
    { header: 'Supplier', accessor: 'supplier' },
    { header: 'Date Added', accessor: 'dateAdded' },
  ];

  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1565C0' }}>Raw Materials</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Manage inventory and supplies</Typography>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outlined"
              startIcon={<GetApp />}
              href={rawMaterialsApi.exportUrl}
              target="_blank"
              sx={{ color: '#1565C0', borderColor: '#1565C0' }}
            >
              Export Excel
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenModal()}
              sx={{ background: 'linear-gradient(135deg, #1976D2, #1565C0)' }}
            >
              Add Material
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <DataTable
          columns={columns}
          data={materials}
          loading={loading}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingMaterial ? 'Edit Material' : 'Add Raw Material'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Material Name"
              name="materialName"
              value={formData.materialName}
              onChange={e => setFormData({...formData, materialName: e.target.value})}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: e.target.value})}
              />
              <FormField
                label="Unit"
                name="unit"
                type="select"
                value={formData.unit}
                onChange={e => setFormData({...formData, unit: e.target.value})}
                options={[
                  { value: 'Tons', label: 'Tons' },
                  { value: 'm³', label: 'm³' },
                  { value: 'Bags', label: 'Bags' },
                  { value: 'Liters', label: 'Liters' },
                ]}
              />
            </div>
            <FormField
              label="Supplier"
              name="supplier"
              value={formData.supplier}
              onChange={e => setFormData({...formData, supplier: e.target.value})}
            />
            <FormField
              label="Date Added"
              name="dateAdded"
              type="date"
              value={formData.dateAdded}
              onChange={e => setFormData({...formData, dateAdded: e.target.value})}
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
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
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
