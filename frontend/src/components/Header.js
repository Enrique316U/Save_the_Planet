import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../estilos/Header.css"; // Importa el archivo CSS para aplicar estilos
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Función para alternar el menú
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Función para cerrar el menú
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Cierra el menú cuando cambia la URL
  useEffect(() => {
    closeMenu();
  }, [location]);

  return (
    <header className="header">
      {/* Logo o nombre del sistema */}
      <div className="header-logo">
        <h1>Monitoreo Ambiental</h1>
      </div>

      {/* Botón de menú para móviles */}
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>

      {/* Menú de navegación */}
      <nav className="header-nav">
        <ul className={`nav-list ${isMenuOpen ? "open" : ""}`}>
          <li>
            <Link to="/" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/boletin" onClick={closeMenu}>
              Boletín
            </Link>
          </li>
          <li>
            <Link to="/grafica" onClick={closeMenu}>
              Gráfica
            </Link>
          </li>
          <li>
            <Link to="/datos" onClick={closeMenu}>
              Datos
            </Link>
          </li>
          <li>
            <Link to="/mapa" onClick={closeMenu}>
              Mapa
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
