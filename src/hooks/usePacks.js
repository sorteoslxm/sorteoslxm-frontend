import { useEffect, useState } from "react";
import API_URL from "../config/api";

export default function usePacks(cajaId) {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cajaId) return;

    fetch(`${API_URL}/packs/activos/${cajaId}`)
      .then((r) => r.json())
      .then((data) => setPacks(data || []))
      .finally(() => setLoading(false));
  }, [cajaId]);

  return { packs, loading };
}
