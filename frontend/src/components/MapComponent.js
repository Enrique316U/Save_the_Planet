import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import axios from "axios";

function MapComponent() {
  const [sensor1Data, setSensor1Data] = useState(null);
  const [sensor2Data, setSensor2Data] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const mapContainerRef = useRef(null);
  const [mapSize, setMapSize] = useState({ width: "100%", height: "900px" });

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        // Obtener los datos de cada sensor
        const [sensor1Response, sensor2Response] = await Promise.all([
          axios.get("http://ubuntu-pi:5000/api/sensordata/sensor1/first-20"),
          axios.get("http://ubuntu-pi:5000/api/sensordata/sensor2/first-20"),
        ]);

        // Tomar el último registro de cada sensor como el más reciente
        setSensor1Data(sensor1Response.data[0]);
        setSensor2Data(sensor2Response.data[0]);
      } catch (error) {
        console.error("Error al obtener los datos de los sensores:", error);
      }
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 10000); // Actualizar cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    updateMapSize();
    window.addEventListener("resize", updateMapSize);
    return () => window.removeEventListener("resize", updateMapSize);
  }, []);

  const updateMapSize = () => {
    if (mapContainerRef.current) {
      const { width, height } = mapContainerRef.current.getBoundingClientRect();
      const containerHeight = window.innerHeight - 100;
      setMapSize({
        width: "100%",
        height: Math.min(height, containerHeight) + "px",
      });
    }
  };

  const handleMarkerDragEnd = (event, sensor, setSensorData) => {
    const { lat, lng } = event.target.getLatLng();
    setSensorData((prevData) => ({
      ...prevData,
      location: { lat, lng },
    }));
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div ref={mapContainerRef}>
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        {isEditing ? (
          <button onClick={toggleEditMode}>
            Guardar Posición de los Sensores
          </button>
        ) : (
          <button onClick={toggleEditMode}>Mover Posición de Sensores</button>
        )}
      </div>

      <MapContainer
        center={[-16.422632, -71.520943]} // Ubicación inicial
        zoom={17}
        style={{
          width: mapSize.width,
          height: mapSize.height,
          marginTop: "0px",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marcador del Sensor 1 */}
        {sensor1Data && (
          <Marker
            position={sensor1Data.location || [-16.422632, -71.520943]}
            draggable={isEditing}
            eventHandlers={{
              dragend: (event) =>
                handleMarkerDragEnd(event, "sensor1", setSensor1Data),
            }}
          >
            <Popup>
              <div>
                <strong>Sensor 1</strong> <br />
                <strong>Temperatura:</strong> {sensor1Data.temperatura} °C{" "}
                <br />
                <strong>Humedad:</strong> {sensor1Data.humedad} % <br />
                <strong>Contaminación:</strong> {sensor1Data.contaminacion} ppm{" "}
                <br />
                <strong>Sonido:</strong> {sensor1Data.sonido} dB <br />
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marcador del Sensor 2 */}
        {sensor2Data && (
          <Marker
            position={sensor2Data.location || [-16.423232, -71.521643]} // Posición ligeramente diferente para el Sensor 2
            draggable={isEditing}
            eventHandlers={{
              dragend: (event) =>
                handleMarkerDragEnd(event, "sensor2", setSensor2Data),
            }}
          >
            <Popup>
              <div>
                <strong>Sensor 2</strong> <br />
                <strong>Temperatura:</strong> {sensor2Data.temperatura} °C{" "}
                <br />
                <strong>Humedad:</strong> {sensor2Data.humedad} % <br />
                <strong>Contaminación:</strong> {sensor2Data.contaminacion} ppm{" "}
                <br />
                <strong>Sonido:</strong> {sensor2Data.sonido} dB <br />
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default MapComponent;
