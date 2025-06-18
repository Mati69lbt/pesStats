// cspell: ignore Estadisticas
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Navbar from "../components/Navbar";
import EstadisticasEquipo from "../pages/EstadisticasEquipo";
import EstadisticasPorCampeonato from "../pages/EstadisticasPorCampeonato";
import EstadisticasGoleadores from "../pages/EstadisticasGoleadores";
import EstadisticasVillanos from "../pages/EstadisticasVillanos";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equipo" element={<EstadisticasEquipo />} />
          <Route path="/campeonatos" element={<EstadisticasPorCampeonato />} />
          <Route path="/goleadores" element={<EstadisticasGoleadores />} />
          <Route path="/villanos" element={<EstadisticasVillanos />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
