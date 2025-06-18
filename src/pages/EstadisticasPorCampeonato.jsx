// cspell: ignore EstadisticasPorCampeonato andrada rossi anio seccion
import { useEffect, useState } from "react";

export default function EstadisticasPorCampeonato() {
  const [agrupados, setAgrupados] = useState({});

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem("pesStats") || "{}");
    const lista = storage.partidos || [];
    const torneos = {};

    lista.forEach((p) => {
      const anio = new Date(p.fecha).getFullYear();
      const clave = `${p.torneo} ${anio}`;
      const r = p.rival;
      const local = p.local;
      const arquero = p.arquero?.toLowerCase();
      const gf = parseInt(p.golesFavor) || 0;
      const gc = parseInt(p.golesContra) || 0;
      const resultado = gf > gc ? "g" : gf === gc ? "e" : "p";

      if (!torneos[clave]) torneos[clave] = {};
      if (!torneos[clave][r]) {
        torneos[clave][r] = {
          general: { pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 },
          local: { pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 },
          visitante: { pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 },
          rossi: { pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 },
          andrada: { pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 },
        };
      }

      const actualizar = (seccion) => {
        seccion.pj++;
        seccion[resultado]++;
        seccion.gf += gf;
        seccion.gc += gc;
      };

      const stats = torneos[clave][r];
      actualizar(stats.general);
      actualizar(stats[local ? "local" : "visitante"]);
      if (arquero === "rossi" || arquero === "andrada") {
        actualizar(stats[arquero]);
      }
    });

    setAgrupados(torneos);
  }, []);

  const formatearResumen = ({ pj, g, e, p, gf, gc }) => {
    if (pj === 0) return "";
    return `🏆 ${g} G – ${e} E – ${p} P\n📊 ${pj} PJ – ${gf} GF – ${gc} GC`;
  };

  const torneosOrdenados = Object.entries(agrupados).sort((a, b) => {
    const anioA = parseInt(a[0].split(" ").pop());
    const anioB = parseInt(b[0].split(" ").pop());
    return anioB - anioA; // Más reciente primero
  });

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        🏆 Estadísticas por Campeonato
      </h1>

      {torneosOrdenados.map(([nombreTorneo, equipos]) => (
        <div key={nombreTorneo} className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-center underline">
            {nombreTorneo}
          </h2>
          <div className="overflow-x-auto">
            <table className="table-auto  border text-sm mb-6 mx-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-1 text-left">Rival</th>
                  <th className="border px-2 py-1 text-left">General</th>
                  <th className="border px-2 py-1 text-left">Local</th>
                  <th className="border px-2 py-1 text-left">Visitante</th>
                  <th className="border px-2 py-1 text-left">Rossi</th>
                  <th className="border px-2 py-1 text-left">Andrada</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(equipos)
                  .sort((a, b) => a[0].localeCompare(b[0]))
                  .map(([rival, stats]) => (
                    <tr key={rival}>
                      <td className="border px-3 py-1 font-semibold whitespace-nowrap text-left">
                        {rival}
                      </td>
                      <td className="border px-2 py-1 whitespace-pre-line text-left">
                        {formatearResumen(stats.general)}
                      </td>
                      <td className="border px-2 py-1 whitespace-pre-line text-left">
                        {formatearResumen(stats.local)}
                      </td>
                      <td className="border px-2 py-1 whitespace-pre-line text-left">
                        {formatearResumen(stats.visitante)}
                      </td>
                      <td className="border px-2 py-1 whitespace-pre-line text-left">
                        {formatearResumen(stats.rossi)}
                      </td>
                      <td className="border px-2 py-1 whitespace-pre-line text-left">
                        {formatearResumen(stats.andrada)}
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
