import React, { useState, useEffect } from "react";
import "../estilos/Boletin.css";
/*
function Boletin() {
  // Estado para almacenar los datos de los sensores
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    // Suscribirse a los datos del sensor y establecer el estado cada vez que llegan nuevos datos
    const unsubscribe = subscribeToSensorData(setSensorData);

    // Limpiar la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);

  return (
    <div className="boletin-container">
      <h2>Datos de los Sensores en Tiempo Real</h2>
      <div className="sensor-container">
        {/* Muestra cada sensor en una tarjeta */ /*}
        {sensorData.map((sensor, index) => (
          <div key={index} className="sensor-card">
            <h3>{sensor.name}</h3>
            <p><strong>Temperatura:</strong> {sensor.temperatura} °C</p>
            <p><strong>Humedad:</strong> {sensor.humedad} %</p>
            <p><strong>Contaminación:</strong> {sensor.contaminacion} ppm</p>
            <p><strong>Sonido:</strong> {sensor.sonido} dB</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Boletin;
*/

function Boletin() {
  // Estados para el Sensor 1
  const [temperature1, setTemperature1] = useState("--");
  const [humidity1, setHumidity1] = useState("--");
  const [contamination1, setContamination1] = useState("--");
  const [sound1, setSound1] = useState("--");
  const [alertLevel1, setAlertLevel1] = useState(""); // Estado para la alerta del Sensor 1
  const [error1, setError1] = useState(null); // Error del Sensor 1

  // Estados para el Sensor 2
  const [temperature2, setTemperature2] = useState("--");
  const [humidity2, setHumidity2] = useState("--");
  const [contamination2, setContamination2] = useState("--");
  const [sound2, setSound2] = useState("--");
  const [alertLevel2, setAlertLevel2] = useState(""); // Estado para la alerta del Sensor 2
  const [error2, setError2] = useState(null); // Error del Sensor 2

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

  // Función para obtener datos del Sensor 1
  const updateData1 = async () => {
    try {
      const response = await fetch(
        "http://ubuntu-pi:5000/api/sensordata/latest"
      );
      const data = await response.json();

      const {
        temperatura: temperature,
        humedad: humidity,
        contaminacion: contamination,
        sonido: sound,
      } = data;

      // Actualización de estados del Sensor 1
      setTemperature1(temperature);
      setHumidity1(humidity);
      setContamination1(contamination);
      setSound1(sound);
      setAlertLevel1(calculateAlertLevel({ temperature, contamination }));
      setError1(null);
    } catch (error) {
      console.error("Error al obtener los datos del sensor 1:", error);
      setError1("No se pueden obtener los datos del servidor del sensor 1.");
    }
  };

  // Función para obtener datos del Sensor 2
  const updateData2 = async () => {
    try {
      const response = await fetch(
        "http://ubuntu-pi:5000/api/sensordata/second-latest"
      );
      const data = await response.json();

      const {
        temperatura: temperature,
        humedad: humidity,
        contaminacion: contamination,
        sonido: sound,
      } = data;

      // Actualización de estados del Sensor 2
      setTemperature2(temperature);
      setHumidity2(humidity);
      setContamination2(contamination);
      setSound2(sound);
      setAlertLevel2(calculateAlertLevel({ temperature, contamination }));
      setError2(null);
    } catch (error) {
      console.error("Error al obtener los datos del sensor 2:", error);
      setError2("No se pueden obtener los datos del servidor del sensor 2.");
    }
  };

  // Hook para actualizar datos cada 2 segundos
  useEffect(() => {
    const interval1 = setInterval(updateData1, 2000);
    const interval2 = setInterval(updateData2, 2000);
    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, []);

  // Función para limitar el valor de la barra de progreso
  const getProgressBarWidth = (value, max = 100) => {
    const percentage = (value / max) * 100;
    return `${Math.min(Math.max(percentage, 0), 100)}%`;
  };

  return (
    <div className="App">
      <h1 className="title">USMP Sistema de Monitoreo</h1>

      {/* Sensor 1 */}
      <h2>Sensor 1</h2>
      <div className="container">
        <div className={`card temperature ${alertLevel1}`}>
          <h2>Temperatura</h2>
          <div className="sensor-value">{temperature1} °C</div>
          <div className="progress-bar">
            <div
              className="fill"
              style={{ width: getProgressBarWidth(temperature1, 50) }}
            ></div>
          </div>
        </div>

        <div className="card humidity">
          <h2>Humedad</h2>
          <div className="sensor-value">{humidity1} %</div>
          <div className="progress-bar">
            <div
              className="fill"
              style={{ width: getProgressBarWidth(humidity1) }}
            ></div>
          </div>
        </div>

        <div className={`card contamination ${alertLevel1}`}>
          <h2>Nivel de Contaminación</h2>
          <div className="sensor-value">{contamination1} ppm</div>
          <div className="progress-bar">
            <div
              className="fill"
              style={{ width: getProgressBarWidth(contamination1, 1000) }}
            ></div>
          </div>
        </div>

        <div className="card sound">
          <h2>Nivel de Sonido</h2>
          <div className="sensor-value">{sound1} dB</div>
          <div className="progress-bar">
            <div
              className="fill"
              style={{ width: getProgressBarWidth(sound1, 100) }}
            ></div>
          </div>
        </div>
      </div>

      {/* Alerta para Sensor 1 */}
      {error1 && (
        <div className="alert-container">
          <div className="alert very-grave">{error1}</div>
        </div>
      )}

      {/* Sensor 2 */}
      <h2>Sensor 2</h2>
      <div className="container">
        <div className={`card temperature ${alertLevel2}`}>
          <h2>Temperatura</h2>
          <div className="sensor-value">{temperature2} °C</div>
          <div className="progress-bar">
            <div
              className="fill"
              style={{ width: getProgressBarWidth(temperature2, 50) }}
            ></div>
          </div>
        </div>

        <div className="card humidity">
          <h2>Humedad</h2>
          <div className="sensor-value">{humidity2} %</div>
          <div className="progress-bar">
            <div
              className="fill"
              style={{ width: getProgressBarWidth(humidity2) }}
            ></div>
          </div>
        </div>

        <div className={`card contamination ${alertLevel2}`}>
          <h2>Nivel de Contaminación</h2>
          <div className="sensor-value">{contamination2} ppm</div>
          <div className="progress-bar">
            <div
              className="fill"
              style={{ width: getProgressBarWidth(contamination2, 1000) }}
            ></div>
          </div>
        </div>

        <div className="card sound">
          <h2>Nivel de Sonido</h2>
          <div className="sensor-value">{sound2} dB</div>
          <div className="progress-bar">
            <div
              className="fill"
              style={{ width: getProgressBarWidth(sound2, 100) }}
            ></div>
          </div>
        </div>
      </div>

      {/* Alerta para Sensor 2 */}
      {error2 && (
        <div className="alert-container">
          <div className="alert very-grave">{error2}</div>
        </div>
      )}
    </div>
  );
}
export default Boletin;
