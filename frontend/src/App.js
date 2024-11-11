import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MapComponent from "./components/MapComponent";
import Home from "./components/Home";
import Boletin from "./components/Boletin";
import Grafica from "./components/Grafica";
import Datos from "./components/Datos";
import logo from "./estilos/Imagenes/Logo-FIA.png";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Footer from "./components/Footer"; // Importa el componente Footer

// Componente de navegación
function Header() {
  return (
    <nav className="header navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container">
        {/* Logo */}
        <Link to="https://filialsur.usmp.edu.pe/" className="navbar-brand">
          <img
            src={logo}
            alt="USMP Logo"
            className="d-inline-block align-top logo"
          />
        </Link>

        {/* Botón para menú colapsable en dispositivos pequeños */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Enlaces de navegación */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto nav-links">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/boletin" className="nav-link">
                Boletín
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/grafica" className="nav-link">
                Gráfica
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/datos" className="nav-link">
                Datos
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/mapa" className="nav-link">
                Mapa
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

// Componente principal que configura el enrutamiento de la aplicación
function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container mt-5 pt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/boletin" element={<Boletin />} />
            <Route path="/grafica" element={<Grafica />} />
            <Route path="/datos" element={<Datos />} />
            <Route path="/mapa" element={<MapComponent />} />
          </Routes>
        </div>
        <Footer /> {/* Agrega el Footer al final de tu aplicación */}
      </div>
    </Router>
  );
}

export default App;
