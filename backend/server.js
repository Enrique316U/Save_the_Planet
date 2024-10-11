const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
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
    process.exit(1); // Salir de la aplicación si no se puede conectar a la base de datos
  });

// Rutas básicas
app.get("/api/", (req, res) => {
  res.send("¡Hola desde el backend Express!");
});

// Función para obtener datos del servidor externo
const fetchSensorData = async () => {
  try {
    const response = await axios.get("http://192.168.247.64/api");
    const data = response.data;

    // Validar los datos recibidos
    if (
      data.variables &&
      data.id &&
      data.name &&
      data.hardware !== undefined &&
      data.connected !== undefined
    ) {
      const sensorData = new SensorData(data);
      await sensorData.save();
      console.log("Datos del sensor almacenados:", data);
    } else {
      console.warn("Datos del sensor incompletos:", data);
    }
  } catch (error) {
    console.error("Error al obtener datos del sensor:", error.message);
  }
};

// Obtener datos cada 2 segundos
setInterval(fetchSensorData, 2000);

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
