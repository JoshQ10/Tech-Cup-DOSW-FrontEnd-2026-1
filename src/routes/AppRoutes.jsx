import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Register from '../pages/Register';
import PerfilDeportivo from '../pages/PerfilDeportivo';
import PerfilDeportivoUser from '../pages/PerfilDeportivoUser';
import Dashboard from '../pages/Dashboard';
import Calendario from '../pages/Calendario';
import Invitaciones from '../pages/Invitaciones';
import Reglamento from '../pages/Reglamento';
import TablaPosiciones from '../pages/TablaPosiciones';
import Llaves from '../pages/Llaves';
import Torneo from '../pages/Torneo';
import OAuth2Callback from '../pages/OAuth2Callback';
import GestionEquipoPage from '../pages/capitan/GestionEquipoPage';
import GestionTorneoPage from '../pages/administrador/GestionTorneoPage';
import RegistrarResultadosPage from '../pages/arbitro/RegistrarResultadosPage';
import GestionPartidosPage from '../pages/organizador/GestionPartidosPage';

function AppRoutes() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/iniciar-sesion" element={<Login />} />
          <Route path="/seleccionar-rol" element={<Home />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/perfil-deportivo" element={<PerfilDeportivo />} />
          <Route path="/perfil-deportivo-user" element={<PerfilDeportivoUser />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/invitaciones" element={<Invitaciones />} />
          <Route path="/reglamento" element={<Reglamento />} />
          <Route path="/tabla" element={<TablaPosiciones />} />
          <Route path="/llaves" element={<Llaves />} />
          <Route path="/torneo" element={<Torneo />} />

          {/* Capitán */}
          <Route path="/capitan/mi-equipo" element={<GestionEquipoPage />} />

          {/* Administrador */}
          <Route path="/admin/gestion-torneo" element={<GestionTorneoPage />} />

          {/* Árbitro */}
          <Route path="/arbitro/mis-partidos" element={<RegistrarResultadosPage />} />

          {/* Organizador */}
          <Route path="/organizador/gestion" element={<GestionPartidosPage />} />

          {/* Callback de OAuth2 — el backend redirige aquí tras autenticar con Google */}
          <Route path="/oauth2/callback" element={<OAuth2Callback />} />
        </Routes>
      </BrowserRouter>
  );
}

export default AppRoutes;
