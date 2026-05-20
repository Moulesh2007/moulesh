npm# R&S Co Tracking - Quick Start Guide

## 🎯 Current Status

✅ **Application is running** at: **http://localhost:3001/**

---

## 🔑 Demo Login Credentials

Choose from these roles to test different features:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Admin | admin@rsco.com | password | Full system control |
| Manager | manager@rsco.com | password | Orders, Fleet, Inventory |
| Client | client@rsco.com | password | Order placement & tracking |
| Driver | driver@rsco.com | password | Assignment & status updates |

---

## 📍 How to Navigate

### 1. **Login**
- Enter any demo email and password
- Click "Sign In"

### 2. **Select Role**
- Choose your user role (Admin/Manager/Client/Driver)
- Redirects to Dashboard

### 3. **Bottom Navigation**
Use the bottom navigation bar to access:
- 🏠 **Home** → Main dashboard with statistics
- 🛒 **Orders** → Create & track concrete/asphalt orders
- 🚚 **Fleet** → Real-time vehicle tracking
- 📦 **Inventory** → Stock levels & quality reports
- 📊 **Reports** → Sales reports & billing

### 4. **User Menu**
- Click your avatar (top right of bottom nav)
- View profile or logout

---

## 🎮 Try These Features

### Orders Section
1. Click "New Order" button
2. Select mix type (M20, M25, Asphalt Grade 1, etc.)
3. Enter quantity and delivery date
4. Submit order
5. View order in the timeline

### Fleet Tracking
1. View all vehicles with real-time status
2. Click "View" on any vehicle for driver details
3. See vehicle load and ETA information
4. Call driver directly (in production)

### Plant Status
1. Check RMC Plant and Hotmix Plant status
2. View capacity utilization percentages
3. See daily order count
4. Monitor fleet utilization

### Inventory
1. Check cement, aggregates, bitumen levels
2. See low-stock warnings
3. View quality test reports
4. Browse mix design library

### Reports & Billing
1. View sales reports by client
2. Check pending and paid invoices
3. Download reports as PDF/Excel
4. Monitor collection rates

---

## 🔧 Development Commands

```bash
# Start dev server (already running on port 3001)
node node_modules/vite/bin/vite.js --host

# Build for production
npm run build

# Install dependencies
npm install
```

---

## 📱 Responsive Features

- Mobile: Full-width single column layout
- Tablet: 2-column grid
- Desktop: 3-4 column grid

Test by resizing your browser window!

---

## 🛠️ Customization Examples

### Change App Colors
Edit `main.jsx` theme object:
```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#YOUR_COLOR' },
    secondary: { main: '#YOUR_COLOR' },
  },
});
```

### Add New Section
1. Create component folder: `src/components/NewSection/`
2. Add component: `NewSection.jsx`
3. Import in `App.jsx`
4. Add route for `/new-section`
5. Add button to `BottomNav.jsx`

### Connect Real Data
Replace mock data in components:
```jsx
// Instead of:
const [orders, setOrders] = useState(mockOrders);

// Use:
useEffect(() => {
  fetch('/api/orders')
    .then(res => res.json())
    .then(setOrders);
}, []);
```

---

## 🐛 Known Limitations (Mock Features)

These features show live data but are simulated:
- ❌ GPS tracking (needs Google Maps API key)
- ❌ Real authentication (needs backend)
- ❌ Database persistence (data resets on refresh)
- ❌ Real-time WebSocket updates
- ❌ PDF report generation
- ❌ Email notifications

**To enable these**: Connect to your backend APIs in each component.

---

## ✅ What's Ready

- ✅ All UI screens designed
- ✅ Responsive layouts
- ✅ Navigation system
- ✅ Form validation
- ✅ State management structure
- ✅ Mock data for all features
- ✅ Role-based access control
- ✅ Error handling UI

---

## 📢 Next Steps

1. **Backend Integration**
   - Replace fetch calls with your API endpoints
   - Update AuthContext with real authentication

2. **Database Setup**
   - Create database schema
   - Set up backend API endpoints
   - Connect frontend to backend

3. **Third-Party Integrations**
   - Google Maps for GPS
   - Stripe/Razorpay for payments
   - SendGrid for emails
   - Firebase for push notifications

4. **Testing**
   - Add Jest tests
   - Implement E2E testing with Cypress
   - Performance testing

5. **Deployment**
   - Build optimized production bundle
   - Deploy to Netlify/Vercel/AWS

---

## 💬 Need Help?

Refer to:
- `FRONTEND_DOCS.md` - Detailed architecture
- Component files - Inline JSDoc comments
- React docs: https://react.dev
- Material-UI docs: https://mui.com

---

**Happy Building! 🚀**
