import React from "react";

export default function ResultsTable({ results }) {
  const exportToCSV = () => {
    const now = new Date();
    const fechaHora = now.toLocaleString("es-CL", {
      dateStyle: "short",
      timeStyle: "short",
    });
    const fecha = now.toLocaleString("es-CL", {
      dateStyle: "short",
    });

    const urls = results.map((r) => r.url);

    const header = ["Métrica", ...urls];

    const rowRepeticiones = [
      "Repeticiones",
      ...results.map((r) => r.repetitions),
    ];
    const rowDOMContent = [
      "DOMContentLoaded (s)",
      ...results.map((r) =>
        r.domContentLoadedTime !== "-"
          ? r.domContentLoadedTime.toString().replace(".", ",")
          : "-"
      ),
    ];
    const rowLoadTime = [
      "Load Time (s)",
      ...results.map((r) =>
        r.loadTime !== "-" ? r.loadTime.toString().replace(".", ",") : "-"
      ),
    ];
    const rowStatus = [
      "Status",
      ...results.map((r) => (r.repetitions === 0 ? "❌ Falló" : "✅ OK")),
    ];

    const allRows = [
      [`Prueba ejecutada el ${fechaHora}`], // 👈 primera fila
      header,
      rowRepeticiones,
      rowDOMContent,
      rowLoadTime,
      rowStatus,
    ];

    const csvContent =
      allRows.map((row) => row.map((cell) => `"${cell}"`).join(";")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `resultados-${fecha}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-6">
      <h2>Resultados</h2>
      <button onClick={exportToCSV} style={{ marginBottom: "10px" }}>
      <span role="img" aria-label="Exportar CSV">📥</span> Exportar CSV
      </button>

      <table
        className="table table-bordered table-striped mt-3"
        border="1"
        cellPadding="5"
        style={{ width: "100%", marginTop: "10px" }}
      >
        <thead className="table-dark">
          <tr>
            <th>URL</th>
            <th>Repeticiones</th>
            <th>DOMContentLoaded (s)</th>
            <th>Load Time (s)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, index) => (
            <tr key={index}>
              <td>{r.url}</td>
              <td>{r.repetitions}</td>
              <td>{r.domContentLoadedTime}</td>
              <td>{r.loadTime}</td>
              <td style={{ color: r.repetitions === 0 ? "red" : "green" }}>
                {r.repetitions === 0 ? "❌ Falló" : "✅ OK"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
