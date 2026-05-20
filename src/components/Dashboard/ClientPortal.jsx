import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ShoppingCart as ShoppingCartIcon, LocalShipping as LocalShippingIcon, Assignment as AssignmentIcon, Receipt as ReceiptIcon, ExpandMore as ExpandMoreIcon, Map as MapIcon, Phone as PhoneIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { trackingService } from '../../services/RealtimeTrackingService';

// Mock data
const orderStatusData = [
  { name: 'Pending', value: 5, fill: '#FFB300' },
  { name: 'In Transit', value: 8, fill: '#2E7D32' },
  { name: 'Delivered', value: 24, fill: '#66BB6A' },
  { name: 'Cancelled', value: 1, fill: '#EF5350' },
];

const orderHistory = [
  { month: 'Jan', orders: 12, amount: 45000 },
  { month: 'Feb', orders: 15, amount: 52000 },
  { month: 'Mar', orders: 18, amount: 58000 },
  { month: 'Apr', orders: 22, amount: 65000 },
  { month: 'May', orders: 19, amount: 61000 },
];

const ClientPortal = () => {
  const [vehicles, setVehicles] = useState([]);
  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      date: '2024-05-13',
      product: 'Concrete M20',
      quantity: 50,
      amount: 25000,
      status: 'delivered',
      driver: 'John Smith',
      phone: '+1-555-0101',
      eta: 'Delivered',
    },
    {
      id: 'ORD002',
      date: '2024-05-12',
      product: 'Asphalt Grade 1',
      quantity: 100,
      amount: 48000,
      status: 'delivered',
      driver: 'Maria Garcia',
      phone: '+1-555-0102',
      eta: 'Delivered',
    },
    {
      id: 'ORD003',
      date: '2024-05-11',
      product: 'Concrete M25',
      quantity: 75,
      amount: 35000,
      status: 'in-transit',
      driver: 'Robert Chen',
      phone: '+1-555-0103',
      eta: '2 hours',
    },
    {
      id: 'ORD004',
      date: '2024-05-10',
      product: 'Concrete M30',
      quantity: 60,
      amount: 32000,
      status: 'pending',
      driver: 'Pending Assignment',
      phone: 'N/A',
      eta: '6-8 hours',
    },
  ]);
  const [openNewOrder, setOpenNewOrder] = useState(false);
  const [newOrder, setNewOrder] = useState({
    product: 'Concrete M20',
    quantity: '',
    deliveryDate: '',
  });

  useEffect(() => {
    trackingService.initialize(false);
    trackingService.subscribe(setVehicles);

    return () => {
      trackingService.disconnect();
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const handlePlaceOrder = () => {
    if (newOrder.quantity && newOrder.deliveryDate) {
      const orderAmount = parseInt(newOrder.quantity) * (newOrder.product === 'Concrete M20' ? 500 : 480);
      const newOrderObj = {
        id: `ORD${String(orders.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        product: newOrder.product,
        quantity: newOrder.quantity,
        amount: orderAmount,
        status: 'pending',
        driver: 'Pending Assignment',
        phone: 'N/A',
        eta: '6-8 hours',
      };
      setOrders([newOrderObj, ...orders]);
      setOpenNewOrder(false);
      setNewOrder({ product: 'Concrete M20', quantity: '', deliveryDate: '' });
    }
  };

  const stats = [
    {
      label: 'Total Orders',
      value: orders.length,
      icon: ShoppingCartIcon,
      color: '#2E7D32',
    },
    {
      label: 'Active Deliveries',
      value: orders.filter(o => o.status === 'in-transit').length,
      icon: LocalShippingIcon,
      color: '#1B5E20',
    },
    {
      label: 'Delivered',
      value: orders.filter(o => o.status === 'delivered').length,
      icon: CheckCircleIcon,
      color: '#558B2F',
    },
    {
      label: 'Total Spent',
      value: `₹${orders.reduce((sum, o) => sum + o.amount, 0) / 100000}L`,
      icon: ReceiptIcon,
      color: '#33691E',
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ width: '100%' }}
    >
      <Box sx={{ p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}>
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 1,
              color: '#1B5E20',
            }}
          >
            Client Portal
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
            Manage your orders and track deliveries in real-time.
          </Typography>
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={itemVariants}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    whileHover={{ translateY: -8 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Card
                      sx={{
                        p: 2,
                        background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                        border: `2px solid ${stat.color}20`,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: `0 10px 30px ${stat.color}30`,
                          transform: 'translateY(-4px)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            {stat.label}
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 800,
                              color: stat.color,
                              mt: 0.5,
                            }}
                          >
                            {stat.value}
                          </Typography>
                        </Box>
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            backgroundColor: stat.color,
                            color: '#fff',
                          }}
                        >
                          <Icon />
                        </Avatar>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </motion.div>

        {/* Action Button */}
        <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingCartIcon />}
            onClick={() => setOpenNewOrder(true)}
            sx={{
              background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
              color: '#fff',
              fontWeight: 700,
              py: 1.5,
              px: 3,
              borderRadius: 2,
              boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 28px rgba(46, 125, 50, 0.6)',
              },
            }}
          >
            Place New Order
          </Button>
        </motion.div>

        {/* Charts */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Order Status Pie Chart */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1B5E20' }}>
                  📊 Order Status Overview
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </Grid>

          {/* Order History */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1B5E20' }}>
                  📈 Order History
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={orderHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(46, 125, 50, 0.1)" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #2E7D32',
                        borderRadius: '8px',
                        color: '#333',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#2E7D32"
                      strokeWidth={3}
                      dot={{ fill: '#2E7D32' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#66BB6A"
                      strokeWidth={2}
                      dot={{ fill: '#66BB6A' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Active Deliveries */}
        <motion.div variants={itemVariants}>
          <Card sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1B5E20' }}>
              🚚 Active Deliveries
            </Typography>

            {orders
              .filter(o => o.status === 'in-transit')
              .map(order => (
                <Accordion key={order.id}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <Chip label={order.id} color="primary" variant="outlined" />
                      <Typography sx={{ flex: 1 }}>{order.product}</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        ETA: {order.eta}
                      </Typography>
                      <Chip label="In Transit" color="info" size="small" />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: '#F1F8E9', pt: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Driver Information
                          </Typography>
                          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ backgroundColor: '#2E7D32' }}>
                              {order.driver.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {order.driver}
                              </Typography>
                              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <PhoneIcon fontSize="small" /> {order.phone}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Button
                          variant="contained"
                          startIcon={<MapIcon />}
                          fullWidth
                          sx={{
                            background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
                            color: '#fff',
                          }}
                        >
                          View Live Location
                        </Button>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
          </Card>
        </motion.div>

        {/* Order History */}
        <motion.div variants={itemVariants}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1B5E20' }}>
              📋 Order History
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#E8F5E9' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#1B5E20' }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1B5E20' }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1B5E20' }}>Quantity</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1B5E20' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1B5E20' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1B5E20' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{order.id}</TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>₹{order.amount}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          size="small"
                          color={
                            order.status === 'delivered'
                              ? 'success'
                              : order.status === 'in-transit'
                              ? 'info'
                              : 'warning'
                          }
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="text">
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </motion.div>
      </Box>

      {/* New Order Dialog */}
      <Dialog open={openNewOrder} onClose={() => setOpenNewOrder(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Place New Order</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              label="Product Type"
              value={newOrder.product}
              onChange={(e) => setNewOrder({ ...newOrder, product: e.target.value })}
              fullWidth
              SelectProps={{
                native: true,
              }}
            >
              <option value="Concrete M20">Concrete M20</option>
              <option value="Concrete M25">Concrete M25</option>
              <option value="Concrete M30">Concrete M30</option>
              <option value="Asphalt Grade 1">Asphalt Grade 1</option>
              <option value="Asphalt Grade 2">Asphalt Grade 2</option>
            </TextField>
            <TextField
              label="Quantity (tons)"
              type="number"
              value={newOrder.quantity}
              onChange={(e) => setNewOrder({ ...newOrder, quantity: e.target.value })}
              fullWidth
            />
            <TextField
              label="Delivery Date"
              type="date"
              value={newOrder.deliveryDate}
              onChange={(e) => setNewOrder({ ...newOrder, deliveryDate: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Estimated Amount: ₹{newOrder.quantity ? parseInt(newOrder.quantity) * 500 : 0}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewOrder(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePlaceOrder} sx={{ background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)' }}>
            Place Order
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default ClientPortal;
