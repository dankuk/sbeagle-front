import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from "./pages/Home";
import ExecutionHistory from "./components/ExecutionHistory";
import UrlConfig from "./pages/UrlConfig"; // página que crearás para configurar URLs

export default function WrappedApp() {
  return (
    <Router>
      <nav style={{ display: "flex", gap: "1rem", padding: "1rem", background: "#eee" }}>
        <Link to="/">🏠 Inicio</Link>
        <Link to="/history">📊 Histórico</Link>
        <Link to="/config-urls">⚙️ Configurar URLs</Link>
      </nav>
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<ExecutionHistory />} />
          <Route path="/config-urls" element={<UrlConfig />} />
        </Routes>
      </div>
    </Router>
  );
}
