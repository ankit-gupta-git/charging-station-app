require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const chargingStationRoutes = require('./routes/chargingStations');

const app = express();

// Debug logs
console.log('MongoDB URI:', process.env.MONGODB_URI);
console.log('JWT Secret:', process.env.JWT_SECRET ? 'Set' : 'Not Set');
console.log('Port:', process.env.PORT);

// Middleware
app.use(cors());
app.use(express.json());

// Database connection with fallback
const MONGODB_URI = 'mongodb+srv://ankitgupta_79:eKJk52Z3Nkz8Ye1r@cluster0.09n5els.mongodb.net/charging-station?retryWrites=true&w=majority';
console.log('Using MongoDB URI:', MONGODB_URI);

// Remove deprecated options and add better error handling
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    if (err.name === 'MongoServerError' && err.code === 8000) {
      console.error('Authentication failed. Please check your username and password.');
    }
    console.error('Connection details:', {
      uri: MONGODB_URI,
      env: process.env.NODE_ENV,
      dotenv: process.env.DOTENV_CONFIG_PATH
    });
  });

// Add connection event handlers
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// Public test endpoint
app.get('/api/public/stations', (req, res) => {
  const sampleStations = [
    {
      id: '1',
      name: 'Downtown Charging Hub',
      status: 'Active',
      powerOutput: 50,
      connectorType: 'CCS',
      location: {
        latitude: 51.505,
        longitude: -0.09
      }
    },
    {
      id: '2',
      name: 'City Center Station',
      status: 'Active',
      powerOutput: 100,
      connectorType: 'CHAdeMO',
      location: {
        latitude: 51.51,
        longitude: -0.1
      }
    },
    {
      id: '3',
      name: 'West End Charger',
      status: 'Inactive',
      powerOutput: 75,
      connectorType: 'Type 2',
      location: {
        latitude: 51.515,
        longitude: -0.15
      }
    }
  ];
  
  res.json(sampleStations);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stations', chargingStationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

module.exports = app;