import { useState } from "react";

export default function Navbar() {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const toggleMenu = () => {
    setMostrarMenu(!mostrarMenu);
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img
          src="./src/assets/logo.png"
          alt="Logo"
          className="logo"
        />
        <div className="logo-text">TECNOROUTE</div>
      </div>

      {/* Menú escritorio */}
      <div className="menu">
        <a href="#inicio">Inicio</a>
        <a href="#servicios">Servicios</a>
        <a href="#catalogo">Catálogo</a>
        <a href="#clientes">Clientes</a>
        <a href="#contacto">Contacto</a>
      </div>

      {/* Botón menú móvil */}
      <button className="menu-btn" onClick={toggleMenu} aria-label="Menú">
        {mostrarMenu ? "✖" : "☰"}
      </button>

      {/* Menú móvil */}
      {mostrarMenu && (
        <div className="mobile-menu">
          <a href="#inicio" onClick={() => setMostrarMenu(false)}>
            Inicio
          </a>
          <a href="#servicios" onClick={() => setMostrarMenu(false)}>
            Servicios
          </a>
          <a href="#catalogo" onClick={() => setMostrarMenu(false)}>
            Catálogo
          </a>
          <a href="#clientes" onClick={() => setMostrarMenu(false)}>
            Clientes
          </a>
          <a href="#contacto" onClick={() => setMostrarMenu(false)}>
            Contacto
          </a>
        </div>
      )}
    </nav>
  );
}
