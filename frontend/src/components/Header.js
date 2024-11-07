// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './estilos/Header.css'; // Importa el archivo CSS para aplicar estilos

function Header() {
  return (
    <header className="header">
      {/* Logo o nombre del sistema */}
      <div className="header-logo">
        <h1>Monitoreo Ambiental</h1>
      </div>
      
      {/* Menú de navegación */}
      <nav className="header-nav">
        <ul className="nav-list">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/boletin">Boletín</Link></li>
          <li><Link to="/grafica">Gráfica</Link></li>
          <li><Link to="/datos">Datos</Link></li>
          <li><Link to="/mapa">Mapa</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
