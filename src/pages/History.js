import React from "react";
import ExecutionHistory from "../components/ExecutionHistory";

export default function History() {
  return (
    <div>
      <h2>Historial de Pruebas</h2>
      <ExecutionHistory />
      {results && <ResultsTable results={results} />}
    </div>
  );
}
