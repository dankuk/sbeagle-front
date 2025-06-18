import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../config";

const initialForm = {
  label: "",
  url: "",
  evaluate: true,
  evaluateClick: false,
  idButton: "",
  active: true,
  type: "buyer",
  order: undefined,
};

const PAGE_SIZE = 10;

const UrlConfig = () => {
  const [urls, setUrls] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("order");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/test-urls`);
      setUrls(res.data);
    } catch (err) {
      console.error("Error al cargar URLs:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta URL?")) return;
    try {
      await axios.delete(`${API_BASE}/api/test-urls/${id}`);
      fetchUrls();
    } catch (err) {
      alert("Error al eliminar URL");
      console.error(err);
    }
  };

  const handleEdit = (url) => {
    setForm({ ...initialForm, ...url, order: url.order || 1 });
    setIsEditing(true);
    setEditingId(url._id);
  };

  const handleSubmit = async (e) => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_BASE}/api/test-urls/${editingId}`, form);
      } else {
        await axios.post(`${API_BASE}/api/test-urls`, form);
      }
      setForm(initialForm);
      setIsEditing(false);
      setEditingId(null);
      fetchUrls();
    } catch (err) {
      alert("Error al guardar");
      console.error(err);
    }
  };

  const validateForm = () => {
    if (!form.label.trim()) return "La etiqueta es obligatoria";
    if (!form.url.trim()) return "La URL es obligatoria";
    try {
      new URL(form.url);
    } catch {
      return "La URL no es válida";
    }
    if (!["buyer", "supplier"].includes(form.type)) {
      return "Tipo no válido";
    }
    return null;
  };

  const filtered = urls.filter((url) => {
    const matchText =
      url.label.toLowerCase().includes(search.toLowerCase()) ||
      url.url.toLowerCase().includes(search.toLowerCase()) ||
      (url.idButton || "").toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || url.type === filterType;
    return matchText && matchType;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "order") return a.order - b.order;
    if (sortBy === "label") return a.label.localeCompare(b.label);
    return 0;
  });

  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);

  return (
    <div className="container mt-4">
      <h2>Listado de URLs configuradas</h2>
      <form
        onSubmit={handleSubmit}
        className="mb-4 border p-3 rounded bg-light"
      >
        <h5>{isEditing ? "✏️ Editar URL" : "➕ Nueva URL"}</h5>
        <div className="row">
          <div className="col-md-2 mb-2">
            <input
              type="number"
              className="form-control"
              placeholder="Orden"
              value={form.order}
              required
              min="1"
              onChange={(e) => setForm({ ...form, order: +e.target.value })}
            />
          </div>
          <div className="col-md-3 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Etiqueta"
              value={form.label}
              required
              onChange={(e) => setForm({ ...form, label: e.target.value })}
            />
          </div>
          <div className="col-md-3 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="URL"
              value={form.url}
              required
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
          </div>
          <div className="col-md-2 mb-2">
            <select
              className="form-control"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="buyer">buyer</option>
              <option value="supplier">supplier</option>
              <option value="system">system</option>
            </select>
          </div>
          <div className="col-md-2 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="ID botón (opcional)"
              value={form.idButton}
              onChange={(e) => setForm({ ...form, idButton: e.target.value })}
            />
          </div>
          <div className="col-md-2 mb-2 d-flex align-items-center gap-2">
            <label>Evalúa</label>
            <input
              type="checkbox"
              checked={form.evaluate}
              onChange={(e) => setForm({ ...form, evaluate: e.target.checked })}
            />
            <label>Click</label>
            <input
              type="checkbox"
              checked={form.evaluateClick}
              onChange={(e) =>
                setForm({ ...form, evaluateClick: e.target.checked })
              }
            />
            <label>Activo</label>
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
          </div>
        </div>
        <button className="btn btn-primary mt-2" type="submit">
          {isEditing ? "💾 Guardar cambios" : "📥 Agregar"}
        </button>
      </form>

      <button className="btn btn-success mb-3" onClick={() => {
        setForm(initialForm);
        setIsEditing(false);
        setEditingId(null);
      }}>
        ➕ Agregar nueva URL
      </button>

      <div className="d-flex gap-3 mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Buscar por texto..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          className="form-select w-25"
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">Todos los tipos</option>
          <option value="buyer">Buyer</option>
          <option value="supplier">Supplier</option>
          <option value="system">System</option>
        </select>
        <select
          className="form-select w-25"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="order">Orden (ascendente)</option>
          <option value="label">Etiqueta (A-Z)</option>
        </select>
      </div>

      <table className="table table-bordered table-sm">
        <thead>
          <tr>
            <th>Orden</th>
            <th>Etiqueta</th>
            <th>Tipo</th>
            <th>URL</th>
            <th>Evalúa</th>
            <th>Click</th>
            <th>ID Botón</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((url) => (
            <tr key={url._id}>
              <td>{url.order}</td>
              <td>{url.label}</td>
              <td>{url.type}</td>
              <td>{url.url}</td>
              <td>{url.evaluate ? "✅" : "❌"}</td>
              <td>{url.evaluateClick ? "✅" : "❌"}</td>
              <td>{url.idButton || "-"}</td>
              <td>{url.active ? "✅" : "❌"}</td>
              <td>
                <button className="btn btn-sm me-2" onClick={() => handleEdit(url)}>✏️</button>
                <button className="btn btn-sm" onClick={() => handleDelete(url._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center">
        <span>
          Página {page} de {totalPages}
        </span>
        <div className="btn-group">
          <button className="btn btn-outline-secondary" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </button>
          <button className="btn btn-outline-secondary" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default UrlConfig;
