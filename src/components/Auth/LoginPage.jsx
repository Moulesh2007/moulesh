import React, { useState, useMemo } from 'react';
import {
  Box, TextField, Button, Typography, Alert, CircularProgress,
  InputAdornment, IconButton, LinearProgress, Chip, Divider, Tabs, Tab,
} from '@mui/material';
import {
  Visibility, VisibilityOff, Email, Lock, Person,
  CheckCircle, Cancel, ArrowForward,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { API_URL } from '../../services/api.js';

/** Looser than browser type=email; avoids Firefox "string did not match the expected pattern". */
const isValidEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/* ── Password strength helpers ───────────────────────────────────────────── */
const RULES = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter',  test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter',  test: (p) => /[a-z]/.test(p) },
  { label: 'One number',            test: (p) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const strengthInfo = (score) => {
  if (score === 0) return { label: '', color: 'transparent', val: 0 };
  if (score <= 2)  return { label: 'Weak',   color: '#f44336', val: 33 };
  if (score <= 4)  return { label: 'Fair',   color: '#FF9800', val: 66 };
  return           { label: 'Strong', color: '#4CAF50', val: 100 };
};

/* ── Shared input sx ─────────────────────────────────────────────────────── */
const inputSx = {
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 2,
    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(255,111,0,0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#FF6F00' },
  },
  '& .MuiInputLabel-root': { color: '#8B949E' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#FF6F00' },
  '& input': { color: '#E6EDF3' },
};

/* ════════════════════════════════════════════════════════════════════════════
   REGISTER FORM
═══════════════════════════════════════════════════════════════════════════ */
function RegisterForm({ onSuccess }) {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const passScore = useMemo(() => RULES.filter(r => r.test(form.password)).length, [form.password]);
  const strength  = strengthInfo(passScore);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    const email = form.email.trim();
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setError('Only Gmail addresses (@gmail.com) are accepted.');
      return;
    }

    try {
      const data = await register(form.name, email, form.password, form.confirm);
      setSuccess(`Welcome, ${data.name}! Account created successfully.`);
      setTimeout(() => onSuccess(data), 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {error   && <Alert severity="error"   onClose={() => setError('')}   sx={{ borderRadius: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ borderRadius: 2 }}>{success}</Alert>}

      {/* Full Name */}
      <TextField
        label="Full Name" name="name" value={form.name}
        onChange={handleChange} required fullWidth sx={inputSx}
        InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: '#8B949E' }} /></InputAdornment> }}
      />

      {/* Gmail */}
      <TextField
        label="Gmail Address" name="email" type="text" inputMode="email" autoComplete="email"
        value={form.email}
        onChange={handleChange} required fullWidth sx={inputSx}
        helperText="Must be a @gmail.com address"
        FormHelperTextProps={{ sx: { color: '#8B949E' } }}
        InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: '#8B949E' }} /></InputAdornment> }}
      />

      {/* Password */}
      <TextField
        label="Password" name="password" type={showPw ? 'text' : 'password'}
        value={form.password} onChange={handleChange} required fullWidth sx={inputSx}
        InputProps={{
          startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#8B949E' }} /></InputAdornment>,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPw(v => !v)} sx={{ color: '#8B949E' }}>
                {showPw ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Strength bar */}
      {form.password && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: '#8B949E' }}>Password strength</Typography>
            <Typography variant="caption" sx={{ color: strength.color, fontWeight: 700 }}>{strength.label}</Typography>
          </Box>
          <LinearProgress
            variant="determinate" value={strength.val}
            sx={{
              borderRadius: 2, height: 6, background: 'rgba(255,255,255,0.08)',
              '& .MuiLinearProgress-bar': { background: strength.color, borderRadius: 2 },
            }}
          />
          {/* Rules checklist */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
            {RULES.map(r => (
              <Chip
                key={r.label} label={r.label} size="small"
                icon={r.test(form.password) ? <CheckCircle sx={{ fontSize: 14 }} /> : <Cancel sx={{ fontSize: 14 }} />}
                sx={{
                  fontSize: '0.65rem',
                  bgcolor: r.test(form.password) ? 'rgba(76,175,80,0.15)' : 'rgba(255,255,255,0.05)',
                  color: r.test(form.password) ? '#4CAF50' : '#8B949E',
                  border: `1px solid ${r.test(form.password) ? 'rgba(76,175,80,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  '& .MuiChip-icon': { color: 'inherit' },
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Confirm Password */}
      <TextField
        label="Confirm Password" name="confirm" type={showConfirm ? 'text' : 'password'}
        value={form.confirm} onChange={handleChange} required fullWidth sx={inputSx}
        error={form.confirm.length > 0 && form.confirm !== form.password}
        helperText={form.confirm.length > 0 && form.confirm !== form.password ? 'Passwords do not match' : ''}
        InputProps={{
          startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#8B949E' }} /></InputAdornment>,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowConfirm(v => !v)} sx={{ color: '#8B949E' }}>
                {showConfirm ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit" variant="contained" fullWidth disabled={loading || !!success}
        endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ArrowForward />}
        sx={{
          mt: 1, py: 1.5, borderRadius: 2, fontWeight: 700, fontSize: '1rem',
          background: 'linear-gradient(135deg, #FF6F00 0%, #FF9800 100%)',
          boxShadow: '0 4px 20px rgba(255,111,0,0.35)',
          '&:hover': { background: 'linear-gradient(135deg, #E65100 0%, #FF6F00 100%)', transform: 'translateY(-1px)' },
          transition: 'all 0.2s',
        }}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </Box>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   LOGIN FORM
═══════════════════════════════════════════════════════════════════════════ */
function LoginForm({ onSuccess }) {
  const { login, googleLogin, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const email = form.email.trim();
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    try {
      const data = await login(email, form.password);
      onSuccess(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const data = await googleLogin(credentialResponse.credential);
      onSuccess(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ borderRadius: 2 }}>{error}</Alert>}

      <TextField
        label="Gmail Address" name="email" type="text" inputMode="email" autoComplete="email"
        value={form.email}
        onChange={handleChange} required fullWidth sx={inputSx}
        InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: '#8B949E' }} /></InputAdornment> }}
      />

      <TextField
        label="Password" name="password" type={showPw ? 'text' : 'password'}
        value={form.password} onChange={handleChange} required fullWidth sx={inputSx}
        InputProps={{
          startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#8B949E' }} /></InputAdornment>,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPw(v => !v)} sx={{ color: '#8B949E' }}>
                {showPw ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Quick fill for admin */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          type="button"
          size="small" variant="outlined"
          onClick={() => setForm({ email: 'mouleshmr11@gmail.com', password: 'Admin@1234' })}
          sx={{ flex: 1, fontSize: '0.7rem', color: '#FF9800', borderColor: 'rgba(255,152,0,0.4)',
            '&:hover': { borderColor: '#FF9800', bgcolor: 'rgba(255,152,0,0.08)' } }}
        >
          Fill Admin
        </Button>
      </Box>

      <Button
        type="submit" variant="contained" fullWidth disabled={loading}
        endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ArrowForward />}
        sx={{
          py: 1.5, borderRadius: 2, fontWeight: 700, fontSize: '1rem',
          background: 'linear-gradient(135deg, #FF6F00 0%, #FF9800 100%)',
          boxShadow: '0 4px 20px rgba(255,111,0,0.35)',
          '&:hover': { background: 'linear-gradient(135deg, #E65100 0%, #FF6F00 100%)', transform: 'translateY(-1px)' },
          transition: 'all 0.2s',
        }}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>

      <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }}>OR</Divider>
      
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError('Google Login Failed')}
          theme="filled_black"
          shape="circle"
        />
      </Box>
    </Box>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN LOGIN PAGE
═══════════════════════════════════════════════════════════════════════════ */
export default function LoginPage() {
  const [tab, setTab] = useState(0); // 0=login, 1=register
  const navigate = useNavigate();

  const handleSuccess = async (data) => {
    if (data.isNewUser || !data.role) {
      navigate('/role-selection');
    } else {
      const token = localStorage.getItem('token');
      let route = '/dashboard';
      try {
        const res = await fetch(`${API_URL}/user/dashboard`, { headers: { Authorization: `Bearer ${token}` } });
        const text = await res.text();
        if (text) {
          const json = JSON.parse(text);
          if (json.route) route = json.route;
        }
      } catch {
        /* ignore parse / network; use default route */
      }
      navigate(route);
    }
  };

  const stats = [
    { icon: '🏭', label: 'RMC Plant',    val: '120 m³/hr' },
    { icon: '🔥', label: 'Hotmix Plant', val: '80 TPH' },
    { icon: '🚛', label: 'Fleet Active', val: '24 Vehicles' },
  ];

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #0D1117 0%, #161B22 50%, #1C2430 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Animated blobs */}
      {[
        { top: '-20%', left: '-10%', size: 500, color: 'rgba(255,111,0,0.1)', dur: '6s' },
        { bottom: '-20%', right: '-10%', size: 600, color: 'rgba(21,101,192,0.1)', dur: '8s', rev: true },
      ].map((b, i) => (
        <Box key={i} sx={{
          position: 'absolute', ...b,
          width: b.size, height: b.size, borderRadius: '50%',
          background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
          animation: `pulse${i} ${b.dur} ease-in-out infinite ${b.rev ? 'reverse' : ''}`,
          [`@keyframes pulse${i}`]: {
            '0%,100%': { transform: 'scale(1)', opacity: 0.7 },
            '50%': { transform: 'scale(1.2)', opacity: 1 },
          },
        }} />
      ))}

      {/* Left branding — desktop only */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', p: 6, position: 'relative' }}>
        <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
          <Box sx={{ width: 200, height: 200, mx: 'auto', mb: 3,
            filter: 'drop-shadow(0 15px 25px rgba(255,111,0,0.25))' }}>
            <img src="/logo.png" alt="RS&CO" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#E6EDF3', mb: 0.5 }}>RS&CO</Typography>
          <Typography variant="h5" sx={{ color: '#FF6F00', fontWeight: 600, mb: 2 }}>Tracking System</Typography>
          <Typography variant="body1" sx={{ color: '#8B949E', lineHeight: 1.8 }}>
            Enterprise-grade platform for RMC & Hotmix plant management,
            fleet tracking, and order lifecycle control.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 5, justifyContent: 'center', flexWrap: 'wrap' }}>
            {stats.map(s => (
              <Box key={s.label} sx={{
                p: 2, borderRadius: 2, textAlign: 'center', minWidth: 100,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <Typography fontSize={22}>{s.icon}</Typography>
                <Typography variant="caption" sx={{ color: '#8B949E', display: 'block' }}>{s.label}</Typography>
                <Typography variant="body2" sx={{ color: '#FF6F00', fontWeight: 700 }}>{s.val}</Typography>
              </Box>
            ))}
          </Box>

          {/* Proprietor Details */}
          <Box sx={{ 
            mt: 6, p: 3, borderRadius: 3, 
            background: 'linear-gradient(135deg, rgba(255,111,0,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,111,0,0.2)', textAlign: 'left'
          }}>
            <Typography variant="overline" sx={{ color: '#FF6F00', fontWeight: 800, letterSpacing: 1.5 }}>Contact Proprietor</Typography>
            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#E6EDF3' }}>
                <strong style={{ color: '#8B949E' }}>Name:</strong> [Proprietor Name]
              </Typography>
              <Typography variant="body2" sx={{ color: '#E6EDF3' }}>
                <strong style={{ color: '#8B949E' }}>Email:</strong> [proprietor@email.com]
              </Typography>
              <Typography variant="body2" sx={{ color: '#E6EDF3' }}>
                <strong style={{ color: '#8B949E' }}>Phone:</strong> [+91-9876543210]
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right panel */}
      <Box sx={{ flex: { xs: 1, md: '0 0 480px' }, display: 'flex',
        alignItems: 'center', justifyContent: 'center', p: { xs: 2, sm: 3 }, position: 'relative' }}>
        <Box sx={{
          width: '100%', maxWidth: 440,
          background: 'rgba(22,27,34,0.92)', backdropFilter: 'blur(20px)',
          borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)',
          p: { xs: 3, sm: 4.5 }, boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        }}>
          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ width: 52, height: 52 }}>
              <img src="/logo.png" alt="RS&CO" style={{ width: '100%', objectFit: 'contain' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1 }}>RS&CO</Typography>
              <Typography variant="caption" sx={{ color: '#8B949E' }}>Tracking System</Typography>
            </Box>
          </Box>

          {/* Tabs */}
          <Tabs
            value={tab} onChange={(_, v) => setTab(v)}
            sx={{
              mb: 3,
              '& .MuiTabs-indicator': { background: '#FF6F00' },
              '& .MuiTab-root': { color: '#8B949E', fontWeight: 600, textTransform: 'none' },
              '& .Mui-selected': { color: '#FF6F00 !important' },
            }}
          >
            <Tab label="Sign In" id="tab-login" aria-controls="panel-login" />
            <Tab label="Create Account" id="tab-register" aria-controls="panel-register" />
          </Tabs>

          {tab === 0 && (
            <Box id="panel-login" role="tabpanel" aria-labelledby="tab-login">
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Welcome back</Typography>
              <Typography variant="body2" sx={{ color: '#8B949E', mb: 3 }}>
                Sign in to your account to continue
              </Typography>
              <LoginForm onSuccess={handleSuccess} />
            </Box>
          )}

          {tab === 1 && (
            <Box id="panel-register" role="tabpanel" aria-labelledby="tab-register">
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Create Account</Typography>
              <Typography variant="body2" sx={{ color: '#8B949E', mb: 3 }}>
                Register with your Gmail to get started
              </Typography>
              <RegisterForm onSuccess={handleSuccess} />
            </Box>
          )}

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />
          <Typography variant="caption" sx={{ color: '#8B949E', textAlign: 'center', display: 'block' }}>
            🔒 Secured with bcrypt + JWT authentication
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
