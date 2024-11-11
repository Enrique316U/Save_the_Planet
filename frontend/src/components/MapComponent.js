import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../estilos/MapComponent.css";

function MapComponent() {
  const [sensorData, setSensorData] = useState([null, null]);
  const [activeVariable, setActiveVariable] = useState("contaminacion"); // Variable activa
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const [sensor1Response, sensor2Response] = await Promise.all([
          axios.get("http://ubuntu-pi:5000/api/sensordata/sensor1/first-20"),
          axios.get("http://ubuntu-pi:5000/api/sensordata/sensor2/first-20"),
        ]);

        setSensorData([sensor1Response.data[0], sensor2Response.data[0]]);
      } catch (error) {
        console.error("Error al obtener los datos de los sensores:", error);
      }
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleMarkerDragEnd = (event, index) => {
    const { lat, lng } = event.target.getLatLng();
    setSensorData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = {
        ...updatedData[index],
        location: { lat, lng },
      };
      return updatedData;
    });
  };

  const getColorBasedOnData = (sensor) => {
    if (!sensor) return "gray";
    const value = sensor[activeVariable];

    switch (activeVariable) {
      case "temperatura":
        return value < 20 ? "blue" : value < 30 ? "green" : "red";
      case "humedad":
        return value < 30 ? "lightblue" : value < 60 ? "blue" : "darkblue";
      case "contaminacion":
        return value < 200
          ? "green"
          : value < 400
          ? "yellow"
          : value < 600
          ? "orange"
          : "red";
      case "sonido":
        return value < 50
          ? "lightgreen"
          : value < 70
          ? "yellowgreen"
          : "darkgreen";
      default:
        return "gray";
    }
  };

  return (
    <div className="map-container">
      <div className="row">
        <div className="col-9">
          <MapContainer
            center={[-16.422632, -71.520943]}
            zoom={17}
            style={{
              width: "100%",
              height: "100vh",
              marginTop: "0px",
            }}
            ref={mapContainerRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {sensorData.map(
              (sensor, index) =>
                sensor && (
                  <Marker
                    key={index}
                    position={
                      sensor.location || [
                        -16.422632 + index * -0.0006,
                        -71.520943 + index * -0.0007,
                      ]
                    }
                    eventHandlers={{
                      dragend: (event) => handleMarkerDragEnd(event, index),
                    }}
                  >
                    <Popup>
                      <div>
                        <h5>{`Sensor ${index + 1}`}</h5>
                        <p>
                          <strong>Temperatura:</strong> {sensor.temperatura} °C
                          <br />
                          <strong>Humedad:</strong> {sensor.humedad} %<br />
                          <strong>Contaminación:</strong> {sensor.contaminacion}{" "}
                          ppm
                          <br />
                          <strong>Sonido:</strong> {sensor.sonido} dB
                        </p>
                      </div>
                    </Popup>
                    <Circle
                      center={
                        sensor.location || [
                          -16.422632 + index * -0.0006,
                          -71.520943 + index * -0.0007,
                        ]
                      }
                      radius={50}
                      pathOptions={{
                        color: getColorBasedOnData(sensor),
                        fillColor: getColorBasedOnData(sensor),
                        fillOpacity: 0.5,
                      }}
                    />
                  </Marker>
                )
            )}
          </MapContainer>
        </div>
        <div className="col-3 d-flex flex-column justify-content-center">
          <button
            className="custom-button mb-2"
            onClick={() => setActiveVariable("temperatura")}
          >
            Temperatura
          </button>
          <button
            className="custom-button mb-2"
            onClick={() => setActiveVariable("humedad")}
          >
            Humedad
          </button>
          <button
            className="custom-button mb-2"
            onClick={() => setActiveVariable("contaminacion")}
          >
            Contaminación
          </button>
          <button
            className="custom-button mb-2"
            onClick={() => setActiveVariable("sonido")}
          >
            Sonido
          </button>
        </div>
      </div>
    </div>
  );
}

export default MapComponent;
