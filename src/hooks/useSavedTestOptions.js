import { useEffect } from "react";
import { API_BASE } from "../config";
import { decrypt } from "../components/Crypto";

export default function useSavedTestOptions(setTestOptions) {
  useEffect(() => {
    const fetchSavedOptions = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/test-options`);
        if (!res.ok) throw new Error("No hay configuración previa");
        const data = await res.json();
        data.passwordWherex = decrypt(data.passwordWherex);
        setTestOptions(data);
      } catch (err) {
        console.log("No se pudo cargar configuración previa:", err);
      }
    };
    fetchSavedOptions();
  }, [setTestOptions]);
}
