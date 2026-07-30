const { db } = require('../config/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'backtoyou_secure_jwt_secret_2026';

// Seed demo accounts if empty
function seedDemoUsers() {
  const users = db.getUsers();
  
  // Admin Demo Account
  if (!users.find(u => u.email === 'admin@backtoyou.com')) {
    users.push({
      _id: 'u_admin_demo',
      name: 'System Admin',
      email: 'admin@backtoyou.com',
      password: 'admin123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });
  }

  // User Demo Account
  if (!users.find(u => u.email === 'user@university.edu')) {
    users.push({
      _id: 'u_user_demo',
      name: 'Sarah Chen',
      email: 'user@university.edu',
      password: 'user123',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
    });
  }
}

seedDemoUsers();

exports.login = (req, res) => {
  const { email, password, role } = req.body;
  const users = db.getUsers();
  
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  let user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

  if (!user) {
    const userRole = role || (email.toLowerCase().includes('admin') ? 'admin' : 'user');
    user = {
      _id: 'u_' + Date.now(),
      name: email.split('@')[0],
      email: email.trim(),
      password: password || 'password123',
      role: userRole,
      avatar: userRole === 'admin'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };
    users.push(user);
  } else {
    if (role && user.role !== role) {
      user.role = role;
    }
  }

  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  
  const { password: _, ...safeUser } = user;
  return res.json({ success: true, token, user: safeUser, message: 'Login successful!' });
};

exports.register = (req, res) => {
  const { name, email, password, role, avatar } = req.body;
  const users = db.getUsers();

  if (!email || !name) {
    return res.status(400).json({ success: false, message: 'Name and email are required' });
  }

  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists. Please login instead.' });
  }

  const userRole = role === 'admin' ? 'admin' : 'user';
  const defaultAvatar = userRole === 'admin'
    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

  const newUser = {
    _id: 'u_' + Date.now(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: password || 'password123',
    role: userRole,
    avatar: avatar || defaultAvatar
  };

  users.push(newUser);
  const token = jwt.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

  const { password: _, ...safeUser } = newUser;
  return res.json({ success: true, token, user: safeUser, message: 'Registration successful!' });
};

exports.googleOAuth = (req, res) => {
  const { name, email, avatar } = req.body;
  const users = db.getUsers();
  let user = users.find(u => u.email === email);
  if (!user) {
    user = {
      _id: 'u_google_' + Date.now(),
      name: name || 'Google User',
      email,
      role: 'user',
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };
    users.push(user);
  }
  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET);
  res.json({ success: true, token, user });
};

exports.switchRole = (req, res) => {
  const { userId, newRole } = req.body;
  const users = db.getUsers();
  const user = users.find(u => u._id === userId);
  if (user) {
    user.role = newRole;
    return res.json({ success: true, user });
  }
  res.status(404).json({ success: false, message: 'User not found' });
};

exports.updateAvatar = (req, res) => {
  const { userId, avatar } = req.body;
  const users = db.getUsers();
  const user = users.find(u => u._id === userId);
  if (user) {
    user.avatar = avatar;
    const { password: _, ...safeUser } = user;
    return res.json({ success: true, user: safeUser, message: 'Profile picture updated successfully' });
  }
  res.status(404).json({ success: false, message: 'User not found' });
};

