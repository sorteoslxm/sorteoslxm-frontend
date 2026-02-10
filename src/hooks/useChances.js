import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "https://sorteoslxm-frontend.onrender.com";

export default function useChances(sorteoId) {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sorteoId) return;

    const fetchPacks = async () => {
      try {
        const res = await fetch(
          `${API_URL}/packs?sorteoId=${sorteoId}`
        );

        const data = await res.json();
        setPacks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando packs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPacks();
  }, [sorteoId]);

  return { packs, loading };
}
