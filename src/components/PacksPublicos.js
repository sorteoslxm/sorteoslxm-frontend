import usePacks from "../hooks/usePacks";

export default function PacksPublicos({ cajaId, onComprar }) {
  const { packs, loading } = usePacks(cajaId);

  if (loading) return <p className="text-gray-400">Cargando packs…</p>;

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {packs
        .sort((a, b) => a.orden - b.orden)
        .map((p) => (
          <div
            key={p._id}
            className={`p-5 rounded-xl border ${
              p.destacado
                ? "border-yellow-400 bg-gradient-to-b from-yellow-400/10 to-black"
                : "border-zinc-700 bg-zinc-900"
            }`}
          >
            {p.destacado && (
              <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded font-bold">
                MÁS VENDIDO
              </span>
            )}

            <h3 className="text-xl font-bold mt-2">{p.nombre}</h3>

            <p className="text-3xl font-extrabold text-yellow-400 my-2">
              ${p.precio}
            </p>

            <p className="text-sm text-gray-300 mb-4">
              🎟 {p.chances} chances
            </p>

            <button
              onClick={() => onComprar(p)}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 rounded"
            >
              Comprar
            </button>
          </div>
        ))}
    </div>
  );
}
