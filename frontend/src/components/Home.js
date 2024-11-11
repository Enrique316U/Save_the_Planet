import React from "react";
import "../estilos/Home.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Home() {
  return (
    <div className="home-container">
      <h1>
        Plataforma Cloud para el Control y Monitoreo de la Contaminación
        Ambiental y Sonora
      </h1>
      <p>
        Este proyecto ha sido desarrollado como parte de la asignatura Sistemas
        Operativos en la Universidad de San Martín de Porres, por los
        estudiantes Enrique Estrada, Walter Moisés, bajo la guía y supervisión
        del Dr. Guido.
      </p>

      <section className="system-info">
        <h2>Objetivos</h2>
        <p>
          La plataforma tiene como propósito brindar una solución innovadora y
          accesible para el monitoreo en tiempo real de niveles de contaminación
          ambiental y sonora en entornos urbanos y rurales. Mediante la
          tecnología cloud, el sistema recopila y procesa datos precisos de
          múltiples sensores, ofreciendo información visual y accesible desde
          cualquier dispositivo. Esta herramienta está diseñada para facilitar
          el análisis, generar reportes detallados y emitir alertas, permitiendo
          la rápida identificación de niveles críticos de contaminación. Con
          esta propuesta, buscamos no solo presentar un proyecto técnicamente
          sólido, sino también promover la conciencia ambiental y contribuir al
          desarrollo de soluciones tecnológicas que aborden problemáticas de
          alto impacto en nuestra sociedad.
        </p>
      </section>

      <section className="media-section">
        <h2>Galería de Imágenes</h2>
        <div className="image-gallery">
          <div className="image-card">
            <img
              src="/img/sensor1.jpeg"
              alt="Monitor de calidad del aire en el campus"
            />
            <p>Monitor de calidad del aire en el campus</p>
          </div>
          <div className="image-card">
            <img
              src="/img/sensor2.jpg"
              alt="Estación de monitoreo en Arequipa"
            />
            <p>Estación de monitoreo en Arequipa</p>
          </div>
          {/* Más imágenes según sea necesario */}
        </div>
      </section>
    </div>
  );
}

export default Home;
