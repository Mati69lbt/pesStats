// cspell: ignore Rossi, Supercopa, Andrada, hattrick, Póker, ReactToastify
import { toast } from "react-toastify";
import { useState } from "react";
import { useAutoCompleteList } from "../hooks/useAutoCompleteList";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [partido, setPartido] = useState({
    fecha: "",
    rival: "",
    torneo: "",
    local: true,
    golesFavor: 0,
    golesContra: 0,
    goleadores: [],
    goleadoresRival: [],
    arquero: "Rossi",
    observaciones: "",
  });

  const [nuevoGoleador, setNuevoGoleador] = useState({
    nombre: "",
    cantidad: 1,
    hattrick: false,
    poker: false,
  });
  const [nuevoGoleadorRival, setNuevoGoleadorRival] = useState({
    nombre: "",
    cantidad: 1,
  });

  const [sugerenciasBoca, agregarSugerenciaBoca] =
    useAutoCompleteList("goleadoresBoca");
  const [sugerenciasRival, agregarSugerenciaRival] =
    useAutoCompleteList("goleadoresRival");
  const [sugerenciasRivales, agregarSugerenciaRivalNombre] =
    useAutoCompleteList("rivalesJugados");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setPartido((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleAddGoleador = () => {
    if (nuevoGoleador.nombre.trim() !== "") {
      setPartido((prev) => ({
        ...prev,
        goleadores: [...prev.goleadores, nuevoGoleador],
      }));
      agregarSugerenciaBoca(nuevoGoleador.nombre);
      setNuevoGoleador({
        nombre: "",
        cantidad: 1,
        hattrick: false,
        poker: false,
      });
    }
  };

  const handleAddGoleadorRival = () => {
    if (nuevoGoleadorRival.nombre.trim() !== "") {
      setPartido((prev) => ({
        ...prev,
        goleadoresRival: [...prev.goleadoresRival, nuevoGoleadorRival],
      }));
      agregarSugerenciaRival(nuevoGoleadorRival.nombre);
      setNuevoGoleadorRival({ nombre: "", cantidad: 1 });
    }
  };

  const getStorage = () => JSON.parse(localStorage.getItem("pesStats") || "{}");
  const saveStorage = (data) =>
    localStorage.setItem("pesStats", JSON.stringify(data));

  const handleConfirmGuardar = () => {
    const toastId = toast(
      ({ closeToast }) => (
        <div className="text-sm">
          <p className="mb-2">¿Confirmás guardar este partido?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                guardarPartido(); // ✅ ESTA es la función correcta
                toast.dismiss(toastId);
              }}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Confirmar
            </button>
            <button
              onClick={() => toast.dismiss(toastId)}
              className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    );
  };

  const guardarPartido = () => {
    const storage = getStorage();
    const partidos = storage.partidos || [];
    const nuevaFecha = partido.fecha; // 💾 Guardamos fecha actual

    partidos.push({ ...partido, id: Date.now() });
    saveStorage({ ...storage, partidos });

    agregarSugerenciaRivalNombre(partido.rival);
    toast.success("✅ Partido guardado correctamente");

    setPartido({
      fecha: nuevaFecha,
      rival: "",
      torneo: "",
      local: true,
      golesFavor: 0,
      golesContra: 0,
      goleadores: [],
      goleadoresRival: [],
      arquero: "Rossi",
      observaciones: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleConfirmGuardar();
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Registrar Partido</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 space-y-4"
      >
        <input
          type="date"
          name="fecha"
          value={partido.fecha}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />

        <input
          type="text"
          name="rival"
          list="sugerencias-rivales"
          placeholder="Rival (nombre completo)"
          value={partido.rival}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
        <datalist id="sugerencias-rivales">
          {sugerenciasRivales.map((nombre, i) => (
            <option key={i} value={nombre} />
          ))}
        </datalist>

        <select
          name="torneo"
          value={partido.torneo}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        >
          <option value="">Seleccionar Torneo</option>
          <option value="Supercopa Argentina">Supercopa Argentina</option>
          <option value="Campeonato Argentino">Campeonato Argentino</option>
          <option value="Copa Argentina">Copa Argentina</option>
          <option value="Copa Libertadores">Copa Libertadores</option>
          <option value="Mundial de Clubes">Mundial de Clubes</option>
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="local"
            checked={partido.local}
            onChange={handleChange}
          />
          <span>¿Jugado como local?</span>
        </label>

        <div className="flex gap-2">
          <div className="w-1/2">
            <label className="block font-semibold">
              Goles de Boca {<br />} ({partido.local ? "local" : "visitante"})
            </label>
            <input
              type="number"
              name="golesFavor"
              value={partido.golesFavor}
              onChange={handleChange}
              className="w-full border rounded p-2"
              min="0"
            />
          </div>

          <div className="w-1/2">
            <label className="block font-semibold">
              Goles del Rival {<br />}({partido.local ? "visitante" : "local"})
            </label>
            <input
              type="number"
              name="golesContra"
              value={partido.golesContra}
              onChange={handleChange}
              className="w-full border rounded p-2"
              min="0"
            />
          </div>
        </div>

        {/* GOLEADORES PROPIOS */}
        <div className="bg-gray-50 p-3 rounded border">
          <h2 className="font-semibold mb-2">Goleadores de Boca</h2>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              list="sugerencias-boca"
              placeholder="Apellido"
              value={nuevoGoleador.nombre}
              onChange={(e) =>
                setNuevoGoleador({ ...nuevoGoleador, nombre: e.target.value })
              }
              className="w-1/2 border rounded p-2"
            />
            <datalist id="sugerencias-boca">
              {sugerenciasBoca.map((nombre, i) => (
                <option key={i} value={nombre} />
              ))}
            </datalist>
            <input
              type="number"
              min="1"
              value={nuevoGoleador.cantidad}
              onChange={(e) =>
                setNuevoGoleador({
                  ...nuevoGoleador,
                  cantidad: parseInt(e.target.value),
                })
              }
              className="w-1/4 border rounded p-2"
            />
          </div>
          <div className="flex items-center gap-4 mb-2">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={nuevoGoleador.hattrick}
                onChange={(e) =>
                  setNuevoGoleador({
                    ...nuevoGoleador,
                    hattrick: e.target.checked,
                  })
                }
              />
              Hat-trick
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={nuevoGoleador.poker}
                onChange={(e) =>
                  setNuevoGoleador({
                    ...nuevoGoleador,
                    poker: e.target.checked,
                  })
                }
              />
              Póker
            </label>
            <button
              type="button"
              onClick={handleAddGoleador}
              className="ml-auto text-sm text-blue-600"
            >
              Agregar
            </button>
          </div>
          {partido.goleadores.length > 0 && (
            <ul className="text-sm text-gray-700 ml-1 space-y-1">
              {partido.goleadores.map((g, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span>
                    {g.nombre} x{g.cantidad} {g.hattrick && "🎩"}{" "}
                    {g.poker && "♠️"}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPartido((prev) => ({
                        ...prev,
                        goleadores: prev.goleadores.filter(
                          (_, idx) => idx !== i
                        ),
                      }))
                    }
                    className="text-red-500 text-xs ml-2"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* GOLEADORES RIVAL */}
        <div className="bg-gray-50 p-3 rounded border">
          <h2 className="font-semibold mb-2">Goleadores del Rival</h2>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              list="sugerencias-rival"
              placeholder="Apellido"
              value={nuevoGoleadorRival.nombre}
              onChange={(e) =>
                setNuevoGoleadorRival({
                  ...nuevoGoleadorRival,
                  nombre: e.target.value,
                })
              }
              className="w-1/2 border rounded p-2"
            />
            <datalist id="sugerencias-rival">
              {sugerenciasRival.map((nombre, i) => (
                <option key={i} value={nombre} />
              ))}
            </datalist>
            <input
              type="number"
              min="1"
              value={nuevoGoleadorRival.cantidad}
              onChange={(e) =>
                setNuevoGoleadorRival({
                  ...nuevoGoleadorRival,
                  cantidad: parseInt(e.target.value),
                })
              }
              className="w-1/4 border rounded p-2"
            />
            <button
              type="button"
              onClick={handleAddGoleadorRival}
              className="text-sm text-blue-600"
            >
              Agregar
            </button>
          </div>
          {partido.goleadoresRival.length > 0 && (
            <ul className="text-sm text-gray-700 ml-1 space-y-1">
              {partido.goleadoresRival.map((g, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span>
                    {g.nombre} x{g.cantidad}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPartido((prev) => ({
                        ...prev,
                        goleadoresRival: prev.goleadoresRival.filter(
                          (_, idx) => idx !== i
                        ),
                      }))
                    }
                    className="text-red-500 hover:text-red-700 ml-2"
                    title="Eliminar"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a2 2 0 01-2-2V4a2 2 0 00-2-2h-2a2 2 0 00-2 2v1a2 2 0 01-2 2h10z"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <select
          name="arquero"
          value={partido.arquero}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="Rossi">Rossi</option>
          <option value="Andrada">Andrada</option>
        </select>

        <textarea
          name="observaciones"
          placeholder="Observaciones del partido"
          value={partido.observaciones}
          onChange={handleChange}
          className="w-full border rounded p-2"
          rows="3"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Guardar Partido
        </button>
      </form>
    </div>
  );
}
