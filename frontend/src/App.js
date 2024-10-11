import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import SensorData from "./components/SensorData";

function App() {
  // Estados para almacenar los valores de los sensores
  const [temperature, setTemperature] = useState("--"); // Estado para la temperatura
  const [humidity, setHumidity] = useState("--"); // Estado para la humedad
  const [contamination, setContamination] = useState("--"); // Estado para la contaminación
  const [alarm, setAlarm] = useState(false); // Estado para activar la alarma

  // Función para obtener los datos del servidor (simula una API real)
  const updateData = async () => {
    try {
      const response = await fetch("http://192.168.247.64/api"); // Reemplaza <IP_DEL_SERVIDOR> con la IP real
      const data = await response.json();

      // Actualizamos los estados con los valores recibidos
      setTemperature(data.variables.temperature);
      setHumidity(data.variables.humidity);
      setContamination(data.variables.contaminacion);

      // Lógica para activar la alarma si los valores son peligrosos
      if (
        data.variables.temperature > 30 ||
        data.variables.contaminacion > 500
      ) {
        setAlarm(true); // Si es peligroso, activamos la alarma
      } else {
        setAlarm(false); // Si no, la desactivamos
      }
    } catch (error) {
      console.error("Error al obtener los datos del sensor:", error);
    }
  };

  // Hook para actualizar los datos del sensor cada segundo
  useEffect(() => {
    const interval = setInterval(updateData, 2000); // Actualizamos cada segundo
    return () => clearInterval(interval); // Limpiamos el intervalo al desmontar el componente
  }, []);

  return (
    <div className="App">
      <h1 className="title">Sistema de Monitoreo de Sensores</h1>{" "}
      {/* Título principal */}
      <SensorData />
      <div className="container">
        {/* Tarjeta para mostrar la temperatura */}
        <div className="card temperature">
          <h2>Temperatura</h2>
          <div className="sensor-value">{temperature} °C</div>{" "}
          {/* Valor de la temperatura */}
        </div>

        {/* Tarjeta para mostrar la humedad */}
        <div className="card humidity">
          <h2>Humedad</h2>
          <div className="sensor-value">{humidity} %</div>{" "}
          {/* Valor de la humedad */}
        </div>

        {/* Tarjeta para mostrar la contaminación */}
        <div className="card contamination">
          <h2>Nivel de Contaminación</h2>
          <div className="sensor-value">{contamination} ppm</div>{" "}
          {/* Valor de la contaminación */}
        </div>
      </div>
      {/* Alerta que se muestra si hay valores peligrosos */}
      {alarm && (
        <div className="alert">¡ALERTA! Niveles peligrosos detectados.</div>
      )}
      {/* Nota: En el futuro puedes agregar gráficos o barras dentro de las tarjetas */}
    </div>
  );
}

export default App;

/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <code>Proyecto de Sistemas Operativos</code>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <h2>Monitor de Sensores</h2>
        <SensorData />
      </header>
    </div>
  );
}

export default App;
*/
