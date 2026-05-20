import express from 'express';
import { readSheet, addRow, updateRow, deleteRow } from '../utils/excelStore.js';
import ExcelJS from 'exceljs';

const router = express.Router();
const FILE = 'vehicles.xlsx';

router.get('/', async (req, res) => {
  try {
    let rows = await readSheet(FILE);
    const q = req.query.search?.toLowerCase();
    if (q) {
      rows = rows.filter(r =>
        r.driverName?.toLowerCase().includes(q) ||
        r.status?.toLowerCase().includes(q)
      );
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch vehicles.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { driverName, status, speed, fuel, load, deliveries } = req.body;
    const row = await addRow(FILE, {
      driverName: driverName?.trim() || '',
      status: status || 'idle',
      speed: speed || '0 km/h',
      fuel: fuel || '100',
      load: load || '0',
      deliveries: deliveries || '0',
    }, 'VH');
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add vehicle.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { driverName, status, speed, fuel, load, deliveries } = req.body;
    const updated = await updateRow(FILE, req.params.id, { driverName, status, speed, fuel, load, deliveries });
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
    const ws = workbook.addWorksheet('Vehicles');
    ws.addRow(['Vehicle ID', 'Driver Name', 'Status', 'Speed', 'Fuel', 'Load', 'Deliveries', 'Created At']);
    rows.forEach(r => ws.addRow([r.id, r.driverName, r.status, r.speed, r.fuel, r.load, r.deliveries, r.createdAt]));
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=vehicles.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: 'Export failed.' });
  }
});

export default router;
