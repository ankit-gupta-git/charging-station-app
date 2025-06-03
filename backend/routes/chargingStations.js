const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createStation,
  getAllStations,
  getStation,
  updateStation,
  deleteStation
} = require('../controllers/chargingStationController');
const { body } = require('express-validator');

// Validation middleware
const stationValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('location.latitude').isNumeric().withMessage('Valid latitude is required'),
  body('location.longitude').isNumeric().withMessage('Valid longitude is required'),
  body('status').isIn(['Active', 'Inactive']).withMessage('Status must be either Active or Inactive'),
  body('powerOutput').isNumeric().withMessage('Power output must be a number'),
  body('connectorType').notEmpty().withMessage('Connector type is required')
];

// Protected routes
router.post('/', auth, stationValidation, createStation);
router.get('/', getAllStations);
router.get('/:id', getStation);
router.put('/:id', auth, stationValidation, updateStation);
router.delete('/:id', auth, deleteStation);

module.exports = router; 