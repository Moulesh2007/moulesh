import React, { useState } from 'react';
import {
  Container, Paper, Grid, Card, CardContent, Typography, Box,
  LinearProgress, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Tabs, Tab, Alert, Button,
} from '@mui/material';
import { Warning as WarningIcon, Check as CheckIcon, Inventory2, Science, MenuBook, TrendingDown, TrendingUp, ErrorOutline } from '@mui/icons-material';

const glassCard = {
  background: 'rgba(22,27,34,0.6)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.07)',
};

const inventoryItems = [
  { name: 'OPC 53 Cement', stock: 850, capacity: 1000, unit: 'tons', warning: 300, icon: '🏗️', trend: '+12%' },
  { name: 'Coarse Aggregate (20mm)', stock: 180, capacity: 800, unit: 'tons', warning: 200, icon: '🪨', trend: '-8%' },
  { name: 'Fine Aggregate (Sand)', stock: 580, capacity: 700, unit: 'tons', warning: 200, icon: '⛱️', trend: '+5%' },
  { name: 'VG-30 Bitumen', stock: 120, capacity: 500, unit: 'tons', warning: 150, icon: '🛢️', trend: '-15%' },
  { name: 'Process Water', stock: 250, capacity: 300, unit: 'KL', warning: 100, icon: '💧', trend: '+2%' },
  { name: 'Admixture (Plasticizer)', stock: 45, capacity: 100, unit: 'KL', warning: 25, icon: '🧪', trend: '-3%' },
];

const qualityReports = [
  { id: 'QR-001', date: '2026-05-11', testType: 'Slump Test', batchId: 'B-2605-01', mixGrade: 'M25', result: 140, unit: 'mm', requirement: '130-150 mm', status: 'pass', tester: 'Lab Tech A' },
  { id: 'QR-002', date: '2026-05-11', testType: 'Cube Strength (28d)', batchId: 'B-2605-01', mixGrade: 'M25', result: 42.5, unit: 'MPa', requirement: '>40 MPa', status: 'pass', tester: 'Lab Tech B' },
  { id: 'QR-003', date: '2026-05-10', testType: 'Asphalt Density', batchId: 'B-2604-02', mixGrade: 'AG-1', result: 2.35, unit: 'g/cm³', requirement: '2.3-2.4', status: 'pass', tester: 'Lab Tech A' },
  { id: 'QR-004', date: '2026-05-10', testType: 'Slump Test', batchId: 'B-2604-03', mixGrade: 'M20', result: 125, unit: 'mm', requirement: '130-150 mm', status: 'fail', tester: 'Lab Tech C' },
  { id: 'QR-005', date: '2026-05-09', testType: 'Marshall Stability', batchId: 'B-2603-01', mixGrade: 'AG-2', result: 12.8, unit: 'kN', requirement: '>8 kN', status: 'pass', tester: 'Lab Tech B' },
  { id: 'QR-006', date: '2026-05-09', testType: 'Cube Strength (7d)', batchId: 'B-2603-02', mixGrade: 'M30', result: 28.2, unit: 'MPa', requirement: '>25 MPa', status: 'pass', tester: 'Lab Tech A' },
];

const mixDesigns = [
  { name: 'M20 Standard', grade: 'M20', type: 'Concrete', cement: 310, coarse: 1100, fine: 820, water: 200, admixture: 1.5, wcRatio: 0.50 },
  { name: 'M25 Standard', grade: 'M25', type: 'Concrete', cement: 340, coarse: 1050, fine: 800, water: 195, admixture: 1.8, wcRatio: 0.45 },
  { name: 'M30 High Strength', grade: 'M30', type: 'Concrete', cement: 370, coarse: 1000, fine: 780, water: 190, admixture: 2.2, wcRatio: 0.40 },
  { name: 'M35 High Strength', grade: 'M35', type: 'Concrete', cement: 400, coarse: 980, fine: 760, water: 185, admixture: 2.5, wcRatio: 0.38 },
  { name: 'M40 Special Grade', grade: 'M40', type: 'Concrete', cement: 430, coarse: 960, fine: 740, water: 180, admixture: 3.0, wcRatio: 0.35 },
  { name: 'Asphalt Grade 1 (DBM)', grade: 'AG-1', type: 'Asphalt', bitumen: 4.5, coarseAgg: 62, fineAgg: 28, filler: 5.5, temp: '160°C' },
  { name: 'Asphalt Grade 2 (BC)', grade: 'AG-2', type: 'Asphalt', bitumen: 5.5, coarseAgg: 55, fineAgg: 33, filler: 6.5, temp: '155°C' },
];

export default function InventoryQuality() {
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event, newIndex) => setTabIndex(newIndex);

  const getStockStatus = (stock, capacity) => {
    const pct = (stock / capacity) * 100;
    if (pct < 20) return 'critical';
    if (pct < 40) return 'low';
    return 'normal';
  };

  const statusConfig = {
    normal: { color: '#2ECC71', bg: 'rgba(46,204,113,0.08)', border: 'rgba(46,204,113,0.2)', label: 'ADEQUATE' },
    low: { color: '#F39C12', bg: 'rgba(243,156,18,0.08)', border: 'rgba(243,156,18,0.2)', label: 'LOW STOCK' },
    critical: { color: '#E74C3C', bg: 'rgba(231,76,60,0.08)', border: 'rgba(231,76,60,0.2)', label: 'CRITICAL' },
  };

  const lowStockItems = inventoryItems.filter(item => getStockStatus(item.stock, item.capacity) !== 'normal');

  return (
    <Box sx={{ minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Inventory & Quality</Typography>
          <Typography variant="body2" sx={{ color: '#8B949E' }}>Stock levels, quality reports, and mix design library</Typography>
        </Box>

        {/* Tabs */}
        <Paper sx={{ ...glassCard, mb: 3, px: 1 }}>
          <Tabs value={tabIndex} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab icon={<Inventory2 sx={{ fontSize: 18 }} />} iconPosition="start" label="Inventory Stock" />
            <Tab icon={<Science sx={{ fontSize: 18 }} />} iconPosition="start" label="Quality Reports" />
            <Tab icon={<MenuBook sx={{ fontSize: 18 }} />} iconPosition="start" label="Mix Design Library" />
          </Tabs>
        </Paper>

        {/* ======= INVENTORY TAB ======= */}
        {tabIndex === 0 && (
          <>
            {/* Low Stock Alerts */}
            {lowStockItems.length > 0 && (
              <Alert
                severity="warning"
                icon={<ErrorOutline />}
                sx={{
                  mb: 3, borderRadius: 2,
                  background: 'rgba(243,156,18,0.1)',
                  border: '1px solid rgba(243,156,18,0.3)',
                  color: '#F39C12',
                  '& .MuiAlert-icon': { color: '#F39C12' },
                }}
              >
                <strong>{lowStockItems.length} item(s)</strong> running low on stock —
                {lowStockItems.map(i => i.name).join(', ')}
              </Alert>
            )}

            {/* Summary Row */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <Card sx={{ ...glassCard, borderLeft: '3px solid #2ECC71' }}>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="caption" sx={{ color: '#8B949E' }}>Total Items</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#2ECC71' }}>{inventoryItems.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ ...glassCard, borderLeft: '3px solid #E74C3C' }}>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="caption" sx={{ color: '#8B949E' }}>Critical Items</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#E74C3C' }}>
                      {inventoryItems.filter(i => getStockStatus(i.stock, i.capacity) === 'critical').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ ...glassCard, borderLeft: '3px solid #F39C12' }}>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="caption" sx={{ color: '#8B949E' }}>Low Stock</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#F39C12' }}>
                      {inventoryItems.filter(i => getStockStatus(i.stock, i.capacity) === 'low').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ ...glassCard, borderLeft: '3px solid #1565C0' }}>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="caption" sx={{ color: '#8B949E' }}>Avg. Capacity</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1565C0' }}>
                      {Math.round(inventoryItems.reduce((s, i) => s + (i.stock / i.capacity) * 100, 0) / inventoryItems.length)}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Inventory Cards */}
            <Grid container spacing={3}>
              {inventoryItems.map((item, idx) => {
                const status = getStockStatus(item.stock, item.capacity);
                const pct = (item.stock / item.capacity) * 100;
                const cfg = statusConfig[status];
                return (
                  <Grid item xs={12} sm={6} md={4} key={item.name}>
                    <Card sx={{
                      ...glassCard,
                      background: cfg.bg,
                      border: `1px solid ${cfg.border}`,
                      transition: 'all 0.3s ease',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 30px ${cfg.color}15` },
                      animation: `fadeIn 0.4s ease ${idx * 0.08}s both`,
                      '@keyframes fadeIn': { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Typography fontSize={28}>{item.icon}</Typography>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.name}</Typography>
                              <Chip label={cfg.label} size="small" sx={{
                                background: `${cfg.color}20`, color: cfg.color,
                                fontWeight: 700, fontSize: '0.6rem', height: 20,
                              }} />
                            </Box>
                          </Box>
                          <Chip
                            icon={item.trend.startsWith('+') ? <TrendingUp sx={{ fontSize: '14px !important' }} /> : <TrendingDown sx={{ fontSize: '14px !important' }} />}
                            label={item.trend}
                            size="small"
                            sx={{
                              background: item.trend.startsWith('+') ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)',
                              color: item.trend.startsWith('+') ? '#2ECC71' : '#E74C3C',
                              fontWeight: 700, fontSize: '0.7rem',
                              '& .MuiChip-icon': { color: item.trend.startsWith('+') ? '#2ECC71' : '#E74C3C' },
                            }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="h5" sx={{ fontWeight: 800 }}>
                            {item.stock} <Typography component="span" variant="body2" sx={{ color: '#8B949E' }}>/ {item.capacity} {item.unit}</Typography>
                          </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={Math.min(pct, 100)} sx={{
                          height: 8, borderRadius: 4,
                          '& .MuiLinearProgress-bar': { background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}AA)` },
                        }} />
                        <Typography variant="caption" sx={{ color: '#8B949E', mt: 1, display: 'block' }}>
                          {pct.toFixed(1)}% of capacity · Reorder below {item.warning} {item.unit}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </>
        )}

        {/* ======= QUALITY REPORTS TAB ======= */}
        {tabIndex === 1 && (
          <>
            {/* Summary */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <Card sx={{ ...glassCard, borderLeft: '3px solid #2ECC71' }}>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="caption" sx={{ color: '#8B949E' }}>Pass Rate</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#2ECC71' }}>
                      {Math.round(qualityReports.filter(r => r.status === 'pass').length / qualityReports.length * 100)}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ ...glassCard, borderLeft: '3px solid #1565C0' }}>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="caption" sx={{ color: '#8B949E' }}>Total Tests</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1565C0' }}>{qualityReports.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ ...glassCard, borderLeft: '3px solid #E74C3C' }}>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="caption" sx={{ color: '#8B949E' }}>Failed Tests</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#E74C3C' }}>
                      {qualityReports.filter(r => r.status === 'fail').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ ...glassCard, borderLeft: '3px solid #FF6F00' }}>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="caption" sx={{ color: '#8B949E' }}>Today's Tests</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#FF6F00' }}>
                      {qualityReports.filter(r => r.date === '2026-05-11').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <TableContainer component={Paper} sx={{ ...glassCard }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Report ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Test Type</TableCell>
                    <TableCell>Batch / Grade</TableCell>
                    <TableCell>Result</TableCell>
                    <TableCell>Requirement</TableCell>
                    <TableCell>Tester</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {qualityReports.map(report => (
                    <TableRow key={report.id}>
                      <TableCell sx={{ fontWeight: 700, color: '#FF6F00' }}>{report.id}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{report.testType}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{report.batchId}</Typography>
                        <Chip label={report.mixGrade} size="small" sx={{
                          background: 'rgba(21,101,192,0.15)', color: '#5E92F3', fontWeight: 600, fontSize: '0.65rem',
                        }} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{report.result} {report.unit}</TableCell>
                      <TableCell sx={{ color: '#8B949E' }}>{report.requirement}</TableCell>
                      <TableCell>{report.tester}</TableCell>
                      <TableCell>
                        <Chip
                          icon={report.status === 'pass' ? <CheckIcon sx={{ fontSize: '14px !important' }} /> : <WarningIcon sx={{ fontSize: '14px !important' }} />}
                          label={report.status.toUpperCase()}
                          size="small"
                          sx={{
                            background: report.status === 'pass' ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)',
                            color: report.status === 'pass' ? '#2ECC71' : '#E74C3C',
                            border: `1px solid ${report.status === 'pass' ? 'rgba(46,204,113,0.3)' : 'rgba(231,76,60,0.3)'}`,
                            fontWeight: 700,
                            '& .MuiChip-icon': { color: report.status === 'pass' ? '#2ECC71' : '#E74C3C' },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* ======= MIX DESIGNS TAB ======= */}
        {tabIndex === 2 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label="All" sx={{ background: 'rgba(255,111,0,0.2)', color: '#FF9800', fontWeight: 700 }} />
                <Chip label="Concrete" sx={{ background: 'rgba(21,101,192,0.15)', color: '#5E92F3', fontWeight: 600 }} />
                <Chip label="Asphalt" sx={{ background: 'rgba(243,156,18,0.15)', color: '#F39C12', fontWeight: 600 }} />
              </Box>
              <Button variant="contained" color="primary" size="small">+ Custom Mix Request</Button>
            </Box>

            <Grid container spacing={3}>
              {mixDesigns.map((design, idx) => (
                <Grid item xs={12} sm={6} md={4} key={design.name}>
                  <Card sx={{
                    ...glassCard,
                    background: design.type === 'Concrete' ? 'rgba(21,101,192,0.06)' : 'rgba(243,156,18,0.06)',
                    border: `1px solid ${design.type === 'Concrete' ? 'rgba(21,101,192,0.15)' : 'rgba(243,156,18,0.15)'}`,
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{design.name}</Typography>
                          <Chip label={design.type} size="small" sx={{
                            background: design.type === 'Concrete' ? 'rgba(21,101,192,0.2)' : 'rgba(243,156,18,0.2)',
                            color: design.type === 'Concrete' ? '#5E92F3' : '#F39C12',
                            fontWeight: 700, fontSize: '0.65rem',
                          }} />
                        </Box>
                        <Box sx={{
                          width: 44, height: 44, borderRadius: 2,
                          background: design.type === 'Concrete' ? 'rgba(21,101,192,0.15)' : 'rgba(243,156,18,0.15)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Typography variant="body1" sx={{ fontWeight: 800, color: design.type === 'Concrete' ? '#5E92F3' : '#F39C12' }}>
                            {design.grade}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                        {design.type === 'Concrete' ? (
                          <>
                            <InfoRow label="Cement" value={`${design.cement} kg/m³`} />
                            <InfoRow label="Coarse Agg." value={`${design.coarse} kg/m³`} />
                            <InfoRow label="Fine Agg." value={`${design.fine} kg/m³`} />
                            <InfoRow label="Water" value={`${design.water} L/m³`} />
                            <InfoRow label="Admixture" value={`${design.admixture} L/m³`} />
                            <InfoRow label="W/C Ratio" value={design.wcRatio} highlight />
                          </>
                        ) : (
                          <>
                            <InfoRow label="Bitumen" value={`${design.bitumen}%`} />
                            <InfoRow label="Coarse Agg." value={`${design.coarseAgg}%`} />
                            <InfoRow label="Fine Agg." value={`${design.fineAgg}%`} />
                            <InfoRow label="Filler" value={`${design.filler}%`} />
                            <InfoRow label="Mix Temp" value={design.temp} highlight />
                          </>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
}

function InfoRow({ label, value, highlight }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
      <Typography variant="body2" sx={{ color: '#8B949E' }}>{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 700, color: highlight ? '#FF6F00' : '#E6EDF3' }}>{value}</Typography>
    </Box>
  );
}
