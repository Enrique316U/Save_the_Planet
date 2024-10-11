// backend/models/SensorData.js
const mongoose = require('mongoose');

const SensorDataSchema = new mongoose.Schema({
    variables: {
        temperature: Number,
        humidity: Number,
        contaminacion: Number,
    },
    id: String,
    name: String,
    hardware: String,
    connected: Boolean,
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('SensorData', SensorDataSchema);
