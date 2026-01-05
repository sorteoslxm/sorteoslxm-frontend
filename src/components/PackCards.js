import "./PackCards.css";

export default function PackCards({ packs, onComprar }) {
  if (!packs || packs.length === 0) return null;

  return (
    <div className="packs-container">
      {packs.map(pack => (
        <div
          key={pack.id}
          className={`pack-card ${pack.destacado ? "destacado" : ""}`}
        >
          {pack.destacado && (
            <div className="badge-destacado">🔥 MÁS VENDIDO</div>
          )}

          <h3 className="pack-title">
            {pack.cantidad} {pack.cantidad === 1 ? "Chance" : "Chances"}
          </h3>

          <div className="pack-precio">
            ${pack.precio.toLocaleString("es-AR")}
          </div>

          <button
            className="pack-btn"
            onClick={() => onComprar(pack)}
          >
            Comprar ahora
          </button>
        </div>
      ))}
    </div>
  );
}
