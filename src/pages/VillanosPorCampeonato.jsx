// cspell: ignore villanos goles prom anio ambitos
import { useEffect, useState } from "react";

export default function VillanosPorCampeonato({ partidos }) {
  console.log("Partidos:", partidos);
  
  const [agrupados, setAgrupados] = useState({});

  useEffect(() => {
    const torneos = {};

    partidos.forEach((p) => {
      const anio = new Date(p.fecha).getFullYear();
      const torneoClave = `${p.torneo} ${anio}`;

      if (!torneos[torneoClave]) torneos[torneoClave] = {};

      (p.goleadoresRival || []).forEach((g) => {
        const nombre = g.nombre?.trim();
        const cantidad = parseInt(g.cantidad) || 1;
        if (!nombre) return;

        if (!torneos[torneoClave][nombre]) {
          torneos[torneoClave][nombre] = {
            general: { pj: 0, goles: 0 },
            local: { pj: 0, goles: 0 },
            visitante: { pj: 0, goles: 0 },
          };
        }

        const ambitos = ["general"];
        if (p.local) {
          ambitos.push("visitante"); // rival fue visitante
        } else {
          ambitos.push("local"); // rival fue local
        }

        ambitos.forEach((amb) => {
          torneos[torneoClave][nombre][amb].pj++;
          torneos[torneoClave][nombre][amb].goles += cantidad;
        });
      });
    });

    setAgrupados(torneos);
  }, [partidos]);

  const calcularProm = (g, pj) => (pj > 0 ? (g / pj).toFixed(2) : "0.00");

  return (
    <div className="mt-10 space-y-10">
      {Object.entries(agrupados)
        .sort(([a], [b]) => {
          const anioA = parseInt(a.split(" ").pop());
          const anioB = parseInt(b.split(" ").pop());
          return anioB - anioA;
        })
        .map(([torneo, jugadores]) => (
          <div key={torneo}>
            <h2 className="text-lg font-bold mb-2 text-center underline">{torneo}</h2>
            <div className="overflow-x-auto text-sm">
              <table className="table-auto border text-sm text-center mx-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th rowSpan={2} className="border px-2 py-1 text-left">
                      Jugador
                    </th>
                    <th colSpan={3} className="border px-2 py-1">
                      General
                    </th>
                    <th colSpan={3} className="border px-2 py-1">
                      Local
                    </th>
                    <th colSpan={3} className="border px-2 py-1">
                      Visitante
                    </th>
                  </tr>
                  <tr className="bg-gray-50">
                    {Array(3)
                      .fill(["PJ", "Goles", "Prom."])
                      .flat()
                      .map((t, i) => (
                        <th
                          key={i}
                          className="border px-1 py-1 w-14 text-center"
                        >
                          {t}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(jugadores)
                    .sort((a, b) => b[1].general.goles - a[1].general.goles)
                    .map(([nombre, stats]) => (
                      <tr key={nombre}>
                        <td className="border px-2 py-1 text-left font-medium">
                          {nombre}
                        </td>
                        <td className="border px-1 py-1">{stats.general.pj}</td>
                        <td className="border px-1 py-1">
                          {stats.general.goles}
                        </td>
                        <td className="border px-1 py-1">
                          {calcularProm(stats.general.goles, stats.general.pj)}
                        </td>
                        <td className="border px-1 py-1">{stats.local.pj}</td>
                        <td className="border px-1 py-1">
                          {stats.local.goles}
                        </td>
                        <td className="border px-1 py-1">
                          {calcularProm(stats.local.goles, stats.local.pj)}
                        </td>
                        <td className="border px-1 py-1">
                          {stats.visitante.pj}
                        </td>
                        <td className="border px-1 py-1">
                          {stats.visitante.goles}
                        </td>
                        <td className="border px-1 py-1">
                          {calcularProm(
                            stats.visitante.goles,
                            stats.visitante.pj
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
    </div>
  );
}
