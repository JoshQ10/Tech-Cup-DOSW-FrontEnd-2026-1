import { Sidebar, Topbar, LogoutModal, PantallaEnConstruccion, useDashboard } from './Dashboard';

export default function Calendario() {
  const { userName, userPhoto, loading, showLogoutModal, setShowLogoutModal, confirmLogout } = useDashboard();

  return (
    <div className="flex h-screen w-full overflow-hidden relative" style={{ background: '#000F20' }}>
      {showLogoutModal && <LogoutModal onConfirm={confirmLogout} onCancel={() => setShowLogoutModal(false)} />}
      <Sidebar active="calendario" onLogout={() => setShowLogoutModal(true)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar userName={loading ? '...' : userName} userPhoto={userPhoto} />
        <PantallaEnConstruccion titulo="Calendario" />
      </div>
    </div>
  );
}