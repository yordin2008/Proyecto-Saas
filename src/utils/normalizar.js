// El backend (Express + base de datos) puede devolver números como texto
// ("42") o campos nulos. Se normaliza aquí para que el dashboard no falle.

const aNumero = (valor, porDefecto = 0) => {
  const n = Number(valor);
  return Number.isFinite(n) ? n : porDefecto;
};

export function normalizarProductos(lista) {
  if (!Array.isArray(lista)) return [];
  return lista.map((p) => ({
    ...p,
    id: p.id,
    nombre: p.nombre ?? "Sin nombre",
    categoria: p.categoria ?? "Sin categoría",
    cantidad: aNumero(p.cantidad),
    stock_minimo: aNumero(p.stock_minimo),
    precio: aNumero(p.precio),
  }));
}

export function normalizarMovimientos(lista) {
  if (!Array.isArray(lista)) return [];
  return lista.map((m) => ({
    ...m,
    tipo: String(m.tipo ?? "").toLowerCase() === "entrada" ? "entrada" : "salida",
    cantidad: aNumero(m.cantidad),
  }));
}
