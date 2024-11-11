import React from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import "../estilos/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Iconos de redes sociales */}
        <div className="social-icons">
          <a href="https://www.facebook.com/filialsur.usmp">
            <FaFacebookF />
          </a>
          <a href="https://www.linkedin.com/company/universidad-de-san-mart%C3%ADn-de-porres-filial-sur/">
            <FaLinkedinIn />
          </a>
          <a href="https://www.instagram.com/usmp.arequipa.oficial/">
            <FaInstagram />
          </a>
          <a href="https://www.youtube.com/channel/UCnGLAtnrcyD4TF09dV_A6aw">
            <FaYoutube />
          </a>
          <a href="https://www.tiktok.com/@usmp.arequipa">
            <FaTiktok />
          </a>
        </div>

        {/* Enlaces legales */}
        <div className="legal-links">
          <a href="#privacy">Privacidad y seguridad</a>
          <a href="#privacy-notice">Aviso de privacidad</a>
          <a href="#terms">Condiciones de uso</a>
          <a href="#trademarks">Marcas comerciales</a>
          <a href="#legal">Información legal</a>
          <a href="#tools">Herramientas genuinas</a>
          <a href="#consent">Rechazo de consentimiento</a>
        </div>

        {/* País e idioma */}
        <div className="country-language">
          <span className="country">Arequipa</span>
          <span className="language">Perú</span>
        </div>
      </div>

      {/* Información adicional */}
      <div className="footer-bottom">
        <p className="footer-copyright">
          Copyright © 2024 USMP. Todos los derechos reservados.
        </p>
        <p className="footer-developer">Desarrollado con ❤️ y React</p>
      </div>
    </footer>
  );
}

export default Footer;
