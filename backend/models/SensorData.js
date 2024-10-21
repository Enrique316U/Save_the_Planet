const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema({
  temperature: { type: Number, required: false }, // Puede que algunos mensajes no incluyan temperatura
  humidity: { type: Number, required: false }, // Humedad
  contamination: { type: Number, required: false }, // MQ Contaminación
  soundIntensity: { type: Number, required: false }, // Intensidad de Sonido
  latitude: { type: Number, required: false }, // Latitud
  longitude: { type: Number, required: false }, // Longitud
  timestamp: { type: Date, default: Date.now }, // Marca de tiempo automática
});

module.exports = mongoose.model("SensorData", sensorDataSchema);
