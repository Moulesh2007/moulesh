import express from 'express';
import { readSheet, addRow, updateRow, deleteRow } from '../utils/excelStore.js';
import ExcelJS from 'exceljs';

const router = express.Router();
const FILE = 'drivers.xlsx';

router.get('/', async (req, res) => {
  try {
    let rows = await readSheet(FILE);
    const q = req.query.search?.toLowerCase();
    if (q) {
      rows = rows.filter(r =>
        r.name?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.phone?.toLowerCase().includes(q)
      );
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch drivers.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, phone, email, vehicleId, status, rating } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ message: 'Name is required.' });
    }
    const row = await addRow(FILE, {
      name: name.trim(),
      phone: phone || '',
      email: email || '',
      vehicleId: vehicleId || '',
      status: status || 'Active',
      rating: rating || '0',
    }, 'DRV');
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add driver.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, phone, email, vehicleId, status, rating } = req.body;
    const updated = await updateRow(FILE, req.params.id, { name, phone, email, vehicleId, status, rating });
    res.json(updated);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deleteRow(FILE, req.params.id);
    res.json({ message: 'Deleted successfully.' });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.get('/export', async (req, res) => {
  try {
    const rows = await readSheet(FILE);
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet('Drivers');
    ws.addRow(['Driver ID', 'Name', 'Phone', 'Email', 'Vehicle ID', 'Status', 'Rating', 'Created At']);
    rows.forEach(r => ws.addRow([r.id, r.name, r.phone, r.email, r.vehicleId, r.status, r.rating, r.createdAt]));
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=drivers.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: 'Export failed.' });
  }
});

export default router;
