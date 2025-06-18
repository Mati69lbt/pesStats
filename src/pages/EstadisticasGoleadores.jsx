// cspell: ignore estadisticas goleadores general local visitante pj goles prom asc desc Ambito Campo Direccion ambitos

import { useEffect, useState } from "react";
import GoleadoresPorCampeonato from "./GoleadoresPorCampeonato";

export default function EstadisticasGoleadores() {
  const [goleadores, setGoleadores] = useState({});
  const [ordenAmbito, setOrdenAmbito] = useState("general");
  const [ordenCampo, setOrdenCampo] = useState("nombre");
  const [ordenDireccion, setOrdenDireccion] = useState("asc");
  const [goleadoresOrdenados, setGoleadoresOrdenados] = useState([]);

  const [partidos, setPartidos] = useState([]);

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem("pesStats") || "{}");
    const partidos = storage.partidos || [];
    setPartidos(partidos);
    const resumen = {};

    partidos.forEach((p) => {
      const ambitos = ["general"];
      if (p.local) ambitos.push("local");
      else ambitos.push("visitante");

      p.goleadores.forEach((g) => {
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

    setGoleadores(resumen);
  }, []);

  useEffect(() => {
    const calcularProm = (g, pj) => (pj > 0 ? g / pj : 0);

    const lista = Object.entries(goleadores).map(([nombre, data]) => ({
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

    setGoleadoresOrdenados(sorted);
  }, [goleadores, ordenAmbito, ordenCampo, ordenDireccion]);

  const calcularPromStr = (g, pj) => (pj > 0 ? (g / pj).toFixed(2) : "0.00");

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        👤 Goleadores del Equipo
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
            {goleadoresOrdenados.map((g) => (
              <tr key={g.nombre}>
                <td className="border px-2 py-1 text-left font-medium">
                  {g.nombre}
                </td>
                <td className="border px-1 py-1 text-center">{g.general.pj}</td>
                <td className="border px-1 py-1 text-center">
                  {g.general.goles}
                </td>
                <td className="border px-1 py-1 text-center">
                  {calcularPromStr(g.general.goles, g.general.pj)}
                </td>
                <td className="border px-1 py-1 text-center">{g.local.pj}</td>
                <td className="border px-1 py-1 text-center">
                  {g.local.goles}
                </td>
                <td className="border px-1 py-1 text-center">
                  {calcularPromStr(g.local.goles, g.local.pj)}
                </td>
                <td className="border px-1 py-1 text-center">
                  {g.visitante.pj}
                </td>
                <td className="border px-1 py-1 text-center">
                  {g.visitante.goles}
                </td>
                <td className="border px-1 py-1 text-center">
                  {calcularPromStr(g.visitante.goles, g.visitante.pj)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <GoleadoresPorCampeonato goleadores={goleadores} partidos={partidos} />
    </div>
  );
}
