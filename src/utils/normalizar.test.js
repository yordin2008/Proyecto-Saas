import { normalizarProductos, normalizarMovimientos } from "./normalizar.js";

test("normalizarProductos convierte textos a número", () => {
  const [p] = normalizarProductos([
    { id: 1, nombre: "A", categoria: "X", cantidad: "42", stock_minimo: "10", precio: "3500.50" },
  ]);
  expect(p.cantidad).toBe(42);
  expect(p.stock_minimo).toBe(10);
  expect(p.precio).toBe(3500.5);
});

test("normalizarProductos rellena nulos y valores inválidos", () => {
  const [p] = normalizarProductos([{ id: 2, nombre: null, categoria: null, cantidad: null, stock_minimo: "abc" }]);
  expect(p.nombre).toBe("Sin nombre");
  expect(p.categoria).toBe("Sin categoría");
  expect(p.cantidad).toBe(0);
  expect(p.stock_minimo).toBe(0);
});

test("normalizarProductos: si no llega una lista devuelve []", () => {
  expect(normalizarProductos(null)).toEqual([]);
  expect(normalizarProductos({ error: "x" })).toEqual([]);
});

test("normalizarMovimientos acepta ENTRADA en mayúsculas", () => {
  const [m] = normalizarMovimientos([{ id: 1, producto_id: 1, tipo: "ENTRADA", cantidad: "5" }]);
  expect(m.tipo).toBe("entrada");
  expect(m.cantidad).toBe(5);
});
