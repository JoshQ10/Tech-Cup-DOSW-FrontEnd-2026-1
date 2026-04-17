import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';
import { useAuthContext } from '../store/AuthContext';
import { getRoleDashboard } from './rolePaths';

import WelcomePage from '../pages/auth/WelcomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';
import RoleSelectionPage from '../pages/auth/RoleSelectionPage';

import JugadorDashboard from '../pages/jugador/JugadorDashboard';
import PerfilDeportivoPage from '../pages/jugador/PerfilDeportivoPage';
import InvitacionesPage from '../pages/jugador/InvitacionesPage';
import MisPartidosPage from '../pages/jugador/MisPartidosPage';

import CapitanDashboard from '../pages/capitan/CapitanDashboard';
import GestionEquipoPage from '../pages/capitan/GestionEquipoPage';
import InvitarJugadoresPage from '../pages/capitan/InvitarJugadoresPage';

import AdminDashboard from '../pages/administrador/AdminDashboard';
import GestionTorneoPage from '../pages/administrador/GestionTorneoPage';
import GestionEquiposPage from '../pages/administrador/GestionEquiposPage';
import GestionPartidosPage from '../pages/administrador/GestionPartidosPage';

import ArbitroDashboard from '../pages/arbitro/ArbitroDashboard';
import DetallePartidoArbitroPage from '../pages/arbitro/DetallePartidoArbitroPage';
import RegistrarResultadosPage from '../pages/arbitro/RegistrarResultadosPage';
import RegistrarGolesPage from '../pages/arbitro/RegistrarGolesPage';
import RegistrarTarjetasPage from '../pages/arbitro/RegistrarTarjetasPage';
import RegistrarDominacionPage from '../pages/arbitro/RegistrarDominacionPage';

import OrganizadorDashboard from '../pages/organizador/OrganizadorDashboard';
import CalendarioPage from '../pages/organizador/CalendarioPage';
import GestionPartidosOrgPage from '../pages/organizador/GestionPartidosOrgPage';

import TorneoPage from '../pages/shared/TorneoPage';
import TablaPosicionesPage from '../pages/shared/TablaPosicionesPage';
import Llaves from '../pages/Llaves';
import ReglamentoPage from '../pages/shared/ReglamentoPage';
import OAuth2CallbackPage from '../pages/shared/OAuth2CallbackPage';

function RoleHomeRedirect() {
  const { role } = useAuthContext();
  if (!role) return <Navigate to="/select-role" replace />;
  return <Navigate to={getRoleDashboard(role)} replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Publicas */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />

        {/* Alias legados */}
        <Route path="/iniciar-sesion" element={<Navigate to="/login" replace />} />
        <Route path="/registro" element={<Navigate to="/register" replace />} />
        <Route path="/seleccionar-rol" element={<Navigate to="/select-role" replace />} />
        <Route path="/dashboard" element={<RoleHomeRedirect />} />
        <Route path="/torneo" element={<Navigate to="/jugador/torneo" replace />} />
        <Route path="/tabla" element={<Navigate to="/jugador/tabla-posiciones" replace />} />
        <Route path="/llaves" element={<Navigate to="/jugador/llaves" replace />} />
        <Route path="/reglamento" element={<Navigate to="/jugador/reglamento" replace />} />

        {/* Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/select-role" element={<RoleSelectionPage />} />

          {/* Jugador */}
          <Route element={<RoleBasedRoute allowedRoles={['JUGADOR']} />}>
            <Route path="/jugador/home" element={<JugadorDashboard />} />
            <Route path="/jugador/perfil-deportivo" element={<PerfilDeportivoPage />} />
            <Route path="/jugador/invitaciones" element={<InvitacionesPage />} />
            <Route path="/jugador/mis-partidos" element={<MisPartidosPage />} />
            <Route path="/jugador/torneo" element={<TorneoPage />} />
            <Route path="/jugador/tabla-posiciones" element={<TablaPosicionesPage />} />
            <Route path="/jugador/llaves" element={<Llaves />} />
            <Route path="/jugador/reglamento" element={<ReglamentoPage />} />
          </Route>

          {/* Capitan */}
          <Route element={<RoleBasedRoute allowedRoles={['CAPITAN']} />}>
            <Route path="/capitan/home" element={<CapitanDashboard />} />
            <Route path="/capitan/equipo" element={<GestionEquipoPage />} />
            <Route path="/capitan/invitar-jugadores" element={<InvitarJugadoresPage />} />
            <Route path="/capitan/mis-partidos" element={<MisPartidosPage />} />
            <Route path="/capitan/torneo" element={<TorneoPage />} />
          </Route>

          {/* Administrador */}
          <Route element={<RoleBasedRoute allowedRoles={['ADMINISTRADOR']} />}>
            <Route path="/admin/home" element={<AdminDashboard />} />
            <Route path="/admin/torneo" element={<GestionTorneoPage />} />
            <Route path="/admin/equipos" element={<GestionEquiposPage />} />
            <Route path="/admin/partidos" element={<GestionPartidosPage />} />
            <Route path="/admin/resultados" element={<RegistrarResultadosPage />} />
          </Route>

          {/* Arbitro */}
          <Route element={<RoleBasedRoute allowedRoles={['ARBITRO']} />}>
            <Route path="/arbitro/home" element={<ArbitroDashboard />} />
            <Route path="/arbitro/partido/:matchId" element={<DetallePartidoArbitroPage />} />
            <Route path="/arbitro/registrar-goles" element={<RegistrarGolesPage />} />
            <Route path="/arbitro/registrar-tarjetas" element={<RegistrarTarjetasPage />} />
            <Route path="/arbitro/dominacion" element={<RegistrarDominacionPage />} />
          </Route>

          {/* Organizador */}
          <Route element={<RoleBasedRoute allowedRoles={['ORGANIZADOR']} />}>
            <Route path="/organizador/home" element={<OrganizadorDashboard />} />
            <Route path="/organizador/calendario" element={<CalendarioPage />} />
            <Route path="/organizador/partidos" element={<GestionPartidosOrgPage />} />
            <Route path="/organizador/torneo" element={<TorneoPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
