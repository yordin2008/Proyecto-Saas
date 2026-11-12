import { render, screen } from "@testing-library/react";
import App from "./App";

test("muestra el resumen del inventario", () => {
  render(<App />);
  expect(screen.getByText(/Resumen del inventario/i)).toBeInTheDocument();
});
