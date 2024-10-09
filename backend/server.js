const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB conectado'))
.catch(err => {
    console.error('Error de conexión a MongoDB:', err);
    process.exit(1); // Salir de la aplicación si no se puede conectar a la base de datos
});

// Rutas básicas
app.get('/api/', (req, res) => {
    res.send('¡Hola desde el backend Express!');
});

// Manejo de Errores
app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err.stack);
    res.status(500).send('Algo salió mal!');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

