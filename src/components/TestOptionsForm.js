import React from "react";
import { crypto } from "./Crypto";

export default function TestOptionsForm({ testOptions, setTestOptions }) {
  const handleUserTestChange = (index, field, value) => {
    const updated = [...testOptions.userTests];
    updated[index][field] =
      field === "purchaseBidId" ? parseInt(value, 10) || "" : value;
    setTestOptions({ ...testOptions, userTests: updated });
  };

  const addUserTest = () => {
    setTestOptions({
      ...testOptions,
      userTests: [
        ...testOptions.userTests,
        { userPersonify: "", purchaseBidId: "" },
      ],
    });
  };

  const removeUserTest = (index) => {
    const updated = [...testOptions.userTests];
    updated.splice(index, 1);
    setTestOptions({ ...testOptions, userTests: updated });
  };

  return (
    <div className="mb-4">
      <label style={{ display: "block", marginTop: "0.5rem" }}>
        Usuario Wherex:
      </label>
      <input
        type="text"
        value={testOptions.userWherex}
        onChange={(e) =>
          setTestOptions({ ...testOptions, userWherex: e.target.value })
        }
      />

      <label style={{ display: "block", marginTop: "0.5rem" }}>
        Contraseña Wherex:
      </label>
      <input
        type="password"
        value={testOptions.passwordWherex}
        onChange={(e) =>
          setTestOptions({ ...testOptions, passwordWherex: e.target.value })
        }
      />

      <label style={{ display: "block", marginTop: "0.5rem" }}>
        Repeticiones:
      </label>
      <input
        type="number"
        value={testOptions.repetitions ?? ""}
        min={1}
        onChange={(e) => {
          const value = e.target.value;
          setTestOptions({
            ...testOptions,
            repetitions: value === "" ? "" : parseInt(value, 10),
          });
        }}
      />

      <label style={{ display: "block", marginTop: "0.5rem" }}>
        Considerar primera prueba:
      </label>
      <input
        type="checkbox"
        checked={testOptions.considerFirstTest}
        onChange={(e) =>
          setTestOptions({
            ...testOptions,
            considerFirstTest: e.target.checked,
          })
        }
      />

      <h5>Usuarios a personificar e ID de licitación</h5>

      {testOptions.userTests.map((pair, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            marginBottom: "0.75rem",
          }}
        >
          <div style={{ flex: 1 }}>
            <label style={{ display: "block" }}>Usuario #{index + 1}</label>
            <input
              type="text"
              value={pair.userPersonify}
              onChange={(e) =>
                handleUserTestChange(index, "userPersonify", e.target.value)
              }
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: "block" }}>
              ID de Licitación #{index + 1}
            </label>
            <input
              type="number"
              value={pair.purchaseBidId}
              onChange={(e) =>
                handleUserTestChange(index, "purchaseBidId", e.target.value)
              }
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: "block" }}>
              Tipo de empresa #{index + 1}
            </label>
            <select
              value={pair.type}
              onChange={(e) =>
                handleUserTestChange(index, "type", e.target.value)
              }
              style={{ width: "100%" }}
            >
              <option value="">Seleccione...</option>
              <option value="buyer">Comprador</option>
              <option value="supplier">Proveedor</option>
            </select>
          </div>

          {testOptions.userTests.length > 1 && (
            <button
              type="button"
              onClick={() => removeUserTest(index)}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                color: "red",
                cursor: "pointer",
                marginTop: "1.5rem",
              }}
              title="Eliminar este par"
            >
              🗑️
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addUserTest}
        className="btn btn-secondary"
        style={{ marginTop: "0.5rem" }}
      >
        + Agregar par Usuario/Licitación
      </button>
    </div>
  );
}
