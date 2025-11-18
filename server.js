const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Firebase
const { admin, db } = require('./config/firebase');

// Import routes
const authRoutes = require('./routes/auth');
const bonafideRoutes = require('./routes/bonafide');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Firebase and create default admin
console.log('Initializing Firebase...');
try {
  console.log('Firebase Admin SDK initialized successfully');
  console.log('Firestore database connected');
  // Create default admin user
  require('./config/createAdmin')();
} catch (err) {
  console.error('Firebase initialization error:', err);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bonafide', bonafideRoutes);

// Serve frontend routes
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
