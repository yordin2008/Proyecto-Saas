// Datos de prueba para trabajar sin backend.
// Cuando la API de Express esté lista, se reemplazan por la respuesta real
// (ver el comentario al final de components/Dashboard.jsx).
//
// Campos acordados (confírmalos con Danna y con la Persona 3):
//   producto:   id, nombre, categoria, cantidad, stock_minimo, precio
//   movimiento: id, producto_id, tipo ("entrada" | "salida"), cantidad, fecha

export const productosDemo = [
  { id: 1, nombre: "Camiseta básica blanca", categoria: "Ropa", cantidad: 42, stock_minimo: 15, precio: 35000 },
  { id: 2, nombre: "Jean clásico azul", categoria: "Ropa", cantidad: 6, stock_minimo: 10, precio: 95000 },
  { id: 3, nombre: "Gorra negra", categoria: "Accesorios", cantidad: 0, stock_minimo: 8, precio: 28000 },
  { id: 4, nombre: "Cuaderno argollado 100 hojas", categoria: "Papelería", cantidad: 58, stock_minimo: 20, precio: 7500 },
  { id: 5, nombre: "Esfero azul (caja x12)", categoria: "Papelería", cantidad: 4, stock_minimo: 12, precio: 14000 },
  { id: 6, nombre: "Resaltadores x4", categoria: "Papelería", cantidad: 0, stock_minimo: 10, precio: 12000 },
  { id: 7, nombre: "Sudadera gris", categoria: "Ropa", cantidad: 19, stock_minimo: 8, precio: 78000 },
  { id: 8, nombre: "Mochila escolar", categoria: "Accesorios", cantidad: 9, stock_minimo: 6, precio: 85000 },
  { id: 9, nombre: "Block de dibujo", categoria: "Papelería", cantidad: 7, stock_minimo: 10, precio: 9500 },
  { id: 10, nombre: "Medias deportivas (par)", categoria: "Ropa", cantidad: 33, stock_minimo: 12, precio: 9000 },
];

export const movimientosDemo = [
  { id: 1, producto_id: 4, tipo: "salida", cantidad: 14, fecha: "2026-11-11T10:20:00" },
  { id: 2, producto_id: 1, tipo: "salida", cantidad: 9, fecha: "2026-11-11T09:05:00" },
  { id: 3, producto_id: 10, tipo: "entrada", cantidad: 40, fecha: "2026-11-10T16:40:00" },
  { id: 4, producto_id: 5, tipo: "salida", cantidad: 8, fecha: "2026-11-10T14:10:00" },
  { id: 5, producto_id: 2, tipo: "salida", cantidad: 5, fecha: "2026-11-10T11:30:00" },
  { id: 6, producto_id: 3, tipo: "salida", cantidad: 6, fecha: "2026-11-09T17:15:00" },
  { id: 7, producto_id: 1, tipo: "entrada", cantidad: 30, fecha: "2026-11-09T09:00:00" },
  { id: 8, producto_id: 10, tipo: "salida", cantidad: 7, fecha: "2026-11-08T15:25:00" },
  { id: 9, producto_id: 6, tipo: "salida", cantidad: 10, fecha: "2026-11-08T12:00:00" },
  { id: 10, producto_id: 4, tipo: "entrada", cantidad: 25, fecha: "2026-11-07T08:45:00" },
  { id: 11, producto_id: 7, tipo: "salida", cantidad: 3, fecha: "2026-11-07T13:20:00" },
  { id: 12, producto_id: 9, tipo: "salida", cantidad: 4, fecha: "2026-11-06T10:10:00" },
];
