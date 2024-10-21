const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const mqtt = require("mqtt");
const SensorData = require("./models/SensorData");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => {
    console.error("Error de conexión a MongoDB:", err);
    process.exit(1);
  });

// Conectar al broker MQTT
const mqttBrokerUrl = "mqtt://broker.emqx.io:1883"; // URL del broker público
const mqttClient = mqtt.connect(mqttBrokerUrl); // Conectar al broker

// Suscribirse a un único topic donde se publican todos los datos
mqttClient.on("connect", () => {
  console.log("Conectado al broker MQTT");

  // Suscribirse al topic único
  mqttClient.subscribe("esp32/sensor/datos3a3WYwBHfmqkX2", (err) => {
    if (!err) {
      console.log("Suscrito al topic esp32/sensor/datos3a3WYwBHfmqkX2");
    } else {
      console.error("Error al suscribirse al topic:", err);
    }
  });
});

// Procesar los mensajes recibidos en el único topic
mqttClient.on("message", async (topic, message) => {
  const msg = message.toString(); // Convertir el mensaje a string
  try {
    // Parsear el mensaje como JSON
    const sensorData = JSON.parse(msg);

    // Agregar timestamp a los datos
    sensorData.timestamp = new Date();

    // Guardar en MongoDB
    const newSensorData = new SensorData(sensorData);
    await newSensorData.save();

    console.log("Datos del sensor almacenados:", sensorData);
  } catch (error) {
    console.error("Error al procesar el mensaje MQTT:", error.message);
  }
});

// Rutas básicas
app.get("/api/", (req, res) => {
  res.send("¡Hola desde el backend Express!");
});

// Endpoint para obtener los datos más recientes
app.get("/api/sensordata/latest", async (req, res) => {
  try {
    const latestData = await SensorData.findOne().sort({ timestamp: -1 });
    if (!latestData) {
      return res
        .status(404)
        .json({ message: "No se encontraron datos del sensor." });
    }
    res.status(200).json(latestData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los datos del sensor" });
  }
});

// Manejo de Errores
app.use((err, req, res, next) => {
  console.error("Error en el servidor:", err.stack);
  res.status(500).send("Algo salió mal!");
});

// Iniciar el servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
