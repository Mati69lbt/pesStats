// cspell: ignore: pes, stats, campeonatos, goleadores, villanos, mostrarConfirmacionReset
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Navbar() {
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const linkClass = (path) =>
    `block px-4 py-2 rounded hover:bg-blue-100 transition ${
      location.pathname === path ? "font-bold text-blue-700" : "text-gray-700"
    }`;

  const mostrarConfirmacionReset = () => {
    toast.info(
      <div className="text-center">
        <p className="mb-2">¿Estás seguro de borrar todos los partidos?</p>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              localStorage.removeItem("pesStats");
              toast.dismiss();

              toast.success("Datos borrados correctamente", {
                position: "top-center",
                autoClose: 2000,
              });

              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }}
            className="bg-red-600 text-white px-2 py-1 text-sm rounded"
          >
            Sí, borrar
          </button>

          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-300 px-2 py-1 text-sm rounded"
          >
            Cancelar
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, toastId: "confirm-reset" }
    );
  };

  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-xl font-bold text-blue-600">⚽ PES Stats</span>

        {/* Menú hamburguesa en móvil */}
        <button
          className="md:hidden text-gray-700 text-xl"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* Menú links en escritorio */}
        <div className="hidden md:flex space-x-2 text-sm">
          <Link to="/" className={linkClass("/")}>
            🏠 Inicio
          </Link>
          <Link to="/equipo" className={linkClass("/equipo")}>
            📊 Equipo
          </Link>
          <Link to="/campeonatos" className={linkClass("/campeonatos")}>
            🏆 Campeonatos
          </Link>
          <Link to="/goleadores" className={linkClass("/goleadores")}>
            ⚽ Goleadores
          </Link>
          <Link to="/villanos" className={linkClass("/villanos")}>
            😈 Villanos
          </Link>
          <button
            onClick={mostrarConfirmacionReset}
            className="text-red-600 hover:underline"
          >
            🗑️ Reiniciar
          </button>
        </div>
      </div>

      {/* Menú desplegable en móvil */}
      {menuAbierto && (
        <div className="md:hidden px-4 pb-4 space-y-1 text-sm">
          <Link
            to="/"
            className={linkClass("/")}
            onClick={() => setMenuAbierto(false)}
          >
            🏠 Inicio
          </Link>
          <Link
            to="/equipo"
            className={linkClass("/equipo")}
            onClick={() => setMenuAbierto(false)}
          >
            📊 Equipo
          </Link>
          <Link
            to="/campeonatos"
            className={linkClass("/campeonatos")}
            onClick={() => setMenuAbierto(false)}
          >
            🏆 Campeonatos
          </Link>
          <Link
            to="/jugadores"
            className={linkClass("/jugadores")}
            onClick={() => setMenuAbierto(false)}
          >
            👤 Jugadores
          </Link>
          <Link
            to="/goleadores"
            className={linkClass("/goleadores")}
            onClick={() => setMenuAbierto(false)}
          >
            ⚽ Goleadores
          </Link>
          <Link
            to="/villanos"
            className={linkClass("/villanos")}
            onClick={() => setMenuAbierto(false)}
          >
            😈 Villanos
          </Link>
          <button
            onClick={() => {
              setMenuAbierto(false);
              mostrarConfirmacionReset();
            }}
            className="text-red-600 hover:underline"
          >
            🗑️ Reiniciar
          </button>
        </div>
      )}
    </nav>
  );
}
