// src/components/ExecutionTakingMeasures.js

import { API_BASE, SECRET_KEY } from "../config";
import { encrypt } from "./Crypto";

/**
 * Guarda la configuración sin validar (usado en botón 💾)
 */
export async function saveOptions(payload) {
  const cleanedPayload = { ...payload };
  delete cleanedPayload._id;
  delete cleanedPayload.__v;

  if (cleanedPayload.passwordWherex) {
    cleanedPayload.passwordWherex = encrypt(cleanedPayload.passwordWherex);
  }

  const res = await fetch(`${API_BASE}/api/test-options`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-seed-token": SECRET_KEY,
    },
    body: JSON.stringify(cleanedPayload),
  });

  if (!res.ok) {
    throw new Error("Error al guardar configuración");
  }

  return res.json();
}

/**
 * Ejecuta la prueba validando los datos
 */
export async function executeMeasure(payload) {
  const {
    userWherex,
    passwordWherex,
    repetitions,
    considerFirstTest,
    userTests,
  } = payload;

  if (!userWherex || !passwordWherex) {
    throw new Error("Debes ingresar el usuario y contraseña de Wherex.");
  }

  const hasInvalidType = userTests.some(
    (test) =>
      !test.type || (test.type !== "buyer" && test.type !== "supplier")
  );

  if (hasInvalidType) {
    throw new Error(
      "Todos los pares deben tener un tipo de empresa (buyer o supplier)."
    );
  }

  const cleanedPayload = {
    userWherex,
    passwordWherex: encrypt(passwordWherex),
    repetitions,
    considerFirstTest,
    userTests,
  };

  const res = await fetch(`${API_BASE}/api/measure`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-seed-token": SECRET_KEY,
    },
    body: JSON.stringify(cleanedPayload),
  });

  if (!res.ok) {
    throw new Error("Error ejecutando la medición");
  }

  return res.json();
}
