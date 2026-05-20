import express from 'express';
import { readSheet, addRow, updateRow, deleteRow } from '../utils/excelStore.js';
import ExcelJS from 'exceljs';

const router = express.Router();
const FILE = 'raw_materials.xlsx';

router.get('/', async (req, res) => {
  try {
    let rows = await readSheet(FILE);
    const q = req.query.search?.toLowerCase();
    if (q) {
      rows = rows.filter(r =>
        r.materialName?.toLowerCase().includes(q) ||
        r.supplier?.toLowerCase().includes(q) ||
        r.unit?.toLowerCase().includes(q)
      );
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch raw materials.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { materialName, quantity, unit, supplier, dateAdded } = req.body;
    if (!materialName?.trim()) {
      return res.status(400).json({ message: 'Material Name is required.' });
    }
    const row = await addRow(FILE, {
      materialName: materialName.trim(),
      quantity: quantity || '0',
      unit: unit?.trim() || '',
      supplier: supplier?.trim() || '',
      dateAdded: dateAdded || new Date().toISOString().split('T')[0],
    }, 'MAT');
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add raw material.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { materialName, quantity, unit, supplier, dateAdded } = req.body;
    const updated = await updateRow(FILE, req.params.id, { materialName, quantity, unit, supplier, dateAdded });
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
    const ws = workbook.addWorksheet('Raw Materials');
    ws.addRow(['Material ID', 'Material Name', 'Quantity', 'Unit', 'Supplier', 'Date Added', 'Created At']);
    rows.forEach(r => ws.addRow([r.id, r.materialName, r.quantity, r.unit, r.supplier, r.dateAdded, r.createdAt]));
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=raw_materials.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: 'Export failed.' });
  }
});

export default router;
