import React, { useState, useEffect } from "react";
import "./App.css"; // Estilos globales

function App() {
  // Estados para almacenar los valores de los sensores
  const [temperature, setTemperature] = useState("--");
  const [humidity, setHumidity] = useState("--");
  const [contamination, setContamination] = useState("--");
  const [alertLevel, setAlertLevel] = useState(""); // Estado para manejar el nivel de alerta
  const [error, setError] = useState(null); // Estado para manejar errores

  // Función para determinar el nivel de alerta
  const calculateAlertLevel = ({ temperature, contamination }) => {
    if (temperature > 50 || contamination > 1000) {
      return "very-grave"; // Alerta muy grave
    } else if (temperature > 40 || contamination > 700) {
      return "intermediate"; // Alerta intermedia
    } else if (temperature > 30 || contamination > 400) {
      return "minor"; // Alerta menor
    }
    return ""; // No hay alerta
  };

  // Función para obtener los datos del servidor
  const updateData = async () => {
    try {
      const response = await fetch("http://192.168.209.64/api");
      const data = await response.json();
      const {
        temperature,
        humidity,
        contaminacion: contamination,
      } = data.variables;

      // Actualizamos los estados con los valores recibidos
      setTemperature(temperature);
      setHumidity(humidity);
      setContamination(contamination);
      setAlertLevel(calculateAlertLevel({ temperature, contamination }));
      setError(null); // Resetear errores si se obtuvieron los datos correctamente
    } catch (error) {
      console.error("Error al obtener los datos del sensor:", error);
      setError("No se pueden obtener los datos del servidor.");
    }
  };

  // Hook para actualizar los datos del sensor cada 2 segundos
  useEffect(() => {
    const interval = setInterval(updateData, 2000); // Actualizamos cada 2 segundos
    return () => clearInterval(interval); // Limpiamos el intervalo al desmontar el componente
  }, []);

  // Función para limitar el valor de la barra de progreso (0% a 100%)
  const getProgressBarWidth = (value, max = 100) => {
    const percentage = (value / max) * 100;
    return `${Math.min(Math.max(percentage, 0), 100)}%`;
  };

  return (
    <div className="App">
      <h1 className="title">Sistema de Monitoreo de Sensores</h1>
      {error && <div className="alert very-grave">{error}</div>}{" "}
      {/* Mostrar error si ocurre */}
      <div className="container">
        {/* Tarjeta para mostrar la temperatura */}
        <div className={`card temperature ${alertLevel}`}>
          <h2>Temperatura</h2>
          <div className="sensor-value">{temperature} °C</div>
          {/* Barra de progreso para la temperatura */}
          <div className="progress-bar">
            <div
              className="fill"
              style={{ width: getProgressBarWidth(temperature, 50) }}
            ></div>
          </div>
        </div>

        {/* Tarjeta para mostrar la humedad */}
        <div className={`card humidity`}>
          <h2>Humedad</h2>
          <div className="sensor-value">{humidity} %</div>
          {/* Barra de progreso para la humedad */}
          <div className="progress-bar">
            <div
              className="fill"
              style={{ width: getProgressBarWidth(humidity) }}
            ></div>
          </div>
        </div>

        {/* Tarjeta para mostrar la contaminación */}
        <div className={`card contamination ${alertLevel}`}>
          <h2>Nivel de Contaminación</h2>
          <div className="sensor-value">{contamination} ppm</div>
          {/* Barra de progreso para la contaminación */}
          <div className="progress-bar">
            <div
              className="fill"
              style={{ width: getProgressBarWidth(contamination, 1000) }}
            ></div>
          </div>
        </div>
      </div>
      {/* Mostrar alertas de diferentes niveles */}
      {alertLevel === "minor" && (
        <div className="alert minor">Alerta Menor: Posibles incomodidades.</div>
      )}
      {alertLevel === "intermediate" && (
        <div className="alert intermediate">
          Alerta Intermedia: Peligro Moderado.
        </div>
      )}
      {alertLevel === "very-grave" && (
        <div className="alert very-grave">
          ¡ALERTA MUY GRAVE! Peligro de Muerte.
        </div>
      )}
    </div>
  );
}

export default App;
