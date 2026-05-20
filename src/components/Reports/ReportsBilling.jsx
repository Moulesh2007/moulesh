import React, { useState } from 'react';
import {
  Container, Paper, Grid, Card, CardContent, Typography, Box,
  Tabs, Tab, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Button, LinearProgress,
  IconButton, Divider,
} from '@mui/material';
import { Assessment, Receipt, HeadsetMic, Download, TrendingUp, AttachMoney, PictureAsPdf, Email, Phone, Chat, Help, ArrowForward } from '@mui/icons-material';

const glass = { background: 'rgba(22,27,34,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)' };

const salesData = [
  { month: 'Jan', concrete: 2400, asphalt: 800, revenue: '₹18.2L' },
  { month: 'Feb', concrete: 2100, asphalt: 950, revenue: '₹17.5L' },
  { month: 'Mar', concrete: 2800, asphalt: 1100, revenue: '₹22.1L' },
  { month: 'Apr', concrete: 3200, asphalt: 1300, revenue: '₹28.4L' },
  { month: 'May', concrete: 1800, asphalt: 700, revenue: '₹14.2L' },
];

const invoices = [
  { id: 'INV-2605-001', client: 'State DOT', project: 'NH-48 Extension', amount: '₹4,52,000', date: '2026-05-10', status: 'paid', dueDate: '2026-05-20' },
  { id: 'INV-2605-002', client: 'Metro Corp', project: 'Phase III', amount: '₹7,85,000', date: '2026-05-08', status: 'pending', dueDate: '2026-05-25' },
  { id: 'INV-2605-003', client: 'AAI', project: 'Runway Resurfacing', amount: '₹3,20,000', date: '2026-05-05', status: 'overdue', dueDate: '2026-05-12' },
  { id: 'INV-2605-004', client: 'MIDC', project: 'Access Road', amount: '₹2,10,000', date: '2026-05-01', status: 'paid', dueDate: '2026-05-15' },
  { id: 'INV-2604-005', client: 'ABC Builders', project: 'Commercial Complex', amount: '₹5,60,000', date: '2026-04-28', status: 'pending', dueDate: '2026-05-28' },
];

const statusColors = { paid: '#2ECC71', pending: '#F39C12', overdue: '#E74C3C', draft: '#8B949E' };

export default function ReportsBilling() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box sx={{ minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Reports & Billing</Typography>
          <Typography variant="body2" sx={{ color: '#8B949E' }}>Sales reports, invoices, and support</Typography>
        </Box>

        <Paper sx={{ ...glass, mb: 3, px: 1 }}>
          <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} variant="scrollable" scrollButtons="auto">
            <Tab icon={<Assessment sx={{ fontSize: 18 }} />} iconPosition="start" label="Reports" />
            <Tab icon={<Receipt sx={{ fontSize: 18 }} />} iconPosition="start" label="Billing" />
            <Tab icon={<HeadsetMic sx={{ fontSize: 18 }} />} iconPosition="start" label="Support" />
          </Tabs>
        </Paper>

        {/* REPORTS TAB */}
        {tabIndex === 0 && (
          <>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {[
                { label: 'Total Revenue', value: '₹1.02 Cr', color: '#2ECC71', icon: <AttachMoney /> },
                { label: 'Concrete Sold', value: '12,300 m³', color: '#1565C0', icon: <TrendingUp /> },
                { label: 'Asphalt Sold', value: '4,850 TPH', color: '#FF6F00', icon: <TrendingUp /> },
                { label: 'Avg. Daily Orders', value: '14.5', color: '#F39C12', icon: <Assessment /> },
              ].map(s => (
                <Grid item xs={6} sm={3} key={s.label}>
                  <Card sx={{ ...glass, borderLeft: `3px solid ${s.color}`, transition: 'all 0.3s', '&:hover': { transform: 'translateY(-3px)' } }}>
                    <CardContent sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#8B949E' }}>{s.label}</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: s.color }}>{s.value}</Typography>
                        </Box>
                        <Box sx={{ width: 40, height: 40, borderRadius: 2, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Chart placeholder */}
            <Paper sx={{ ...glass, p: 3, mb: 3, background: 'linear-gradient(135deg, rgba(255,111,0,0.05), rgba(21,101,192,0.05))', border: '1px solid rgba(255,111,0,0.12)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Monthly Production & Sales</Typography>
                <Button startIcon={<PictureAsPdf />} variant="outlined" size="small" sx={{ borderColor: '#FF6F00', color: '#FF6F00' }}>Export PDF</Button>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 180, overflow: 'hidden' }}>
                {salesData.map((d, i) => (
                  <Box key={d.month} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#FF6F00', fontWeight: 700 }}>{d.revenue}</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-end', height: 120, width: '100%' }}>
                      <Box sx={{
                        flex: 1, height: `${(d.concrete / 3500) * 100}%`, borderRadius: '4px 4px 0 0',
                        background: 'linear-gradient(180deg, #1565C0, #1565C080)',
                        transition: 'height 0.6s ease', animation: `grow 0.6s ease ${i * 0.1}s both`,
                        '@keyframes grow': { from: { height: 0 }, to: { height: `${(d.concrete / 3500) * 100}%` } },
                      }} />
                      <Box sx={{
                        flex: 1, height: `${(d.asphalt / 3500) * 100}%`, borderRadius: '4px 4px 0 0',
                        background: 'linear-gradient(180deg, #FF6F00, #FF6F0080)',
                        animation: `grow 0.6s ease ${i * 0.1 + 0.1}s both`,
                      }} />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#8B949E', fontWeight: 600 }}>{d.month}</Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 3, mt: 2, justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 1, background: '#1565C0' }} />
                  <Typography variant="caption" sx={{ color: '#8B949E' }}>Concrete (m³)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 1, background: '#FF6F00' }} />
                  <Typography variant="caption" sx={{ color: '#8B949E' }}>Asphalt (TPH)</Typography>
                </Box>
              </Box>
            </Paper>
          </>
        )}

        {/* BILLING TAB */}
        {tabIndex === 1 && (
          <>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {[
                { label: 'Total Invoiced', value: '₹23.27L', color: '#1565C0' },
                { label: 'Received', value: '₹6.62L', color: '#2ECC71' },
                { label: 'Pending', value: '₹13.45L', color: '#F39C12' },
                { label: 'Overdue', value: '₹3.20L', color: '#E74C3C' },
              ].map(s => (
                <Grid item xs={6} sm={3} key={s.label}>
                  <Card sx={{ ...glass, borderLeft: `3px solid ${s.color}` }}>
                    <CardContent sx={{ py: 2 }}>
                      <Typography variant="caption" sx={{ color: '#8B949E' }}>{s.label}</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: s.color }}>{s.value}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {['All', 'Paid', 'Pending', 'Overdue'].map(f => (
                  <Chip key={f} label={f} sx={{ background: 'rgba(255,255,255,0.05)', color: '#8B949E', fontWeight: 600, cursor: 'pointer', '&:hover': { background: 'rgba(255,111,0,0.1)' } }} />
                ))}
              </Box>
              <Button variant="contained" color="primary" size="small">+ New Invoice</Button>
            </Box>

            <TableContainer component={Paper} sx={{ ...glass }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Invoice ID</TableCell>
                    <TableCell>Client</TableCell>
                    <TableCell>Project</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.map(inv => (
                    <TableRow key={inv.id}>
                      <TableCell sx={{ fontWeight: 700, color: '#FF6F00' }}>{inv.id}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{inv.client}</TableCell>
                      <TableCell>{inv.project}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>{inv.amount}</TableCell>
                      <TableCell>{inv.date}</TableCell>
                      <TableCell>{inv.dueDate}</TableCell>
                      <TableCell>
                        <Chip label={inv.status.toUpperCase()} size="small" sx={{
                          background: `${statusColors[inv.status]}20`, color: statusColors[inv.status],
                          border: `1px solid ${statusColors[inv.status]}40`, fontWeight: 700, fontSize: '0.65rem',
                        }} />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" sx={{ color: '#FF6F00' }}><Download fontSize="small" /></IconButton>
                        <IconButton size="small" sx={{ color: '#1565C0' }}><Email fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* SUPPORT TAB */}
        {tabIndex === 2 && (
          <Grid container spacing={3}>
            {/* Contact Cards */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ ...glass, p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Contact Support</Typography>
                {[
                  { icon: <Phone />, label: 'Helpline', value: '+91 1800-123-4567', sub: 'Mon-Sat, 8 AM - 8 PM', color: '#2ECC71' },
                  { icon: <Email />, label: 'Email', value: 'support@rsco.com', sub: 'Response within 24hrs', color: '#1565C0' },
                  { icon: <Chat />, label: 'Live Chat', value: 'Start Chat', sub: 'Available now', color: '#FF6F00' },
                ].map((c, i) => (
                  <Box key={c.label} sx={{
                    display: 'flex', alignItems: 'center', gap: 2, p: 2, mb: 1.5, borderRadius: 2,
                    background: `${c.color}08`, border: `1px solid ${c.color}20`,
                    cursor: 'pointer', transition: 'all 0.3s',
                    '&:hover': { background: `${c.color}15`, transform: 'translateX(4px)' },
                  }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: 2, background: `${c.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>{c.icon}</Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{c.label}</Typography>
                      <Typography variant="body2" sx={{ color: c.color, fontWeight: 600 }}>{c.value}</Typography>
                      <Typography variant="caption" sx={{ color: '#8B949E' }}>{c.sub}</Typography>
                    </Box>
                    <ArrowForward sx={{ color: '#8B949E', fontSize: 18 }} />
                  </Box>
                ))}
              </Paper>
            </Grid>

            {/* FAQs */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ ...glass, p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Frequently Asked Questions</Typography>
                {[
                  { q: 'How do I place a new order?', a: 'Go to Orders → New Order, select mix type, quantity, and delivery date.' },
                  { q: 'How to track my delivery?', a: 'Use the Fleet Tracking tab for real-time GPS location of your order.' },
                  { q: 'What mix grades are available?', a: 'We offer M20, M25, M30, M35, M40 concrete and Asphalt Grade 1-3.' },
                  { q: 'How to download invoices?', a: 'Go to Billing tab, click the download icon next to any invoice.' },
                  { q: 'How to request a custom mix?', a: 'Go to Inventory → Mix Designs → Custom Mix Request button.' },
                ].map((faq, i) => (
                  <Box key={i} sx={{
                    p: 2, mb: 1.5, borderRadius: 2,
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Help sx={{ fontSize: 16, color: '#FF6F00' }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{faq.q}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#8B949E', pl: 3 }}>{faq.a}</Typography>
                  </Box>
                ))}
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}
