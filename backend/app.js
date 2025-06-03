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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/charging-station';
console.log('Using MongoDB URI:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Connection details:', {
      uri: MONGODB_URI,
      env: process.env.NODE_ENV,
      dotenv: process.env.DOTENV_CONFIG_PATH
    });
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