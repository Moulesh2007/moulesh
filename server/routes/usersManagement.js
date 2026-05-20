import express from 'express';
import { readSheet, addRow, updateRow, deleteRow } from '../utils/excelStore.js';
import ExcelJS from 'exceljs';

const router = express.Router();
const FILE = 'users_management.xlsx';

router.get('/', async (req, res) => {
  try {
    let rows = await readSheet(FILE);
    const q = req.query.search?.toLowerCase();
    if (q) {
      rows = rows.filter(r =>
        r.name?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.role?.toLowerCase().includes(q)
      );
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, role, email, status, lastSeen } = req.body;
    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ message: 'Name and Email are required.' });
    }
    const row = await addRow(FILE, {
      name: name.trim(),
      role: role || 'user',
      email: email.trim(),
      status: status || 'Active',
      lastSeen: lastSeen || 'Never',
    }, 'USR');
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add user.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, role, email, status, lastSeen } = req.body;
    const updated = await updateRow(FILE, req.params.id, { name, role, email, status, lastSeen });
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
    const ws = workbook.addWorksheet('Users');
    ws.addRow(['User ID', 'Name', 'Role', 'Email', 'Status', 'Last Seen', 'Created At']);
    rows.forEach(r => ws.addRow([r.id, r.name, r.role, r.email, r.status, r.lastSeen, r.createdAt]));
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=users_management.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: 'Export failed.' });
  }
});

export default router;
