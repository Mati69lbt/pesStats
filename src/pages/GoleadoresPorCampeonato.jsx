// cspell: ignore GoleadoresPorCampeonato anio clave ambitos
export default function GoleadoresPorCampeonato({ partidos }) {
  const torneos = {};

  partidos.forEach((p) => {
    const anio = new Date(p.fecha).getFullYear();
    const clave = `${p.torneo} ${anio}`;
    const ambitos = ["general"];
    if (p.local) ambitos.push("local");
    else ambitos.push("visitante");

    if (!torneos[clave]) torneos[clave] = {};

    p.goleadores.forEach((g) => {
      const nombre = g.nombre?.toString().trim();
      const cantidad = parseInt(g.cantidad) || 1;
      if (!nombre) return;

      if (!torneos[clave][nombre]) {
        torneos[clave][nombre] = {
          general: { pj: 0, goles: 0 },
          local: { pj: 0, goles: 0 },
          visitante: { pj: 0, goles: 0 },
        };
      }

      ambitos.forEach((amb) => {
        torneos[clave][nombre][amb].pj++;
        torneos[clave][nombre][amb].goles += cantidad;
      });
    });
  });

  const calcularProm = (g, pj) => (pj > 0 ? (g / pj).toFixed(2) : "0.00");

  return (
    <div className="mt-10 space-y-10 ">
      {Object.entries(torneos)
        .sort(([a], [b]) => {
          const anioA = parseInt(a.split(" ").pop());
          const anioB = parseInt(b.split(" ").pop());
          return anioB - anioA;
        })
        .map(([torneo, jugadores]) => (
          <div key={torneo}>
            <h2 className="text-lg font-bold mb-2 text-center underline">
              {torneo}
            </h2>
            <div className="overflow-x-auto text-sm flex justify-center">
              <table className="table-auto border text-sm text-center">
                <thead>
                  <tr className="bg-gray-100">
                    <th rowSpan={2} className="border px-2 py-1 text-left">
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
                    {[
                      "PJ",
                      "Goles",
                      "Prom.",
                      "PJ",
                      "Goles",
                      "Prom.",
                      "PJ",
                      "Goles",
                      "Prom.",
                    ].map((t, i) => (
                      <th key={i} className="border px-1 py-1 w-14 text-center">
                        {t}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(jugadores)
                    .sort(
                      ([a], [b]) => b[1]?.general?.goles - a[1]?.general?.goles
                    )
                    .map(([nombre, stats]) => (
                      <tr key={nombre}>
                        <td className="border px-2 py-1 text-left font-medium">
                          {nombre}
                        </td>
                        {["general", "local", "visitante"].flatMap((amb) => {
                          const pj = stats[amb]?.pj || 0;
                          const goles = stats[amb]?.goles || 0;
                          return [
                            <td key={`${amb}-pj`} className="border px-1 py-1">
                              {pj}
                            </td>,
                            <td
                              key={`${amb}-goles`}
                              className="border px-1 py-1"
                            >
                              {goles}
                            </td>,
                            <td
                              key={`${amb}-prom`}
                              className="border px-1 py-1"
                            >
                              {calcularProm(goles, pj)}
                            </td>,
                          ];
                        })}
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
