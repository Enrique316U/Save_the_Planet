import React from "react";
import "../estilos/Home.css";

function Home() {
  return (
    <div className="home-container">
      <h1>Universidad San Martín de Porres</h1>
      <h2>Filial Sur - Arequipa</h2>
      <p>
        La Universidad San Martín de Porres, filial Sur en Arequipa, es
        reconocida por su compromiso con la excelencia académica y su enfoque en
        la innovación tecnológica para mejorar la calidad de vida de la
        comunidad.
      </p>

      <section className="system-info">
        <h2>Sistema Integrado de Monitoreo Ambiental</h2>
        <p>
          Este proyecto de monitoreo ambiental utiliza tecnología IoT para
          evaluar y gestionar la calidad del aire y otros indicadores
          ambientales en la ciudad de Arequipa. Mediante una red de sensores, el
          sistema mide parámetros como temperatura, humedad, nivel de ruido y
          contaminación. La información se procesa en una plataforma en la nube
          para ofrecer visualizaciones y análisis en tiempo real.
        </p>
      </section>

      <section className="features">
        <h2>Características del Sistema</h2>
        <ul>
          <li>Monitoreo en tiempo real de parámetros ambientales.</li>
          <li>
            Alertas automáticas cuando se detectan niveles críticos de
            contaminación.
          </li>
          <li>Visualización de datos en gráficos y mapas interactivos.</li>
          <li>
            Acceso a informes detallados para el análisis y la toma de
            decisiones.
          </li>
        </ul>
      </section>

      <section className="media-section">
        <h2>Galería de Imágenes</h2>
        <div className="image-gallery">
          {/* Sección para agregar imágenes, cada imagen puede representarse con un div para ser estilizada */}
          <div className="image-card">
            <img src="/img/sensor1.jpeg" alt="Descripción de la imagen 1" />
            <p>Monitor de calidad del aire en el campus</p>
          </div>
          <div className="image-card">
            <img src="/img/sensor2.jpg" alt="Descripción de la imagen 2" />
            <p>Estación de monitoreo en Arequipa</p>
          </div>
          {/* Más imágenes según sea necesario */}
        </div>
      </section>
    </div>
  );
}

export default Home;
