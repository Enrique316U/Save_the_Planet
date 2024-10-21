const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const mqtt = require("mqtt"); // <--- MQTT agregado
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

// Conectar al broker MQTT (Ejemplo: broker público de EMQX)
const mqttBrokerUrl = "mqtt://broker.emqx.io:1883"; // URL del broker público
const mqttClient = mqtt.connect(mqttBrokerUrl); // Conectar al broker

// Suscribirse a los topics específicos que publica el ESP32
mqttClient.on("connect", () => {
  console.log("Conectado al broker MQTT");

  // Suscribirse a los topics publicados por el ESP32
  mqttClient.subscribe("esp32/sensor/temperature3a3WYwBHfmqkX2");
  mqttClient.subscribe("esp32/sensor/humidity3a3WYwBHfmqkX2");
  mqttClient.subscribe("esp32/sensor/contaminacion3a3WYwBHfmqkX2");
  mqttClient.subscribe("esp32/sensor/sound3a3WYwBHfmqkX2");
  mqttClient.subscribe("esp32/sensor/latitude3a3WYwBHfmqkX2");
  mqttClient.subscribe("esp32/sensor/longitude3a3WYwBHfmqkX2");
});

// Procesar los mensajes recibidos en cada topic
mqttClient.on("message", async (topic, message) => {
  const msg = message.toString(); // Convertir el mensaje a string
  let sensorData = {};

  try {
    // Procesar cada topic y extraer los valores
    if (topic === "esp32/sensor/temperature3a3WYwBHfmqkX2") {
      const temperature = parseFloat(msg.split("Temperatura: ")[1]); // Ajustado para "Temperatura"
      sensorData.temperature = temperature;
    } else if (topic === "esp32/sensor/humidity3a3WYwBHfmqkX2") {
      const humidity = parseFloat(msg.split("Humedad: ")[1]); // Ajustado para "Humedad"
      sensorData.humidity = humidity;
    } else if (topic === "esp32/sensor/contaminacion3a3WYwBHfmqkX2") {
      const contamination = parseFloat(msg.split("MQ Contaminación: ")[1]); // Ajustado para "MQ Contaminación"
      sensorData.contamination = contamination;
    } else if (topic === "esp32/sensor/sound3a3WYwBHfmqkX2") {
      const soundIntensity = parseFloat(msg.split("Intensidad de Sonido: ")[1]); // Ajustado para "Intensidad de Sonido"
      sensorData.soundIntensity = soundIntensity;
    } else if (topic === "esp32/sensor/latitude3a3WYwBHfmqkX2") {
      const latitude = parseFloat(msg.split("Latitud: ")[1]); // Ajustado para "Latitud"
      sensorData.latitude = latitude;
    } else if (topic === "esp32/sensor/longitude3a3WYwBHfmqkX2") {
      const longitude = parseFloat(msg.split("Longitud: ")[1]); // Ajustado para "Longitud"
      sensorData.longitude = longitude;
    }

    // Si hay algún dato que almacenar
    if (Object.keys(sensorData).length > 0) {
      sensorData.timestamp = new Date(); // Agregar timestamp
      const newSensorData = new SensorData(sensorData);
      await newSensorData.save(); // Guardar en MongoDB
      console.log("Datos del sensor almacenados:", sensorData);
    }
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

// Iniciar el servidor (Solo una vez)
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
