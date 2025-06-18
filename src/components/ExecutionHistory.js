// ExecutionHistory.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";

const PAGE_SIZE = 10;

const ExecutionHistory = () => {
  const [executions, setExecutions] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedExecution, setSelectedExecution] = useState(null);
  const [allLabels, setAllLabels] = useState([]);
  const [groupedTests, setGroupedTests] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchExecutions = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/executions`);
        setExecutions(res.data || []);
      } catch (err) {
        console.error("Error al cargar el historial:", err);
      }
    };
    fetchExecutions();
  }, []);

  const filteredExecutions = executions.filter((exec) => {
    const fecha = new Date(exec.executedAt).toLocaleString();
    const searchTarget = `
      ${fecha} ${exec.tests?.map((t) => `${t.userPersonify} ${t.type} ${t.purchaseBidId}`).join(" ")}
    `.toLowerCase();

    const matchesText = searchTarget.includes(searchText.toLowerCase());
    const matchesDate = !filterDate || new Date(exec.executedAt).toISOString().slice(0, 10) === filterDate;

    return matchesText && matchesDate;
  });

  const paginated = filteredExecutions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filteredExecutions.length / PAGE_SIZE);

  const fetchDetail = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/api/executions/${id}`);
      const exec = res.data;
      const labelSet = new Set();
      const grouped = new Map();
      const urlRes = await axios.get(`${API_BASE}/api/test-urls`);
      const labelMetaMap = new Map();

      urlRes.data.forEach((u) => {
        if (u.label && u.type && typeof u.order === 'number') {
          labelMetaMap.set(u.label, { type: u.type, order: u.order });
        }
      });

      exec.tests.forEach((test) => {
        const key = `${test.userPersonify}||${test.type}||${test.purchaseBidId}`;
        if (!grouped.has(key)) {
          grouped.set(key, {
            Usuario: test.userPersonify,
            Tipo: test.type,
            Licitacion: test.purchaseBidId,
            dom: {},
            load: {},
          });
        }
        test.metrics?.forEach((m) => {
          if (!m.label) return;
          labelSet.add(m.label);
          grouped.get(key).dom[m.label] = m.domContentLoadedTime ?? "-";
          grouped.get(key).load[m.label] = m.loadTime ?? "-";
        });
      });

      const buyer = [];
      const supplier = [];
      const others = [];

      labelSet.forEach((label) => {
        const meta = labelMetaMap.get(label);
        if (!meta) return;
        const entry = { label, order: meta.order };
        if (meta.type === "buyer") buyer.push(entry);
        else if (meta.type === "supplier") supplier.push(entry);
        else others.push(entry);
      });

      buyer.sort((a, b) => a.order - b.order);
      supplier.sort((a, b) => a.order - b.order);
      others.sort((a, b) => a.order - b.order);

      const allLabelsOrdered = [...buyer, ...supplier, ...others].map((x) => x.label);
      setAllLabels(allLabelsOrdered);

      setGroupedTests(Array.from(grouped.values()));
      setSelectedExecution(exec);
    } catch (err) {
      console.error("Error al cargar detalles:", err);
    }
  };

  const getCellStyle = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return {};
    const max = 25;
    const clamped = Math.min(num, max);
    const percent = clamped / max;
    const r = Math.round(25 + percent * (255 - 25));
    const g = Math.round(183 - percent * 150);
    const b = Math.round(70 - percent * 50);
    return {
      backgroundColor: `rgb(${r},${g},${b})`,
      color: percent > 0.6 ? "#000" : "#fff",
    };
  };

  return (
    <div className="mt-5">
      <h3>Historial de ejecuciones</h3>

      <div className="d-flex gap-3 mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por texto"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(1);
          }}
        />
        <input
          type="date"
          className="form-control"
          value={filterDate}
          onChange={(e) => {
            setFilterDate(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {selectedExecution && (
        <div className="mb-4 border p-3 bg-light">
          <h5>
            Detalle de ejecución - {new Date(selectedExecution.executedAt).toLocaleString()}
          </h5>
          <div className="table-responsive">
            <table className="table table-bordered" style={{ tableLayout: "fixed", width: "max-content" }}>
              <thead>
                <tr>
                  <th style={{ position: "sticky", left: 0, background: "#fff", zIndex: 2 }}>Usuario</th>
                  <th style={{ position: "sticky", left: 120, background: "#fff", zIndex: 2 }}>Tipo</th>
                  <th style={{ position: "sticky", left: 200, background: "#fff", zIndex: 2 }}>Licitación</th>
                  {allLabels.map((label) => (
                    <th key={`dom-${label}`}>{label} (DOM)</th>
                  ))}
                  {allLabels.map((label) => (
                    <th key={`load-${label}`}>{label} (LOAD)</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groupedTests.map((g, idx) => (
                  <tr key={idx}>
                    <td style={{ position: "sticky", left: 0, background: "#fff", zIndex: 1 }}>{g.Usuario}</td>
                    <td style={{ position: "sticky", left: 120, background: "#fff", zIndex: 1 }}>{g.Tipo}</td>
                    <td style={{ position: "sticky", left: 200, background: "#fff", zIndex: 1 }}>{g.Licitacion}</td>
                    {allLabels.map((label) => (
                      <td key={`domv-${label}`} style={getCellStyle(g.dom[label])}>{g.dom[label] ?? "-"}</td>
                    ))}
                    {allLabels.map((label) => (
                      <td key={`loadv-${label}`} style={getCellStyle(g.load[label])}>{g.load[label] ?? "-"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Usuario</th>
            <th>Total Tests</th>
            <th>Total URLs</th>
            <th>Descargar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((exec) => {
            const totalUrls = exec.tests?.length || 0;
            const uniqueUsers = [...new Set(exec.tests?.map((t) => t.userPersonify))].join(", ");
            return (
              <tr key={exec._id} onClick={() => fetchDetail(exec._id)} style={{ cursor: "pointer" }}>
                <td>{new Date(exec.executedAt).toLocaleString()}</td>
                <td>{uniqueUsers}</td>
                <td>{exec.tests?.length}</td>
                <td>
                  {exec.tests?.reduce((acc, test) => acc + (test.metrics ? 1 : 0), 0)}
                </td>
                <td>
                  <a
                    href={`${API_BASE}/api/export-executions/${exec._id}/export-data`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    Excel Data
                  </a>
                  <a
                    href={`${API_BASE}/api/export-executions/${exec._id}/export-excel`}
                    className="btn btn-sm btn-outline-primary mt-1"
                  >
                    Excel Reporte
                  </a>
                </td>
                <td>
                  <button
                    className="btn btn-sm"
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (window.confirm("¿Estás seguro de que quieres eliminar este registro?")) {
                        try {
                          await axios.delete(`${API_BASE}/api/executions/${exec._id}/delete`);
                          setExecutions((prev) => prev.filter((e) => e._id !== exec._id));
                        } catch (err) {
                          alert("Error al eliminar ejecución");
                          console.error(err);
                        }
                      }
                    }}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center">
        <span>
          Página {page} de {totalPages}
        </span>
        <div className="btn-group">
          <button
            className="btn btn-outline-secondary"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Anterior
          </button>
          <button
            className="btn btn-outline-secondary"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecutionHistory;
