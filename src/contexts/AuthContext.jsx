import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore session on page load
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem('token');
      if (!token) { setLoading(false); return; }
      try {
        const res = await fetch('/api/user/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setUserRole(data.role);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
        }
      } catch {
        localStorage.removeItem('token');
      }
      setLoading(false);
    };
    restore();
  }, []);

  const _applyAuth = (data) => {
    localStorage.setItem('token', data.token);
    setUser({ _id: data._id, name: data.name, email: data.email, avatar: data.avatar });
    setUserRole(data.role);
    setIsAuthenticated(true);
    return data;
  };

  const register = async (name, email, password, confirmPassword) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed.');
      return _applyAuth(data);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed.');
      return _applyAuth(data);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (credential) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Google Login failed.');
      return _applyAuth(data);
    } finally {
      setLoading(false);
    }
  };

  const setRole = async (role) => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/user/select-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to set role.');
    localStorage.setItem('token', data.token);
    setUserRole(data.role);
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {}
    localStorage.removeItem('token');
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, userRole, isAuthenticated, loading, register, login, googleLogin, setRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
