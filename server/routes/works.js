import express from 'express';
import { readSheet, addRow, updateRow, deleteRow } from '../utils/excelStore.js';
import ExcelJS from 'exceljs';

const router = express.Router();
const FILE = 'works.xlsx';

// GET all works (with optional search)
router.get('/', async (req, res) => {
  try {
    let rows = await readSheet(FILE);
    const q = req.query.search?.toLowerCase();
    if (q) {
      rows = rows.filter(r =>
        r.workName?.toLowerCase().includes(q) ||
        r.clientName?.toLowerCase().includes(q) ||
        r.status?.toLowerCase().includes(q)
      );
    }
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch works.' });
  }
});

// POST add new work
router.post('/', async (req, res) => {
  try {
    const { workName, clientName, startDate, endDate, status } = req.body;
    if (!workName?.trim() || !clientName?.trim()) {
      return res.status(400).json({ message: 'Work Name and Client Name are required.' });
    }
    const row = await addRow(FILE, {
      workName: workName.trim(),
      clientName: clientName.trim(),
      startDate: startDate || '',
      endDate: endDate || '',
      status: status || 'Pending',
    }, 'WRK');
    res.status(201).json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add work.' });
  }
});

// PUT update work
router.put('/:id', async (req, res) => {
  try {
    const { workName, clientName, startDate, endDate, status } = req.body;
    const updated = await updateRow(FILE, req.params.id, {
      workName, clientName, startDate, endDate, status,
    });
    res.json(updated);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// DELETE work
router.delete('/:id', async (req, res) => {
  try {
    await deleteRow(FILE, req.params.id);
    res.json({ message: 'Deleted successfully.' });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// GET export as Excel download
router.get('/export', async (req, res) => {
  try {
    const rows = await readSheet(FILE);
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet('Works');
    ws.addRow(['Work ID', 'Work Name', 'Client Name', 'Start Date', 'End Date', 'Status', 'Created At']);
    rows.forEach(r => ws.addRow([r.id, r.workName, r.clientName, r.startDate, r.endDate, r.status, r.createdAt]));
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=works.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: 'Export failed.' });
  }
});

export default router;
