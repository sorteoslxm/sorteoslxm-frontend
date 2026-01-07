// FILE: src/pages/CajaDetalle.js
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API_URL from "../config/api";
import PacksPublicos from "../components/PacksPublicos";

export default function CajaDetalle() {
  const { slug } = useParams();

  const [caja, setCaja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =============================
     LOAD CAJA
  ============================== */
  useEffect(() => {
    const loadCaja = async () => {
      try {
        const res = await fetch(`${API_URL}/cajas/${slug}`);
        if (!res.ok) throw new Error("Caja no encontrada");
        const data = await res.json();
        setCaja(data);
      } catch (err) {
        console.error(err);
        setError("Caja no encontrada");
      } finally {
        setLoading(false);
      }
    };

    if (slug) loadCaja();
  }, [slug]);

  /* =============================
     DERIVED DATA (HOOK SAFE)
  ============================== */

  const premioMayor = useMemo(
    () => caja?.premios?.find((p) => p.esMayor),
    [caja]
  );

  const premiosSecundarios = useMemo(
    () => caja?.premios?.filter((p) => !p.esMayor) || [],
    [caja]
  );

  const totalCajas = Number(caja?.cajasTotales || 0);
  const vendidas = Number(caja?.cajasVendidas || 0);
  const restantes = Math.max(totalCajas - vendidas, 0);

  const porcentajeRestante = useMemo(() => {
    if (!totalCajas) return 100;
    return Math.round((restantes / totalCajas) * 100);
  }, [restantes, totalCajas]);

  const estadoEscasez = useMemo(() => {
    if (porcentajeRestante <= 5) return "ULTIMAS";
    if (porcentajeRestante <= 25) return "ESCACES";
    return "NORMAL";
  }, [porcentajeRestante]);

  const ctaTexto = useMemo(() => {
    if (estadoEscasez === "ULTIMAS") return "Entrar ahora";
    if (estadoEscasez === "ESCACES") return "Asegurar mi caja";
    return "Abrir caja ahora";
  }, [estadoEscasez]);

  const ctaClasses = useMemo(
    () => `
      w-full py-4 rounded-xl font-extrabold text-lg
      transition-all duration-300
      ${
        estadoEscasez === "ULTIMAS"
          ? "bg-red-600 text-white animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.7)]"
          : estadoEscasez === "ESCACES"
          ? "bg-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.6)]"
          : "bg-green-500 text-black"
      }
      hover:scale-[1.02] active:scale-[0.97]
    `,
    [estadoEscasez]
  );

  /* =============================
     RETURNS (AL FINAL)
  ============================== */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Cargando caja…
      </div>
    );
  }

  if (error || !caja) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error || "Error cargando la caja"}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-10"
      style={{
        background:
          "radial-gradient(circle at top, #1e1b4b 0%, #020617 65%)",
      }}
    >
      <div className="max-w-6xl mx-auto space-y-12">
        <Link
          to="/cajas"
          className="inline-block text-yellow-400 text-sm hover:underline"
        >
          ← Volver a cajas
        </Link>

        {/* HERO */}
        <div className="relative rounded-3xl p-8 border border-yellow-500/40 bg-gradient-to-b from-yellow-400/20 to-yellow-900/40 shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-300 mb-4">
            {caja.nombre}
          </h1>

          <div className="max-w-md">
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>Disponibilidad</span>
              <span>{porcentajeRestante}%</span>
            </div>

            <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  estadoEscasez === "ULTIMAS"
                    ? "bg-red-500"
                    : estadoEscasez === "ESCACES"
                    ? "bg-yellow-400"
                    : "bg-green-500"
                }`}
                style={{ width: `${porcentajeRestante}%` }}
              />
            </div>
          </div>
        </div>

        {/* PREMIO MAYOR */}
        {premioMayor && (
          <div className="rounded-3xl p-8 border border-yellow-500/40 bg-gradient-to-r from-yellow-500/20 to-black shadow-xl">
            <h2 className="text-2xl font-extrabold text-yellow-400 mb-2">
              🏆 Premio Mayor
            </h2>

            <p className="text-4xl font-black text-white mb-4">
              ${Number(premioMayor.monto).toLocaleString()}
            </p>

            <p className="text-sm leading-relaxed">
              <span className="font-bold text-white">
                Jugá con una chance o con varias. 🍀
              </span>
              <br />
              <span className="font-bold text-yellow-400">
                El premio mayor puede ser tuyo.
              </span>
              <br />
              <span className="font-bold text-white">
                La suerte arranca cuando participás.
              </span>
            </p>
          </div>
        )}

        {/* PREMIOS SECUNDARIOS */}
        {premiosSecundarios.length > 0 && (
          <div className="rounded-3xl p-8 border border-zinc-700 bg-zinc-900 shadow-xl">
            <h3 className="text-xl font-extrabold text-white mb-4">
              🎁 Premios importantes aún sin salir
            </h3>

            <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-200">
              {premiosSecundarios.map((p, i) => (
                <li
                  key={i}
                  className="flex justify-between bg-black/40 p-3 rounded-lg"
                >
                  <span>{p.nombre}</span>
                  <span className="font-bold text-yellow-400">
                    ${Number(p.monto).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA */}
        <div className="rounded-3xl p-8 bg-black/60 border border-zinc-700 shadow-xl text-center space-y-4">
          <p className="text-gray-300 text-sm">
            Comprás la caja y ves el resultado al instante.
          </p>

          <button className={ctaClasses}>{ctaTexto}</button>
        </div>

        {/* PACKS */}
        <PacksPublicos
          cajaId={caja.id}
          onComprar={(pack) => {
            console.log("Comprar pack:", pack);
          }}
        />
      </div>
    </div>
  );
}
