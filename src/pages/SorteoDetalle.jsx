import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SorteoDetalle() {
  const { id } = useParams();
  const [sorteo, setSorteo] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      const res = await fetch(`/api/sorteos/${id}`);
      const data = await res.json();
      setSorteo(data);
    };
    cargar();
  }, [id]);

  if (!sorteo) return <div className="p-4 text-center">Cargando...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <img
        src={sorteo.imagen}
        alt={sorteo.titulo}
        className="w-full rounded-xl mb-4"
      />

      <h1 className="text-3xl font-bold mb-2">{sorteo.titulo}</h1>

      <p className="text-lg mb-4">{sorteo.descripcion}</p>

      <p className="text-xl font-semibold mb-4">
        Precio: ${sorteo.precio}
      </p>

      <button
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold w-full text-xl"
        onClick={() => alert("MercadoPago va acá")}
      >
        Comprar
      </button>
    </div>
  );
}
