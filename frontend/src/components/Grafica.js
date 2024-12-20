import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css"; // Asegúrate de importar Bootstrap CSS
import "../estilos/Grafica.css"; // Importar el CSS personalizado

function Grafica({ sensorEndpoint, title }) {
  const [data, setData] = useState([]);
  const chartContainerRef = useRef(null);
  const [chartSize, setChartSize] = useState({ width: 800, height: 500 });

  useEffect(() => {
    // Función para obtener los datos del sensor
    const fetchData = async () => {
      try {
        const response = await axios.get(sensorEndpoint);
        const sensorData = response.data.map((record) => ({
          name: new Date(record.timestamp).toLocaleTimeString(),
          temperatura: parseFloat(record.temperatura),
          humedad: parseFloat(record.humedad),
          contaminacion: parseFloat(record.contaminacion),
          sonido: parseFloat(record.sonido),
        }));
        setData(sensorData.slice(-10)); // Mantiene solo los últimos 10 registros
      } catch (error) {
        console.error(
          `Error al obtener los datos del sensor desde ${sensorEndpoint}:`,
          error
        );
      }
    };

    fetchData(); // Obtener los datos al montar el componente

    const interval = setInterval(fetchData, 10000); // Actualizar cada 10 segundos

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar
  }, [sensorEndpoint]);

  useEffect(() => {
    updateChartSize();
    window.addEventListener("resize", updateChartSize);
    return () => window.removeEventListener("resize", updateChartSize);
  }, []);

  const updateChartSize = () => {
    if (chartContainerRef.current) {
      const { width } = chartContainerRef.current.getBoundingClientRect();
      const containerHeight = window.innerHeight - 100;
      setChartSize({
        width: width - 20,
        height: Math.min(500, containerHeight),
      }); // Ajuste de ancho
    }
  };

  return (
    <div ref={chartContainerRef} className="chart-container mb-4">
      <h3 className="chart-title">{title}</h3>
      <div className="table-responsive">
        <LineChart
          width={chartSize.width}
          height={chartSize.height}
          data={data}
          className="recharts-wrapper"
        >
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temperatura" stroke="#8884d8" />
          <Line type="monotone" dataKey="humedad" stroke="#82ca9d" />
          <Line type="monotone" dataKey="contaminacion" stroke="#ffc658" />
          <Line type="monotone" dataKey="sonido" stroke="#ff7300" />
        </LineChart>
      </div>
    </div>
  );
}

function GraficasSensores() {
  return (
    <div className="container">
      <Grafica
        sensorEndpoint="http://ubuntu-pi:5000/api/sensordata/sensor1/first-20"
        title="Sensor 1"
      />
      <Grafica
        sensorEndpoint="http://ubuntu-pi:5000/api/sensordata/sensor2/first-20"
        title="Sensor 2"
      />
    </div>
  );
}

export default GraficasSensores;
