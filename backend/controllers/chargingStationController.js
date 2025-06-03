const ChargingStation = require('../models/ChargingStation');

// Create a new charging station
exports.createStation = async (req, res) => {
  try {
    const { name, location, status, powerOutput, connectorType } = req.body;
    
    const station = new ChargingStation({
      name,
      location,
      status,
      powerOutput,
      connectorType,
      createdBy: req.user._id
    });

    await station.save();
    res.status(201).json({ message: 'Charging station created successfully', station });
  } catch (error) {
    res.status(500).json({ message: 'Error creating charging station', error: error.message });
  }
};

// Get all charging stations
exports.getAllStations = async (req, res) => {
  try {
    const { status, powerOutput, connectorType } = req.query;
    let query = {};

    // Apply filters if provided
    if (status) query.status = status;
    if (powerOutput) query.powerOutput = powerOutput;
    if (connectorType) query.connectorType = connectorType;

    const stations = await ChargingStation.find(query);
    res.json(stations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching charging stations', error: error.message });
  }
};

// Get a single charging station
exports.getStation = async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ message: 'Charging station not found' });
    }
    res.json(station);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching charging station', error: error.message });
  }
};

// Update a charging station
exports.updateStation = async (req, res) => {
  try {
    const { name, location, status, powerOutput, connectorType } = req.body;
    
    const station = await ChargingStation.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ message: 'Charging station not found' });
    }

    // Update fields
    if (name) station.name = name;
    if (location) station.location = location;
    if (status) station.status = status;
    if (powerOutput) station.powerOutput = powerOutput;
    if (connectorType) station.connectorType = connectorType;

    await station.save();
    res.json({ message: 'Charging station updated successfully', station });
  } catch (error) {
    res.status(500).json({ message: 'Error updating charging station', error: error.message });
  }
};

// Delete a charging station
exports.deleteStation = async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ message: 'Charging station not found' });
    }

    await station.deleteOne();
    res.json({ message: 'Charging station deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting charging station', error: error.message });
  }
}; 