import React, { useState } from 'react';
import {
  Container, Paper, TextField, Button, Grid, Typography, Box,
  Stepper, Step, StepLabel, Card, CardContent, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
  StepConnector, IconButton, Snackbar, Alert,
} from '@mui/material';
import { Add as AddIcon, Visibility as VisibilityIcon, LocalShipping, Schedule, CheckCircle, Inventory, Close, LocationOn } from '@mui/icons-material';

const glassCard = {
  background: 'rgba(22,27,34,0.6)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.07)',
};

const mixTypes = ['M20', 'M25', 'M30', 'M35', 'M40', 'Asphalt Grade 1', 'Asphalt Grade 2', 'Asphalt Grade 3'];

const orderSteps = [
  { label: 'Processing', icon: <Inventory sx={{ fontSize: 20 }} /> },
  { label: 'Dispatched', icon: <LocalShipping sx={{ fontSize: 20 }} /> },
  { label: 'On the Way', icon: <Schedule sx={{ fontSize: 20 }} /> },
  { label: 'Delivered', icon: <CheckCircle sx={{ fontSize: 20 }} /> },
];

const mockOrders = [
  { id: 'ORD-001', mixType: 'M25', quantity: 50, status: 'delivered', deliveryDate: '2026-05-10', site: 'NH-48 Highway Extension', driver: 'Ramesh K.', truck: 'TN-01-AB-1234', eta: 'Completed' },
  { id: 'ORD-002', mixType: 'Asphalt Grade 1', quantity: 30, status: 'on-the-way', deliveryDate: '2026-05-12', site: 'Metro Phase III - Sector 9', driver: 'Suresh P.', truck: 'TN-01-CD-5678', eta: '45 min' },
  { id: 'ORD-003', mixType: 'M20', quantity: 40, status: 'dispatched', deliveryDate: '2026-05-11', site: 'Airport Runway Resurfacing', driver: 'Vijay S.', truck: 'TN-01-EF-9012', eta: '1h 20min' },
  { id: 'ORD-004', mixType: 'M30', quantity: 65, status: 'processing', deliveryDate: '2026-05-13', site: 'Industrial Park Access Road', driver: 'Pending', truck: 'Pending', eta: 'N/A' },
  { id: 'ORD-005', mixType: 'M35', quantity: 25, status: 'on-the-way', deliveryDate: '2026-05-11', site: 'Commercial Complex Phase 2', driver: 'Arjun M.', truck: 'TN-01-GH-3456', eta: '20 min' },
];

export default function OrderManagement() {
  const [orders, setOrders] = useState(mockOrders);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({ mixType: '', quantity: '', deliveryDate: '', site: '' });
  const [filter, setFilter] = useState('all');

  const handleOpenDialog = (order = null) => {
    if (order) {
      setSelectedOrder(order);
      setFormData({ mixType: order.mixType, quantity: order.quantity, deliveryDate: order.deliveryDate, site: order.site });
    } else {
      setSelectedOrder(null);
      setFormData({ mixType: '', quantity: '', deliveryDate: '', site: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => { setOpenDialog(false); setSelectedOrder(null); };
  const handleFormChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };

  const handleSubmitOrder = () => {
    if (!formData.mixType || !formData.quantity || !formData.deliveryDate || !formData.site) {
      setSnackbar({ open: true, message: 'Please fill in all fields', severity: 'error' }); return;
    }
    const newOrder = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      ...formData, status: 'processing', driver: 'Pending', truck: 'Pending', eta: 'N/A',
    };
    setOrders([newOrder, ...orders]);
    handleCloseDialog();
    setSnackbar({ open: true, message: 'Order placed successfully!', severity: 'success' });
  };

  const getStatusColor = (status) => ({
    processing: '#F39C12', dispatched: '#1565C0', 'on-the-way': '#FF6F00', delivered: '#2ECC71',
  }[status] || '#8B949E');

  const getStatusIndex = (status) => ({
    processing: 0, dispatched: 1, 'on-the-way': 2, delivered: 3,
  }[status] || 0);

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const statusCounts = {
    all: orders.length,
    processing: orders.filter(o => o.status === 'processing').length,
    dispatched: orders.filter(o => o.status === 'dispatched').length,
    'on-the-way': orders.filter(o => o.status === 'on-the-way').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Order Management</Typography>
            <Typography variant="body2" sx={{ color: '#8B949E' }}>Track, manage and create new orders</Typography>
          </Box>
          <Button
            variant="contained" color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ px: 3 }}
          >
            New Order
          </Button>
        </Box>

        {/* Status Filter Chips */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'All Orders' },
            { key: 'processing', label: 'Processing' },
            { key: 'dispatched', label: 'Dispatched' },
            { key: 'on-the-way', label: 'On the Way' },
            { key: 'delivered', label: 'Delivered' },
          ].map(f => (
            <Chip
              key={f.key}
              label={`${f.label} (${statusCounts[f.key]})`}
              onClick={() => setFilter(f.key)}
              sx={{
                background: filter === f.key ? 'rgba(255,111,0,0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${filter === f.key ? 'rgba(255,111,0,0.5)' : 'rgba(255,255,255,0.08)'}`,
                color: filter === f.key ? '#FF9800' : '#8B949E',
                fontWeight: 600, cursor: 'pointer',
                '&:hover': { background: 'rgba(255,111,0,0.12)' },
              }}
            />
          ))}
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'Active Orders', value: statusCounts['processing'] + statusCounts['dispatched'] + statusCounts['on-the-way'], color: '#FF6F00', icon: <Inventory /> },
            { label: 'In Transit', value: statusCounts['on-the-way'], color: '#1565C0', icon: <LocalShipping /> },
            { label: 'Delivered Today', value: statusCounts['delivered'], color: '#2ECC71', icon: <CheckCircle /> },
            { label: 'Total Volume', value: `${orders.reduce((s, o) => s + Number(o.quantity), 0)} m³`, color: '#F39C12', icon: <Schedule /> },
          ].map((stat, i) => (
            <Grid item xs={6} sm={3} key={stat.label}>
              <Card sx={{
                ...glassCard, borderLeft: `3px solid ${stat.color}`,
                transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-3px)' },
              }}>
                <CardContent sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#8B949E', fontWeight: 600 }}>{stat.label}</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: stat.color }}>{stat.value}</Typography>
                    </Box>
                    <Box sx={{
                      width: 40, height: 40, borderRadius: 2,
                      background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: stat.color,
                    }}>{stat.icon}</Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Orders Table */}
        <TableContainer component={Paper} sx={{ ...glassCard }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Mix Type</TableCell>
                <TableCell align="right">Qty (m³)</TableCell>
                <TableCell>Site Location</TableCell>
                <TableCell>Driver / Truck</TableCell>
                <TableCell>ETA</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map(order => (
                <TableRow key={order.id} sx={{ transition: 'background 0.2s', '&:hover': { background: 'rgba(255,111,0,0.04)' } }}>
                  <TableCell sx={{ fontWeight: 700, color: '#FF6F00' }}>{order.id}</TableCell>
                  <TableCell>
                    <Chip label={order.mixType} size="small" sx={{
                      background: order.mixType.includes('Asphalt') ? 'rgba(243,156,18,0.15)' : 'rgba(21,101,192,0.15)',
                      color: order.mixType.includes('Asphalt') ? '#F39C12' : '#5E92F3',
                      fontWeight: 600,
                    }} />
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>{order.quantity}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOn sx={{ fontSize: 14, color: '#8B949E' }} />
                      <Typography variant="body2" sx={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.site}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{order.driver}</Typography>
                    <Typography variant="caption" sx={{ color: '#8B949E' }}>{order.truck}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: order.eta === 'Completed' ? '#2ECC71' : '#FF9800' }}>
                      {order.eta}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status.replace(/-/g, ' ').toUpperCase()}
                      size="small"
                      sx={{
                        background: `${getStatusColor(order.status)}20`,
                        color: getStatusColor(order.status),
                        border: `1px solid ${getStatusColor(order.status)}40`,
                        fontWeight: 700, fontSize: '0.65rem',
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleOpenDialog(order)}
                      sx={{ color: '#FF6F00', '&:hover': { background: 'rgba(255,111,0,0.1)' } }}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Order Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth
          PaperProps={{ sx: { borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)' } }}>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {selectedOrder ? `Order ${selectedOrder.id}` : 'Create New Order'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#8B949E' }}>
                {selectedOrder ? 'Track and manage this order' : 'Fill in the delivery details below'}
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDialog} size="small"><Close /></IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
              {/* Tracking Stepper */}
              {selectedOrder && (
                <Paper sx={{
                  p: 3, mb: 1, borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(255,111,0,0.05) 0%, rgba(21,101,192,0.05) 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <Typography variant="overline" sx={{ color: '#8B949E', fontWeight: 700, letterSpacing: '0.1em' }}>
                    Order Timeline
                  </Typography>
                  <Stepper activeStep={getStatusIndex(selectedOrder.status)} alternativeLabel sx={{ mt: 2 }}>
                    {orderSteps.map(step => (
                      <Step key={step.label}>
                        <StepLabel StepIconComponent={() => (
                          <Box sx={{
                            width: 32, height: 32, borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(255,111,0,0.15)', color: '#FF6F00',
                          }}>{step.icon}</Box>
                        )}>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>{step.label}</Typography>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                  {selectedOrder.status !== 'delivered' && (
                    <Box sx={{ mt: 2, p: 1.5, background: 'rgba(21,101,192,0.1)', borderRadius: 1.5, textAlign: 'center' }}>
                      <Typography variant="body2">
                        <strong>ETA:</strong> {selectedOrder.eta} · <strong>Driver:</strong> {selectedOrder.driver}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              )}

              {/* Order Form */}
              <TextField label="Mix Type" name="mixType" value={formData.mixType} onChange={handleFormChange} select fullWidth disabled={!!selectedOrder}>
                {mixTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
              </TextField>
              <TextField label="Quantity (m³)" name="quantity" type="number" value={formData.quantity} onChange={handleFormChange} fullWidth disabled={!!selectedOrder} inputProps={{ min: 1 }} />
              <TextField label="Delivery Date" name="deliveryDate" type="date" value={formData.deliveryDate} onChange={handleFormChange} fullWidth disabled={!!selectedOrder} InputLabelProps={{ shrink: true }} />
              <TextField label="Site Location" name="site" value={formData.site} onChange={handleFormChange} fullWidth disabled={!!selectedOrder} multiline rows={2} />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button onClick={handleCloseDialog} sx={{ color: '#8B949E' }}>Cancel</Button>
            {!selectedOrder && (
              <Button onClick={handleSubmitOrder} variant="contained" color="primary" sx={{ px: 4 }}>
                Place Order
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
