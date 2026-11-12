import Dashboard from "./components/Dashboard";
import DashboardConectado from "./components/DashboardConectado";

// Con REACT_APP_USE_API=true (en un archivo .env) se conecta al backend;
// si no, muestra el dashboard con datos de prueba.
const USAR_API = process.env.REACT_APP_USE_API === "true";

function App() {
  return USAR_API ? <DashboardConectado /> : <Dashboard />;
}

export default App;
