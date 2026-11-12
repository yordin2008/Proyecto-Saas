import { useCallback, useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import { normalizarProductos, normalizarMovimientos } from "../utils/normalizar";
import "./Dashboard.css";

// Vacío = mismo origen. Para apuntar al backend, crea un archivo .env con:
//   REACT_APP_API_URL=http://localhost:3001
const API = process.env.REACT_APP_API_URL ?? "";

async function pedirJson(ruta, signal) {
  const respuesta = await fetch(`${API}${ruta}`, { signal });
  if (!respuesta.ok) throw new Error(`${ruta} respondió ${respuesta.status}`);
  return respuesta.json();
}

/** Carga productos y movimientos desde la API y los pasa al Dashboard. */
export default function DashboardConectado() {
  const [estado, setEstado] = useState({ fase: "cargando" });

  const cargar = useCallback((signal) => {
    setEstado({ fase: "cargando" });
    Promise.all([pedirJson("/api/productos", signal), pedirJson("/api/movimientos", signal)])
      .then(([productos, movimientos]) =>
        setEstado({
          fase: "listo",
          productos: normalizarProductos(productos),
          movimientos: normalizarMovimientos(movimientos),
        })
      )
      .catch((error) => {
        if (error.name === "AbortError") return;
        setEstado({ fase: "error", mensaje: error.message });
      });
  }, []);

  useEffect(() => {
    const control = new AbortController();
    cargar(control.signal);
    return () => control.abort();
  }, [cargar]);

  if (estado.fase === "cargando") {
    return (
      <main className="sw-dashboard">
        <section className="sw-estado" role="status" aria-live="polite">
          <div className="sw-cargando" aria-hidden="true" />
          <h2>Cargando inventario…</h2>
          <p>Estamos consultando los productos y movimientos.</p>
        </section>
      </main>
    );
  }

  if (estado.fase === "error") {
    return (
      <main className="sw-dashboard">
        <section className="sw-estado sw-estado--error" role="alert">
          <h2>No pudimos cargar el inventario</h2>
          <p>Revisa que el servidor esté encendido e inténtalo de nuevo.</p>
          <p><small>{estado.mensaje}</small></p>
          <button type="button" className="sw-estado__boton" onClick={() => cargar()}>
            Reintentar
          </button>
        </section>
      </main>
    );
  }

  return <Dashboard productos={estado.productos} movimientos={estado.movimientos} />;
}
