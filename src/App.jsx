import Navbar from "./navbar";
import { useState, useEffect } from "react";
import "./index.css";

export default function App() {
  const temaPorDefecto = {
    fondo: "#0a0a0a",
    texto: "#e6e6e6",
    acento: "#ff0044",
  };

  const [tema, setTema] = useState(() => {
    const guardado = localStorage.getItem("tema");
    return guardado ? JSON.parse(guardado) : temaPorDefecto;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-fondo", tema.fondo);
    root.style.setProperty("--color-texto", tema.texto);
    root.style.setProperty("--color-acento", tema.acento);

    if (tema.fondo === "#0a0a0a") {
      root.style.setProperty("--color-producto-bg", "#1a1a1a");
      root.style.setProperty("--color-producto-hover-bg", "linear-gradient(45deg, var(--color-acento), #8b0000)");
    } else {
      root.style.setProperty("--color-producto-bg", "#333");
      root.style.setProperty("--color-producto-hover-bg", "linear-gradient(45deg, var(--color-acento), #555)");
    }

    localStorage.setItem("tema", JSON.stringify(tema));
  }, [tema]);

  // Cambiar tema según botón
  const cambiarTema = (opcion) => {
    switch (opcion) {
      case "rojo":
        setTema({
          fondo: "#ff0044",
          texto: "#fff",
          acento: "#fff700",
        });
        break;
      case "azul":
        setTema({
          fondo: "#0044ff",
          texto: "#fff",
          acento: "#00fff7",
        });
        break;
      case "oscuro":
      default:
        setTema(temaPorDefecto);
    }
  };

  return (
    <>
      <Navbar />

      <section className="section" style={{ paddingTop: "1rem" }}>
        <div className="theme-buttons" style={{ textAlign: "center" }}>
          <h3>Selecciona el tema de la página:</h3>
          <button onClick={() => cambiarTema("oscuro")}>Oscuro</button>
          <button onClick={() => cambiarTema("rojo")}>Rojo</button>
          <button onClick={() => cambiarTema("azul")}>Azul</button>
        </div>
      </section>

      <section id="inicio" className="section inicio">
        <h1>
          Bienvenido a <span>TECNOROUTE</span>
        </h1>
        <p>Tu solución en transporte y tienda online.</p>
      </section>

      <section className="section servicios">
        <h2>Servicios</h2>
        <p>Transporte terrestre, marítimo y aéreo.</p>
        <p>Venta de repuestos y accesorios originales.</p>
        <p>Asesoría personalizada 24/7.</p>
      </section>

      <section className="section catalogo">
        <h2>Catálogo de Productos</h2>
        <div className="productos">
          <div className="producto">Neumáticos</div>
          <div className="producto">Baterías</div>
          <div className="producto">Llantas</div>
          <div className="producto">Aceites</div>
          <div className="producto">Filtros</div>
          <div className="producto">Accesorios</div>
        </div>
      </section>

      <section className="section clientes">
        <h2>Clientes Satisfechos</h2>
        <p>Más de 10,000 clientes felices en toda la región.</p>
      </section>

      <section className="section contacto">
        <h2>Contacto</h2>
        <p>Teléfono: +123 456 7890</p>
        <p>Email: info@tecnoroute.com</p>
        <p>Dirección: Av. Transporte 123, Ciudad, País</p>
      </section>

      <footer className="footer">© 2025 TECNOROUTE</footer>
    </>
  );
}
