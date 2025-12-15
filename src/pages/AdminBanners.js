// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/AdminBanners.js
import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const token = localStorage.getItem("adminToken");

  const fetchBanners = async () => {
    const res = await fetch(`${API_URL}/banners`, {
      headers: { "x-admin-token": token },
    });
    const data = await res.json();
    setBanners(data);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const setPrincipal = async (id) => {
    await fetch(`${API_URL}/banners/${id}/principal`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token,
      },
    });

    fetchBanners();
  };

  const updateOrden = async (id, orden) => {
    await fetch(`${API_URL}/banners/${id}/orden`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token,
      },
      body: JSON.stringify({ orden }),
    });

    fetchBanners();
  };

  const bannerPrincipal = banners.find((b) => b.destacado);
  const bannersSecundarios = banners
    .filter((b) => !b.destacado)
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Administrar Banners</h1>

      {bannerPrincipal && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-3">🥇 Banner principal</h2>
          <img
            src={bannerPrincipal.imagen}
            alt="Banner principal"
            className="w-full max-w-4xl rounded shadow"
          />
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Banners secundarios</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {bannersSecundarios.map((b) => (
            <div
              key={b.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <img
                src={b.imagen}
                alt="banner"
                className="w-full rounded mb-3"
              />

              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setPrincipal(b.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Hacer principal
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-sm">Orden</span>
                  <input
                    type="number"
                    value={b.orden ?? 0}
                    onChange={(e) =>
                      updateOrden(b.id, Number(e.target.value))
                    }
                    className="border rounded px-2 py-1 w-20"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
