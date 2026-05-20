import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const SCHEMA = {
  'works.xlsx': ['id', 'workName', 'clientName', 'startDate', 'endDate', 'status', 'createdAt'],
  'raw_materials.xlsx': ['id', 'materialName', 'quantity', 'unit', 'supplier', 'dateAdded', 'createdAt'],
  'vehicles.xlsx': ['id', 'driverName', 'status', 'speed', 'fuel', 'load', 'deliveries', 'createdAt'],
  'drivers.xlsx': ['id', 'name', 'phone', 'email', 'vehicleId', 'status', 'rating', 'createdAt'],
  'users_management.xlsx': ['id', 'name', 'role', 'email', 'status', 'lastSeen', 'createdAt'],
};

function getFilePath(filename) {
  return path.join(DATA_DIR, filename);
}

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// Read all rows from an Excel file
export async function readSheet(filename) {
  const filePath = getFilePath(filename);
  const columns = SCHEMA[filename];
  if (!columns) throw new Error(`Unknown file: ${filename}`);

  if (!fs.existsSync(filePath)) return [];

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet(1);
  if (!worksheet) return [];

  const rows = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // skip header
    const obj = {};
    columns.forEach((col, idx) => {
      const cell = row.getCell(idx + 1);
      obj[col] = cell.value !== null && cell.value !== undefined ? String(cell.value) : '';
    });
    rows.push(obj);
  });
  return rows;
}

// Write all rows to an Excel file (full overwrite)
export async function writeSheet(filename, rows) {
  const filePath = getFilePath(filename);
  const columns = SCHEMA[filename];
  if (!columns) throw new Error(`Unknown file: ${filename}`);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // Header row
  worksheet.addRow(columns);
  // Style header
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFF6F00' },
  };
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };

  // Data rows
  rows.forEach(obj => {
    worksheet.addRow(columns.map(col => obj[col] ?? ''));
  });

  // Auto-fit columns
  columns.forEach((col, idx) => {
    worksheet.getColumn(idx + 1).width = 20;
  });

  await workbook.xlsx.writeFile(filePath);
}

// Add a single new row
export async function addRow(filename, data, idPrefix = 'ID') {
  const rows = await readSheet(filename);
  const newRow = {
    ...data,
    id: generateId(idPrefix),
    createdAt: new Date().toISOString(),
  };
  rows.push(newRow);
  await writeSheet(filename, rows);
  return newRow;
}

// Update a row by id
export async function updateRow(filename, id, updates) {
  const rows = await readSheet(filename);
  const idx = rows.findIndex(r => r.id === id);
  if (idx === -1) throw new Error('Record not found');
  rows[idx] = { ...rows[idx], ...updates, id, createdAt: rows[idx].createdAt };
  await writeSheet(filename, rows);
  return rows[idx];
}

// Delete a row by id
export async function deleteRow(filename, id) {
  const rows = await readSheet(filename);
  const filtered = rows.filter(r => r.id !== id);
  if (filtered.length === rows.length) throw new Error('Record not found');
  await writeSheet(filename, filtered);
  return { deleted: true };
}
