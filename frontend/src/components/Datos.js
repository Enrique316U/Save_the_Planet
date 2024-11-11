import React, { useState, useEffect } from "react";
import axios from "axios";
import "../estilos/Datos.css"; // Asegúrate de que los estilos CSS sean responsivos
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css"; // Asegúrate de importar Bootstrap CSS

function Datos() {
  const [sensor1Data, setSensor1Data] = useState([]);
  const [sensor2Data, setSensor2Data] = useState([]);

  // Función para obtener los datos del Sensor 1
  const getSensor1Data = async () => {
    try {
      const response = await axios.get(
        "http://ubuntu-pi:5000/api/sensordata/sensor1/first-20"
      );
      setSensor1Data(response.data);
    } catch (error) {
      console.error("Error al obtener los datos del Sensor 1:", error);
    }
  };

  // Función para obtener los datos del Sensor 2
  const getSensor2Data = async () => {
    try {
      const response = await axios.get(
        "http://ubuntu-pi:5000/api/sensordata/sensor2/first-20"
      );
      setSensor2Data(response.data);
    } catch (error) {
      console.error("Error al obtener los datos del Sensor 2:", error);
    }
  };

  useEffect(() => {
    getSensor1Data();
    getSensor2Data();

    const interval = setInterval(() => {
      getSensor1Data();
      getSensor2Data();
    }, 10000); // Actualizar cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Datos Recolectados</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th rowSpan="2">Hora</th>
              <th colSpan="5">Sensor 1</th>
              <th colSpan="5">Sensor 2</th>
            </tr>
            <tr>
              <th>Nombre</th>
              <th>Temperatura (°C)</th>
              <th>Humedad (%)</th>
              <th>Contaminación (ppm)</th>
              <th>Sonido (dB)</th>
              <th>Nombre</th>
              <th>Temperatura (°C)</th>
              <th>Humedad (%)</th>
              <th>Contaminación (ppm)</th>
              <th>Sonido (dB)</th>
            </tr>
          </thead>
          <tbody>
            {sensor1Data.map((record1, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "even-row" : "odd-row"}
              >
                <td>{new Date(record1.timestamp).toLocaleTimeString()}</td>
                <td>Sensor 1</td>
                <td>{record1.temperatura}</td>
                <td>{record1.humedad}</td>
                <td>{record1.contaminacion}</td>
                <td>{record1.sonido}</td>
                {sensor2Data[index] ? (
                  <>
                    <td>Sensor 2</td>
                    <td>{sensor2Data[index].temperatura}</td>
                    <td>{sensor2Data[index].humedad}</td>
                    <td>{sensor2Data[index].contaminacion}</td>
                    <td>{sensor2Data[index].sonido}</td>
                  </>
                ) : (
                  <>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Datos;
