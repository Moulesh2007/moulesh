# "Failed to Fetch" Error - Diagnosis and Fixes

## Most Likely Causes

Based on your current setup, here are the most likely causes of the "Failed to fetch" error:

### 1. **API Endpoint URL Configuration Issue** (MOST LIKELY)
- **Problem**: Frontend uses `/api` as base URL, but backend routes are mounted at `/api/auth`, `/api/orders`, etc.
- **Result**: Full URL becomes `/api/api/auth/login` (double `/api`)
- **Fix**: Change frontend API URL to empty string `''` or remove `/api` prefix from backend routes

### 2. **Vercel Serverless Function Handler Issue**
- **Problem**: The wrapper function in `api/index.js` might not be handling Express app correctly
- **Result**: API requests fail to reach the backend
- **Fix**: Use proper Vercel serverless function handler

### 3. **CORS Misconfiguration**
- **Problem**: Default CORS settings might not work with Vercel's serverless environment
- **Result**: Browser blocks requests due to CORS policy
- **Fix**: Configure CORS with specific origins and credentials

### 4. **Backend Not Responding**
- **Problem**: Prisma client or database connection issues
- **Result**: API returns 500 errors or times out
- **Fix**: Check database connection and Prisma client generation

---

## Step-by-Step Debugging Checklist

### Step 1: Check Browser DevTools Network Tab
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Click "Sign In" on the login page
4. Look for the login request (should be red if failed)
5. Check:
   - **Request URL**: Is it correct? (should be `/api/auth/login`)
   - **Status Code**: 404, 500, or network error?
   - **Response**: Any error message?
   - **Request Headers**: Is Content-Type set to application/json?
   - **Request Payload**: Is email and password included?

### Step 2: Check Console Tab
1. Go to Console tab in DevTools
2. Look for JavaScript errors
3. Check for CORS errors (red text)
4. Look for network errors

### Step 3: Test API Directly
1. Open a new tab
2. Try accessing: `https://rs-co-tracking.vercel.app/api/health`
3. If this fails, the API is not working at all
4. If this works, the API is running but login route has issues

### Step 4: Check Vercel Logs
1. Run: `vercel logs --environment production`
2. Look for errors in the API function
3. Check for database connection errors
4. Look for Prisma client errors

### Step 5: Verify Environment Variables
1. Check Vercel dashboard for environment variables
2. Ensure `DATABASE_URL` is set correctly
3. Ensure `JWT_SECRET` is set
4. Ensure `VITE_MAPBOX_ACCESS_TOKEN` is set

---

## Exact Fixes

### Frontend Fix #1: Correct API URL

**File**: `src/services/api.js`

**Current (WRONG)**:
```javascript
export const API_URL = import.meta.env.VITE_API_URL || '/api';
```

**Fixed (CORRECT)**:
```javascript
export const API_URL = import.meta.env.VITE_API_URL || '';
```

**Why**: The backend routes are already mounted at `/api/auth`, `/api/orders`, etc. Adding `/api` as base URL creates double `/api` in the URL.

### Frontend Fix #2: Better Error Handling

**File**: `src/contexts/AuthContext.jsx`

**Current error handling**:
```javascript
const login = async (email, password) => {
  setLoading(true);
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data.message || 'Login failed.');
    return _applyAuth(data);
  } finally {
    setLoading(false);
  }
};
```

**Improved error handling**:
```javascript
const login = async (email, password) => {
  setLoading(true);
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Login failed (${res.status})`);
    }
    
    const data = await res.json();
    return _applyAuth(data);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  } finally {
    setLoading(false);
  }
};
```

### Backend Fix #1: Improved CORS Configuration

**File**: `api/_server/index-prisma.js`

**Current CORS**:
```javascript
app.use(cors());
```

**Improved CORS**:
```javascript
app.use(cors({
  origin: ['https://rs-co-tracking.vercel.app', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Backend Fix #2: Better Vercel Handler

**File**: `api/index.js`

**Current handler**:
```javascript
import app from './_server/index-prisma.js';

export default function handler(req, res) {
  app(req, res);
}
```

**Improved handler**:
```javascript
import app from './_server/index-prisma.js';

export default app;
```

**Why**: Vercel can handle Express apps directly without a wrapper function.

---

## Corrected Fetch/Axios Login Example

### Using Fetch (Improved)

```javascript
const login = async (email, password) => {
  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Login failed (${response.status})`);
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
```

### Using Axios (Improved)

```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '', // Empty since routes already include /api
  headers: {
    'Content-Type': 'application/json',
  },
});

const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Login failed';
    console.error('Login error:', error);
    throw new Error(message);
  }
};
```

---

## Backend CORS and Login Route Example

### Complete Backend Setup

**File**: `api/_server/index-prisma.js`

```javascript
import express from 'express';
import cors from 'cors';
import prisma from './lib/prisma.js';
import authRoutes from './routes/auth-prisma.js';

const app = express();

// Improved CORS configuration
app.use(cors({
  origin: [
    'https://rs-co-tracking.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', database: 'connected' });
});

// API Routes (mounted at /api)
app.use('/api/auth', authRoutes);

export default app;
```

**File**: `api/_server/routes/auth-prisma.js`

```javascript
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'rsco_secret_2024';

// Login route with better error handling
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if user has password (Google auth users don't)
    if (!user.password) {
      return res.status(401).json({ message: 'Please use Google login' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return success response
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
```

---

## User-Friendly Error Messages

### Frontend Error Display

**File**: `src/components/Auth/LoginPage.jsx`

```javascript
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      // Redirect on success
    } catch (err) {
      // User-friendly error messages
      const errorMessages = {
        'Failed to fetch': 'Unable to connect to server. Please check your internet connection.',
        'Invalid credentials': 'Incorrect email or password. Please try again.',
        'Please use Google login': 'This account uses Google authentication. Please sign in with Google.',
        'Login failed (404)': 'Server not responding. Please try again later.',
        'Login failed (500)': 'Server error. Please try again later.',
        'Network Error': 'Network connection failed. Please check your internet.',
      };
      
      const userMessage = errorMessages[err.message] || err.message || 'Login failed. Please try again.';
      setError(userMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ color: 'red', padding: '10px', backgroundColor: '#fee', marginBottom: '10px' }}>
          {error}
        </div>
      )}
      {/* Login form fields */}
    </form>
  );
};
```

---

## What to Inspect in Browser DevTools Network Tab

### 1. Request URL
- **Check**: Is the URL correct?
- **Expected**: `https://rs-co-tracking.vercel.app/api/auth/login`
- **Wrong**: `https://rs-co-tracking.vercel.app/api/api/auth/login` (double /api)

### 2. Request Method
- **Check**: Is it POST?
- **Expected**: POST
- **Wrong**: GET (would return 404)

### 3. Status Code
- **200**: Success
- **404**: Route not found (URL is wrong)
- **500**: Server error (check backend logs)
- **CORS error**: Red text in console (CORS misconfiguration)
- **Failed (no status)**: Network error (server not responding)

### 4. Request Headers
- **Content-Type**: Should be `application/json`
- **Authorization**: Not needed for login
- **Origin**: Should be your domain

### 5. Request Payload
- **Check**: Is email and password included?
- **Format**: JSON with email and password fields

### 6. Response
- **Check**: Is there an error message?
- **Format**: Should be JSON with message field

### 7. Timing
- **Check**: Is the request timing out?
- **Expected**: Should complete in < 5 seconds
- **Issue**: If > 30 seconds, server is not responding

---

## Quick Fix Summary

### Immediate Actions:

1. **Update frontend API URL** in `src/services/api.js`:
   ```javascript
   export const API_URL = import.meta.env.VITE_API_URL || '';
   ```

2. **Update API handler** in `api/index.js`:
   ```javascript
   import app from './_server/index-prisma.js';
   export default app;
   ```

3. **Improve CORS** in `api/_server/index-prisma.js`:
   ```javascript
   app.use(cors({
     origin: ['https://rs-co-tracking.vercel.app', 'http://localhost:5173'],
     credentials: true
   }));
   ```

4. **Commit and deploy**:
   ```bash
   git add .
   git commit -m "Fix API endpoint URL and CORS configuration"
   git push
   vercel --prod
   ```

5. **Test the login** at https://rs-co-tracking.vercel.app

---

## Testing the Fix

After applying the fixes:

1. Clear browser cache
2. Open https://rs-co-tracking.vercel.app
3. Open DevTools Network tab
4. Try to login with:
   - Email: mouleshmr11@gmail.com
   - Password: Admin@1234
5. Check Network tab for the login request
6. Verify status code is 200
7. Verify response contains token and user data

If still failing, check Vercel logs for backend errors.
