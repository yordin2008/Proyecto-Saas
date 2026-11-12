// Lógica pura del dashboard: no depende de React ni de la fuente de datos.
// Así funciona igual con datos de prueba o con la respuesta del backend.

/** "agotado" (0 unidades), "bajo" (en o por debajo del mínimo) u "ok". */
export function estadoProducto(producto) {
  if (producto.cantidad <= 0) return "agotado";
  if (producto.cantidad <= producto.stock_minimo) return "bajo";
  return "ok";
}

export function calcularResumen(productos) {
  return productos.reduce(
    (acc, p) => {
      const estado = estadoProducto(p);
      acc.totalProductos += 1;
      acc.totalUnidades += p.cantidad;
      if (estado === "agotado") acc.agotados += 1;
      if (estado === "bajo") acc.bajos += 1;
      return acc;
    },
    { totalProductos: 0, totalUnidades: 0, agotados: 0, bajos: 0 }
  );
}

/** Productos agotados o con poco stock; primero los agotados y los más críticos. */
export function productosEnAlerta(productos) {
  const proporcion = (p) => p.cantidad / Math.max(p.stock_minimo, 1);
  return productos
    .filter((p) => estadoProducto(p) !== "ok")
    .sort((a, b) => proporcion(a) - proporcion(b));
}

/** Suma las salidas por producto y devuelve las n con más unidades. */
export function masVendidos(movimientos, productos, n = 5) {
  const nombres = new Map(productos.map((p) => [p.id, p.nombre]));
  const totales = new Map();
  for (const m of movimientos) {
    if (m.tipo !== "salida") continue;
    totales.set(m.producto_id, (totales.get(m.producto_id) ?? 0) + m.cantidad);
  }
  return [...totales.entries()]
    .map(([id, unidades]) => ({ id, nombre: nombres.get(id) ?? "Producto eliminado", unidades }))
    .sort((a, b) => b.unidades - a.unidades)
    .slice(0, n);
}

export function resumenMovimientos(movimientos) {
  const base = { entradas: 0, salidas: 0, unidadesEntrada: 0, unidadesSalida: 0 };
  return movimientos.reduce((acc, m) => {
    if (m.tipo === "entrada") {
      acc.entradas += 1;
      acc.unidadesEntrada += m.cantidad;
    } else {
      acc.salidas += 1;
      acc.unidadesSalida += m.cantidad;
    }
    return acc;
  }, base);
}
