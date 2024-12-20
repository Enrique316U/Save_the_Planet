// Este archivo simula datos del sensor de forma independiente y proporciona acceso a los datos para otros componentes.

const listeners = [];

// Genera datos aleatorios de los sensores
function getRandomSensorData() {
  return [
    {
      name: "Sensor 1",
      temperatura: (Math.random() * 40).toFixed(1), // Rango de temperatura
      humedad: (Math.random() * 100).toFixed(1), // Rango de humedad
      contaminacion: (Math.random() * 300).toFixed(1), // Rango de contaminación
      sonido: (Math.random() * 100).toFixed(1), // Rango de sonido
    },
    {
      name: "Sensor 2",
      temperatura: (Math.random() * 40).toFixed(1),
      humedad: (Math.random() * 100).toFixed(1),
      contaminacion: (Math.random() * 300).toFixed(1),
      sonido: (Math.random() * 100).toFixed(1),
    },
  ];
}

// Permite que los componentes se registren para recibir actualizaciones de datos
export function subscribeToSensorData(callback) {
  listeners.push(callback);
  callback(getRandomSensorData()); // Envia datos iniciales

  // Retorna una función para cancelar la suscripción cuando el componente se desmonte
  return () => {
    const index = listeners.indexOf(callback);
    if (index !== -1) listeners.splice(index, 1);
  };
}

// Actualiza los datos de los sensores cada 10 segundos y notifica a los componentes suscritos
setInterval(() => {
  const newData = getRandomSensorData();
  listeners.forEach((callback) => callback(newData)); // Notifica a cada componente
}, 10000);

/*// frontend/src/components/SensorData.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const SensorData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/sensordata/latest");
        console.log("Datos del sensor:", response.data); // Verifica los datos aquí
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar los datos del sensor:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Cargando datos del sensor...</p>;
  if (error) return <p>Error al cargar los datos del sensor.</p>;
  if (!data) return <p>No hay datos disponibles</p>;

  return (
    <div>
      <h2>Datos del Sensor</h2>
      <p>
        <strong>ID:</strong> {data.id}
      </p>
      <p>
        <strong>Nombre:</strong> {data.name}
      </p>
      <p>
        <strong>Hardware:</strong> {data.hardware}
      </p>
      <p>
        <strong>Conectado:</strong> {data.connected ? "Sí" : "No"}
      </p>
      <h3>Variables</h3>
      <p>
        <strong>Temperatura:</strong> {data.variables.temperature}°C
      </p>
      <p>
        <strong>Humedad:</strong> {data.variables.humidity}%
      </p>
      <p>
        <strong>Contaminación:</strong> {data.variables.contaminacion}
      </p>
      <p>
        <strong>Última Actualización:</strong>{" "}
        {new Date(data.timestamp).toLocaleString()}
      </p>
    </div>
  );
};

export default SensorData;
*/
