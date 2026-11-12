import {
  estadoProducto,
  calcularResumen,
  productosEnAlerta,
  masVendidos,
  resumenMovimientos,
} from "./inventario.js";
import { productosDemo, movimientosDemo } from "../data/datosPrueba.js";

test("estadoProducto: agotado, bajo y ok", () => {
  expect(estadoProducto({ cantidad: 0, stock_minimo: 5 })).toBe("agotado");
  expect(estadoProducto({ cantidad: 3, stock_minimo: 5 })).toBe("bajo");
  expect(estadoProducto({ cantidad: 6, stock_minimo: 5 })).toBe("ok");
});

test("estadoProducto: en el mínimo exacto cuenta como bajo", () => {
  expect(estadoProducto({ cantidad: 5, stock_minimo: 5 })).toBe("bajo");
});

test("estadoProducto: cantidad negativa se trata como agotado", () => {
  expect(estadoProducto({ cantidad: -2, stock_minimo: 5 })).toBe("agotado");
});

test("calcularResumen con datos de prueba", () => {
  const r = calcularResumen(productosDemo);
  expect(r.totalProductos).toBe(10);
  expect(r.totalUnidades).toBe(178);
  expect(r.agotados).toBe(2);
  expect(r.bajos).toBe(3);
});

test("calcularResumen con lista vacía", () => {
  expect(calcularResumen([])).toEqual({
    totalProductos: 0,
    totalUnidades: 0,
    agotados: 0,
    bajos: 0,
  });
});

test("productosEnAlerta: solo alertas, agotados primero", () => {
  const alertas = productosEnAlerta(productosDemo);
  expect(alertas.length).toBe(5);
  expect(alertas.every((p) => estadoProducto(p) !== "ok")).toBe(true);
  expect(alertas.slice(0, 2).map((p) => p.cantidad)).toEqual([0, 0]);
});

test("productosEnAlerta: stock_minimo 0 no produce NaN", () => {
  const lista = [{ id: 1, cantidad: 0, stock_minimo: 0 }];
  expect(productosEnAlerta(lista).length).toBe(1);
});

test("masVendidos: suma salidas, ignora entradas y ordena", () => {
  const ranking = masVendidos(movimientosDemo, productosDemo, 3);
  expect(ranking.length).toBe(3);
  expect(ranking[0].nombre).toBe("Cuaderno argollado 100 hojas");
  expect(ranking[0].unidades).toBe(14);
  expect(ranking[0].unidades >= ranking[1].unidades).toBe(true);
});

test("masVendidos: producto eliminado conserva el movimiento", () => {
  const movs = [{ id: 1, producto_id: 99, tipo: "salida", cantidad: 4, fecha: "2026-11-01" }];
  const ranking = masVendidos(movs, productosDemo);
  expect(ranking[0].nombre).toBe("Producto eliminado");
});

test("resumenMovimientos cuenta entradas y salidas", () => {
  const r = resumenMovimientos(movimientosDemo);
  expect(r.entradas).toBe(3);
  expect(r.salidas).toBe(9);
  expect(r.unidadesEntrada).toBe(95);
  expect(r.unidadesSalida).toBe(66);
});
