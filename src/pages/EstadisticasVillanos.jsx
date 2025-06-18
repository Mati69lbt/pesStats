// cspell: ignore EstadisticasVillanos VillanosPorCampeonato partidos goles prom anio ambitos Ambito Direccion
import { useEffect, useState } from "react";
import VillanosPorCampeonato from "./VillanosPorCampeonato";

export default function EstadisticasVillanos() {
  const [villanos, setVillanos] = useState({});
  const [ordenAmbito, setOrdenAmbito] = useState("general");
  const [ordenCampo, setOrdenCampo] = useState("nombre");
  const [ordenDireccion, setOrdenDireccion] = useState("asc");
  const [villanosOrdenados, setVillanosOrdenados] = useState([]);
  const [partidos, setPartidos] = useState([]);

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem("pesStats") || "{}");
    const lista = storage.partidos || [];
    setPartidos(lista);

    const resumen = {};

    lista.forEach((p) => {
      const ambitos = ["general"];
      if (p.local) ambitos.push("visitante");
      else ambitos.push("local");

      p.goleadoresRival.forEach((g) => {
        const nombre = g.nombre?.toString().trim();
        const cantidad = parseInt(g.cantidad) || 1;
        if (!nombre) return;

        if (!resumen[nombre]) {
          resumen[nombre] = {
            general: { pj: 0, goles: 0 },
            local: { pj: 0, goles: 0 },
            visitante: { pj: 0, goles: 0 },
          };
        }

        ambitos.forEach((amb) => {
          resumen[nombre][amb].pj++;
          resumen[nombre][amb].goles += cantidad;
        });
      });
    });

    setVillanos(resumen);
  }, []);

  useEffect(() => {
    const calcularProm = (g, pj) => (pj > 0 ? g / pj : 0);

    const lista = Object.entries(villanos).map(([nombre, data]) => ({
      nombre,
      general: {
        ...data.general,
        prom: calcularProm(data.general.goles, data.general.pj),
      },
      local: {
        ...data.local,
        prom: calcularProm(data.local.goles, data.local.pj),
      },
      visitante: {
        ...data.visitante,
        prom: calcularProm(data.visitante.goles, data.visitante.pj),
      },
    }));

    const sorted = lista.sort((a, b) => {
      let valA, valB;
      if (ordenCampo === "nombre") {
        valA = a.nombre.toLowerCase();
        valB = b.nombre.toLowerCase();
        return ordenDireccion === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        valA = a[ordenAmbito][ordenCampo];
        valB = b[ordenAmbito][ordenCampo];
        return ordenDireccion === "asc" ? valA - valB : valB - valA;
      }
    });

    setVillanosOrdenados(sorted);
  }, [villanos, ordenAmbito, ordenCampo, ordenDireccion]);

  const calcularPromStr = (g, pj) => (pj > 0 ? (g / pj).toFixed(2) : "0.00");

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        🧟 Goleadores Rivales (Villanos)
      </h1>

      <div className="flex flex-wrap gap-4 mb-6 items-end text-sm justify-center">
        <div>
          <label className="text-sm font-medium block">Ámbito</label>
          <select
            value={ordenAmbito}
            onChange={(e) => setOrdenAmbito(e.target.value)}
            className="border p-1 rounded text-sm"
          >
            <option value="general">General</option>
            <option value="local">Local</option>
            <option value="visitante">Visitante</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium block">Campo</label>
          <select
            value={ordenCampo}
            onChange={(e) => setOrdenCampo(e.target.value)}
            className="border p-1 rounded text-sm"
          >
            <option value="nombre">Nombre</option>
            <option value="pj">PJ</option>
            <option value="goles">Goles</option>
            <option value="prom">Promedio</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium block">Orden</label>
          <select
            value={ordenDireccion}
            onChange={(e) => setOrdenDireccion(e.target.value)}
            className="border p-1 rounded text-sm"
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto text-sm">
        <table className="table-auto border-collapse border mx-auto text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th rowSpan={2} className="border px-2 py-1 text-center">
                Jugador
              </th>
              <th colSpan={3} className="border px-2 py-1 text-center">
                General
              </th>
              <th colSpan={3} className="border px-2 py-1 text-center">
                Local
              </th>
              <th colSpan={3} className="border px-2 py-1 text-center">
                Visitante
              </th>
            </tr>
            <tr className="bg-gray-50">
              {["PJ", "Goles", "Prom."].map((t, i) => (
                <th key={i} className="border px-1 py-1 w-14 text-center">
                  {t}
                </th>
              ))}
              {["PJ", "Goles", "Prom."].map((t, i) => (
                <th key={i + 3} className="border px-1 py-1 w-14 text-center">
                  {t}
                </th>
              ))}
              {["PJ", "Goles", "Prom."].map((t, i) => (
                <th key={i + 6} className="border px-1 py-1 w-14 text-center">
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {villanosOrdenados.map((v) => (
              <tr key={v.nombre}>
                <td className="border px-2 py-1 text-left font-medium">
                  {v.nombre}
                </td>
                <td className="border px-1 py-1 text-center">{v.general.pj}</td>
                <td className="border px-1 py-1 text-center">
                  {v.general.goles}
                </td>
                <td className="border px-1 py-1 text-center">
                  {calcularPromStr(v.general.goles, v.general.pj)}
                </td>
                <td className="border px-1 py-1 text-center">{v.local.pj}</td>
                <td className="border px-1 py-1 text-center">
                  {v.local.goles}
                </td>
                <td className="border px-1 py-1 text-center">
                  {calcularPromStr(v.local.goles, v.local.pj)}
                </td>
                <td className="border px-1 py-1 text-center">
                  {v.visitante.pj}
                </td>
                <td className="border px-1 py-1 text-center">
                  {v.visitante.goles}
                </td>
                <td className="border px-1 py-1 text-center">
                  {calcularPromStr(v.visitante.goles, v.visitante.pj)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <VillanosPorCampeonato partidos={partidos} />
    </div>
  );
}
