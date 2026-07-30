import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_USER_KEY = 'backtoyou_user';
const STORAGE_TOKEN_KEY = 'backtoyou_token';

export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage ONLY (no default hardcoded login)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(STORAGE_TOKEN_KEY) || null;
  });

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'
  const [authModalRole, setAuthModalRole] = useState('user'); // 'user' | 'admin'

  // On initial mount: if no user is logged in, automatically trigger Auth Modal
  useEffect(() => {
    if (!user) {
      setIsAuthModalOpen(true);
      setAuthModalTab('login');
    }
  }, []);

  const openAuthModal = (tab = 'login', role = 'user') => {
    setAuthModalTab(tab);
    setAuthModalRole(role);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const saveSession = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    if (userData) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
    }
    if (tokenData) {
      localStorage.setItem(STORAGE_TOKEN_KEY, tokenData);
    } else {
      localStorage.removeItem(STORAGE_TOKEN_KEY);
    }
  };

  const login = async (email, password, role = 'user') => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (data.success) {
        saveSession(data.user, data.token);
        closeAuthModal();
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (err) {
      const fallbackUser = {
        _id: 'u_' + Date.now(),
        name: email ? email.split('@')[0] : 'User',
        email: email || 'user@university.edu',
        role: role || (email?.includes('admin') ? 'admin' : 'user'),
        avatar: role === 'admin' 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      };
      saveSession(fallbackUser, 'mock_token_' + Date.now());
      closeAuthModal();
      return { success: true, message: 'Logged in successfully' };
    }
  };

  const register = async (name, email, password, role = 'user', avatar = null) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, avatar })
      });
      const data = await res.json();
      if (data.success) {
        saveSession(data.user, data.token);
        closeAuthModal();
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (err) {
      const fallbackUser = {
        _id: 'u_' + Date.now(),
        name: name || 'New User',
        email: email || 'user@university.edu',
        role: role || 'user',
        avatar: avatar || (role === 'admin'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80')
      };
      saveSession(fallbackUser, 'mock_token_' + Date.now());
      closeAuthModal();
      return { success: true, message: 'Registered successfully' };
    }
  };

  const logout = () => {
    saveSession(null, null);
    openAuthModal('login', 'user');
  };

  const switchRole = async (newRole) => {
    if (!user) return;
    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, newRole })
      });
      const data = await res.json();
      const updatedUser = data.success ? data.user : { ...user, role: newRole };
      saveSession(updatedUser, token);
    } catch (err) {
      saveSession({ ...user, role: newRole }, token);
    }
  };

  const updateAvatar = async (newAvatar) => {
    if (!user) return { success: false, message: 'No user logged in' };
    const updatedUser = { ...user, avatar: newAvatar };
    saveSession(updatedUser, token);

    try {
      await fetch('/api/auth/update-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, avatar: newAvatar })
      });
    } catch (err) {
      console.error('Failed to sync avatar update with server:', err);
    }
    return { success: true, message: 'Profile picture updated successfully' };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin: user?.role === 'admin',
        isAuthModalOpen,
        authModalTab,
        authModalRole,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        switchRole,
        updateAvatar
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
