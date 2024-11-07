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

// Suscribirse a los topics de ambos sensores
mqttClient.on("connect", () => {
  console.log("Conectado al broker MQTT");

  // Suscribirse al topic del sensor 1
  mqttClient.subscribe("esp32/sensor/datos3a3WYwBHfmqkX2", (err) => {
    if (!err) {
      console.log("Suscrito al topic 1 esp32/sensor/datos3a3WYwBHfmqkX2");
    } else {
      console.error("Error al suscribirse al topic del sensor 1:", err);
    }
  });

  // Suscribirse al topic del sensor 2
  mqttClient.subscribe("esp32/sensor/temperaturedeYHM1urghGF2M", (err) => {
    if (!err) {
      console.log("Suscrito al topic 2 esp32/sensor/temperaturedeYHM1urghGF2M");
    } else {
      console.error("Error al suscribirse al topic del sensor 2:", err);
    }
  });
});

// Procesar los mensajes recibidos en los topics de ambos sensores
mqttClient.on("message", async (topic, message) => {
  const msg = message.toString(); // Convertir el mensaje a string
  try {
    // Parsear el mensaje como JSON
    const sensorData = JSON.parse(msg);

    // Agregar timestamp a los datos
    sensorData.timestamp = new Date();

    // Determinar de qué sensor provienen los datos según el topic
    if (topic === "esp32/sensor/datos3a3WYwBHfmqkX2") {
      sensorData.sensorId = 1; // Identificador para el Sensor 1
    } else if (topic === "esp32/sensor/temperaturedeYHM1urghGF2M") {
      sensorData.sensorId = 2; // Identificador para el Sensor 2
    }

    // Guardar los datos en MongoDB
    const newSensorData = new SensorData(sensorData);
    await newSensorData.save();

    console.log(
      `Datos del sensor ${sensorData.sensorId} almacenados:`,
      sensorData
    );
  } catch (error) {
    console.error("Error al procesar el mensaje MQTT:", error.message);
  }
});

// Rutas básicas
app.get("/api/", (req, res) => {
  res.send("¡Hola desde el backend Express!");
});

// Endpoint para obtener los datos más recientes del sensor 1
app.get("/api/sensordata/latest", async (req, res) => {
  try {
    const latestData = await SensorData.findOne({ sensorId: 1 }).sort({
      timestamp: -1,
    });
    if (!latestData) {
      return res
        .status(404)
        .json({ message: "No se encontraron datos del sensor 1." });
    }
    res.status(200).json(latestData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener los datos del sensor 1" });
  }
});

// Endpoint para obtener los datos más recientes del sensor 2
app.get("/api/sensordata/second-latest", async (req, res) => {
  try {
    const latestData = await SensorData.findOne({ sensorId: 2 }).sort({
      timestamp: -1,
    });
    if (!latestData) {
      return res
        .status(404)
        .json({ message: "No se encontraron datos del sensor 2." });
    }
    res.status(200).json(latestData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener los datos del sensor 2" });
  }
});

// Endpoint para obtener los primeros 20 datos más recientes del Sensor 1
app.get("/api/sensordata/sensor1/first-20", async (req, res) => {
  try {
    const data = await SensorData.find({ sensorId: 1 })
      .sort({ timestamp: -1 })
      .limit(20);

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron datos para el Sensor 1." });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener los datos del Sensor 1" });
  }
});

// Endpoint para obtener los primeros 20 datos más recientes del Sensor 2
app.get("/api/sensordata/sensor2/first-20", async (req, res) => {
  try {
    const data = await SensorData.find({ sensorId: 2 })
      .sort({ timestamp: -1 })
      .limit(20);

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron datos para el Sensor 2." });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener los datos del Sensor 2" });
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
