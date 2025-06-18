import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TestOptionsForm from "../components/TestOptionsForm";

import {
  executeMeasure,
  saveOptions,
} from "../components/ExecutionTakingMeasures";
import useElapsedTimer from "../hooks/useElapsedTimer";
import useSavedTestOptions from "../hooks/useSavedTestOptions";

// tu lógica anterior de medición iría aquí
export default function Home() {
  const [testOptions, setTestOptions] = useState({
    userWherex: "",
    passwordWherex: "",
    repetitions: 3,
    considerFirstTest: false,
    userTests: [{ userPersonify: "", purchaseBidId: "", type: "" }],
  });

  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const elapsed = useElapsedTimer(isLoading);
  useSavedTestOptions(setTestOptions);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const navigate = useNavigate(); 

  const handleMeasure = async () => {
    setIsLoading(true);
    try {
      const data = await executeMeasure(testOptions);
      setResults(data.results);
    } catch (err) {
      console.error("Error ejecutando la medición:", err);
      alert(err.message || "Ocurrió un error durante la prueba.");
    } finally {
      setIsLoading(false);
      alert("✅ Prueba completada correctamente");
      navigate("/history");
    }
  };

  return (
    <div>
      <h1 className="mb-4">SBeagle - Performance Tester</h1>
      <TestOptionsForm
        testOptions={testOptions}
        setTestOptions={setTestOptions}
      />
      <button
        className="btn btn-outline-success"
        style={{ marginLeft: "1rem" }}
        disabled={isLoading}
        onClick={async () => {
          try {
            await saveOptions(testOptions);
            alert("Configuración guardada correctamente");
          } catch (err) {
            alert(err.message || "Error al guardar configuración");
            console.error(err);
          }
        }}
      >
        💾 Guardar configuración
      </button>
      <button
        disabled={isLoading}
        className="btn btn-primary"
        onClick={handleMeasure}
      >
        {isLoading ? "Ejecutando prueba..." : "Ejecutar prueba"}
      </button>
      {isLoading && (
        <div style={{ marginTop: "10px", fontStyle: "italic", color: "blue" }}>
          <img
            src="https://i.imgur.com/llF5iyg.gif"
            alt="Cargando..."
            width="32"
          />
          <p>
            Ejecutando prueba... por favor espera - tiempo transcurrido:{" "}
            {formatTime(elapsed)}
          </p>
        </div>
      )}
    </div>
  );
}
