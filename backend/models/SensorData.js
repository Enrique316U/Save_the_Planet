const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema({
  temperatura: { type: Number, required: false }, // Temperatura
  humedad: { type: Number, required: false }, // Humedad
  contaminacion: { type: Number, required: false }, // Contaminación
  sonido: { type: Number, required: false }, // Intensidad de Sonido
  latitud: { type: Number, required: false }, // Latitud
  longitud: { type: Number, required: false }, // Longitud
  timestamp: { type: Date, default: Date.now }, // Marca de tiempo automática
});

module.exports = mongoose.model("SensorData", sensorDataSchema);
