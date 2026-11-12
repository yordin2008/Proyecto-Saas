import { useMemo, useState } from "react";
import { productosDemo, movimientosDemo } from "../data/datosPrueba";
import {
  estadoProducto,
  calcularResumen,
  productosEnAlerta,
  masVendidos,
  resumenMovimientos,
} from "../utils/inventario";
import "./Dashboard.css";

const numero = new Intl.NumberFormat("es-CO");

const formatearFecha = (iso) =>
  new Date(iso).toLocaleString("es-CO", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });

const ETIQUETA_ESTADO = { agotado: "Agotado", bajo: "Stock bajo" };

/** Barra de nivel: la marca vertical del centro indica el stock mínimo. */
function Nivel({ cantidad, minimo, estado }) {
  const tope = Math.max(minimo * 2, 1);
  const porcentaje = Math.min(cantidad / tope, 1) * 100;
  return (
    <div
      className="sw-nivel"
      role="img"
      aria-label={`${cantidad} unidades en existencia, mínimo ${minimo}`}
    >
      <div
        className={`sw-nivel__lleno sw-nivel__lleno--${estado}`}
        style={{ width: `${porcentaje}%` }}
      />
    </div>
  );
}

function Resumen({ resumen }) {
  const datos = [
    { etiqueta: "Productos registrados", valor: resumen.totalProductos },
    { etiqueta: "Unidades en existencia", valor: resumen.totalUnidades },
    { etiqueta: "Agotados", valor: resumen.agotados, tono: "agotado" },
    { etiqueta: "Con stock bajo", valor: resumen.bajos, tono: "bajo" },
  ];
  return (
    <dl className="sw-resumen">
      {datos.map((d) => (
        <div key={d.etiqueta} className={`sw-resumen__dato ${d.tono ? `sw-resumen__dato--${d.tono}` : ""}`}>
          <dt>{d.etiqueta}</dt>
          <dd>{numero.format(d.valor)}</dd>
        </div>
      ))}
    </dl>
  );
}

function Alertas({ productos }) {
  const [filtro, setFiltro] = useState("todos");
  const enAlerta = useMemo(() => productosEnAlerta(productos), [productos]);

  const cuenta = {
    todos: enAlerta.length,
    agotado: enAlerta.filter((p) => estadoProducto(p) === "agotado").length,
    bajo: enAlerta.filter((p) => estadoProducto(p) === "bajo").length,
  };
  const visibles = filtro === "todos" ? enAlerta : enAlerta.filter((p) => estadoProducto(p) === filtro);

  const filtros = [
    { id: "todos", texto: "Todos" },
    { id: "agotado", texto: "Agotados" },
    { id: "bajo", texto: "Stock bajo" },
  ];

  return (
    <section className="sw-panel" aria-labelledby="titulo-alertas">
      <div className="sw-panel__cabecera">
        <h2 id="titulo-alertas">Productos por reponer</h2>
        <div className="sw-filtros" role="group" aria-label="Filtrar alertas">
          {filtros.map((f) => (
            <button
              key={f.id}
              type="button"
              className="sw-filtro"
              aria-pressed={filtro === f.id}
              onClick={() => setFiltro(f.id)}
            >
              {f.texto} ({cuenta[f.id]})
            </button>
          ))}
        </div>
      </div>

      {visibles.length === 0 ? (
        <p className="sw-vacio">
          {enAlerta.length === 0
            ? "Todo en orden: ningún producto está por debajo de su mínimo."
            : "No hay productos en esta categoría."}
        </p>
      ) : (
        <ul className="sw-lista">
          {visibles.map((p) => {
            const estado = estadoProducto(p);
            const faltan = Math.max(p.stock_minimo - p.cantidad, 0);
            return (
              <li key={p.id} className="sw-alerta">
                <div className="sw-alerta__texto">
                  <p className="sw-alerta__nombre">{p.nombre}</p>
                  <p className="sw-alerta__detalle">{p.categoria}</p>
                </div>
                <span className={`sw-insignia sw-insignia--${estado}`}>{ETIQUETA_ESTADO[estado]}</span>
                <Nivel cantidad={p.cantidad} minimo={p.stock_minimo} estado={estado} />
                <p className="sw-alerta__cifras">
                  {p.cantidad === 0 ? "Sin unidades" : `${numero.format(p.cantidad)} en existencia`}
                  {" · "}mínimo {numero.format(p.stock_minimo)}
                  {faltan > 0 && ` · faltan ${numero.format(faltan)}`}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function Actividad({ movimientos, productos }) {
  const nombres = useMemo(() => new Map(productos.map((p) => [p.id, p.nombre])), [productos]);
  const totales = useMemo(() => resumenMovimientos(movimientos), [movimientos]);
  const recientes = useMemo(
    () => [...movimientos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 6),
    [movimientos]
  );

  return (
    <section className="sw-panel" aria-labelledby="titulo-actividad">
      <div className="sw-panel__cabecera">
        <h2 id="titulo-actividad">Actividad reciente</h2>
      </div>
      <p className="sw-panel__nota">
        {totales.entradas} entradas (+{numero.format(totales.unidadesEntrada)} unidades) y{" "}
        {totales.salidas} salidas (−{numero.format(totales.unidadesSalida)} unidades) en los movimientos registrados.
      </p>
      {recientes.length === 0 ? (
        <p className="sw-vacio">Aún no hay movimientos. Registra una entrada o salida para verla aquí.</p>
      ) : (
        <ul className="sw-lista">
          {recientes.map((m) => (
            <li key={m.id} className="sw-movimiento">
              <div>
                <p className="sw-alerta__nombre">{nombres.get(m.producto_id) ?? "Producto eliminado"}</p>
                <p className="sw-alerta__detalle">{formatearFecha(m.fecha)}</p>
              </div>
              <p className={`sw-movimiento__cantidad sw-movimiento__cantidad--${m.tipo}`}>
                {m.tipo === "entrada" ? "Entrada +" : "Salida −"}
                {numero.format(m.cantidad)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function MasVendidos({ movimientos, productos }) {
  const ranking = useMemo(() => masVendidos(movimientos, productos, 5), [movimientos, productos]);
  const maximo = ranking[0]?.unidades ?? 1;

  return (
    <section className="sw-panel" aria-labelledby="titulo-vendidos">
      <div className="sw-panel__cabecera">
        <h2 id="titulo-vendidos">Más vendidos</h2>
      </div>
      {ranking.length === 0 ? (
        <p className="sw-vacio">Aún no hay salidas registradas.</p>
      ) : (
        <ol className="sw-lista sw-ranking">
          {ranking.map((r) => (
            <li key={r.id} className="sw-ranking__item">
              <div className="sw-ranking__linea">
                <span>{r.nombre}</span>
                <span className="sw-ranking__valor">{numero.format(r.unidades)} unidades</span>
              </div>
              <div className="sw-ranking__barra" aria-hidden="true">
                <div style={{ width: `${(r.unidades / maximo) * 100}%` }} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

/**
 * Dashboard principal de StockWise (Persona 4).
 * Si no recibe datos, usa los de prueba. Con el backend listo:
 *   <Dashboard productos={productos} movimientos={movimientos} />
 */
export default function Dashboard({ productos, movimientos }) {
  const usaDatosDePrueba = !productos || !movimientos;
  const listaProductos = productos ?? productosDemo;
  const listaMovimientos = movimientos ?? movimientosDemo;
  const resumen = useMemo(() => calcularResumen(listaProductos), [listaProductos]);

  return (
    <main className="sw-dashboard">
      <header className="sw-cabecera">
        <div>
          <h1>Resumen del inventario</h1>
          <p>Tu inventario. Bajo control.</p>
        </div>
        {usaDatosDePrueba && <p className="sw-aviso">Mostrando datos de prueba</p>}
      </header>

      <Resumen resumen={resumen} />

      <div className="sw-rejilla">
        <Alertas productos={listaProductos} />
        <div className="sw-columna">
          <Actividad movimientos={listaMovimientos} productos={listaProductos} />
          <MasVendidos movimientos={listaMovimientos} productos={listaProductos} />
        </div>
      </div>
    </main>
  );
}

/* ----------------------------------------------------------------------
   Cuando exista el backend (Express), un ejemplo para conectar los datos:

   import { useEffect, useState } from "react";

   function DashboardConectado() {
     const [productos, setProductos] = useState(null);
     const [movimientos, setMovimientos] = useState(null);

     useEffect(() => {
       fetch("/api/productos").then((r) => r.json()).then(setProductos);
       fetch("/api/movimientos").then((r) => r.json()).then(setMovimientos);
     }, []);

     if (!productos || !movimientos) return <p>Cargando…</p>;
     return <Dashboard productos={productos} movimientos={movimientos} />;
   }
   ---------------------------------------------------------------------- */
