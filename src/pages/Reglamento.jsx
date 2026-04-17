import { useEffect, useMemo, useState } from 'react';
import { Sidebar, Topbar, LogoutModal, useDashboard } from './Dashboard';
import robotArbitro from '../assets/robots/robot arbitro.png';
import {
  confirmarLecturaReglamento,
  downloadReglamentoPdf,
  getReglamento,
  getToken,
} from '../services/api';

const READ_STORAGE_KEY = 'reglamento-read-confirmed';

const fallbackReglamento = {
  title: 'Reglamento Oficial del Torneo',
  content:
    'No fue posible cargar el reglamento desde el servidor en este momento.\\n\\n' +
    'Intenta recargar esta pantalla o comunicate con el organizador del torneo para validar el estado del servicio.',
  pdfUrl: '',
};

const normalizeContentLines = (text) => {
  return String(text || '')
    .replace(/\r\n/g, '\n')
    .split('\n');
};

const fileNameFromHeaders = (headers) => {
  const disposition = headers.get('content-disposition') || '';
  const match = disposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
  const encodedName = match?.[1] || match?.[2];
  return encodedName ? decodeURIComponent(encodedName) : 'reglamento.pdf';
};

export default function Reglamento() {
  const {
    userName,
    userPhoto,
    fullName,
    userRole,
    loading,
    showLogoutModal,
    setShowLogoutModal,
    confirmLogout,
  } = useDashboard();

  const [reglamento, setReglamento] = useState(fallbackReglamento);
  const [loadingReglamento, setLoadingReglamento] = useState(true);
  const [reglamentoError, setReglamentoError] = useState('');
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [confirmingRead, setConfirmingRead] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [lecturaConfirmada, setLecturaConfirmada] = useState(
    localStorage.getItem(READ_STORAGE_KEY) === 'true'
  );

  const lines = useMemo(() => normalizeContentLines(reglamento.content), [reglamento.content]);

  useEffect(() => {
    let isMounted = true;

    const fetchReglamento = async () => {
      setLoadingReglamento(true);
      setReglamentoError('');
      try {
        const data = await getReglamento();
        if (!isMounted) return;
        setReglamento({
          title: data.title || fallbackReglamento.title,
          content: data.content || fallbackReglamento.content,
          pdfUrl: data.pdfUrl || '',
        });
      } catch (error) {
        if (!isMounted) return;
        setReglamento(fallbackReglamento);
        setReglamentoError('No se pudo obtener el reglamento desde el backend.');
      } finally {
        if (isMounted) setLoadingReglamento(false);
      }
    };

    fetchReglamento();
    return () => {
      isMounted = false;
    };
  }, []);

  const triggerDownload = async (blob, filename = 'reglamento.pdf') => {
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(downloadUrl);
  };

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    setReglamentoError('');

    try {
      if (reglamento.pdfUrl) {
        const response = await fetch(reglamento.pdfUrl, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (response.ok) {
          const blob = await response.blob();
          await triggerDownload(blob, fileNameFromHeaders(response.headers));
          return;
        }

        // Fallback para backends con descarga por cookie/sesión
        window.open(reglamento.pdfUrl, '_blank', 'noopener,noreferrer');
        return;
      }

      const blob = await downloadReglamentoPdf();
      await triggerDownload(blob);
    } catch (error) {
      setReglamentoError('No se pudo descargar el PDF del reglamento.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleConfirmRead = async () => {
    setConfirmingRead(true);
    setConfirmMessage('');

    try {
      await confirmarLecturaReglamento();
      localStorage.setItem(READ_STORAGE_KEY, 'true');
      setLecturaConfirmada(true);
      setConfirmMessage('Lectura confirmada correctamente.');
    } catch (error) {
      setConfirmMessage('No se pudo confirmar la lectura en este momento.');
    } finally {
      setConfirmingRead(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden relative" style={{ background: '#000F20' }}>
      {showLogoutModal && (
        <LogoutModal onConfirm={confirmLogout} onCancel={() => setShowLogoutModal(false)} />
      )}

      <Sidebar
        active="reglamento"
        onLogout={() => setShowLogoutModal(true)}
        reglamentoPendiente={!lecturaConfirmada}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          userName={loading ? '...' : userName}
          userPhoto={userPhoto}
          fullName={fullName}
          userRole={userRole}
          onLogout={() => setShowLogoutModal(true)}
        />

        <div className="flex-1 overflow-y-auto px-6 py-5 md:px-8 md:py-6">
          <div
            className="w-full h-full rounded-xl p-4 md:p-6"
            style={{
              background:
                'linear-gradient(135deg, rgba(1, 18, 45, 0.95) 0%, rgba(0, 15, 32, 0.96) 50%, rgba(30, 33, 40, 0.85) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1.3fr] gap-6 h-full">
              <section className="flex flex-col min-h-[520px]">
                <h2
                  className="text-white text-4xl uppercase mb-4"
                  style={{ fontFamily: "'Anton SC', sans-serif" }}
                >
                  Reglas
                </h2>

                <div
                  className="relative flex-1 min-h-[440px] p-4 md:p-5 overflow-y-auto"
                  style={{
                    background: '#E6E6E6',
                    color: '#111827',
                    borderRadius: '8px',
                    border: '1px solid #c9c9c9',
                  }}
                >
                  <button
                    onClick={handleDownloadPdf}
                    disabled={downloadingPdf}
                    className="absolute top-3 right-3 px-3 py-2 rounded text-white text-xs font-semibold disabled:opacity-60"
                    style={{
                      background: '#DC2626',
                      fontFamily: "'Poppins', sans-serif",
                    }}
                    title="Descargar reglamento en PDF"
                  >
                    {downloadingPdf ? 'Descargando...' : 'PDF'}
                  </button>

                  <h3
                    className="text-base md:text-lg mb-3 pr-14"
                    style={{ fontFamily: "'Anton SC', sans-serif" }}
                  >
                    {reglamento.title}
                  </h3>

                  {loadingReglamento ? (
                    <p className="text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Cargando reglamento...
                    </p>
                  ) : (
                    <div className="space-y-1 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {lines.map((line, index) => (
                        <p key={`${line}-${index}`}>{line || '\u00A0'}</p>
                      ))}
                    </div>
                  )}
                </div>

                {(reglamentoError || confirmMessage) && (
                  <div className="mt-3 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {reglamentoError && <p className="text-red-400">{reglamentoError}</p>}
                    {confirmMessage && (
                      <p className={confirmMessage.includes('correctamente') ? 'text-green-400' : 'text-yellow-300'}>
                        {confirmMessage}
                      </p>
                    )}
                  </div>
                )}
              </section>

              <section className="flex flex-col justify-between min-h-[520px]">
                <div>
                  <h3
                    className="text-white text-4xl uppercase leading-tight"
                    style={{ fontFamily: "'Anton SC', sans-serif" }}
                  >
                    Lee cuidadosamente el reglamento...
                    <br />
                    al final confirma la lectura de este mismo
                  </h3>
                </div>

                <div className="flex flex-col items-start gap-4 mt-6">
                  <button
                    onClick={handleConfirmRead}
                    disabled={confirmingRead || lecturaConfirmada}
                    className="px-6 py-3 rounded text-white text-2xl uppercase disabled:opacity-60"
                    style={{
                      background: lecturaConfirmada ? '#15803D' : '#16A34A',
                      fontFamily: "'Anton SC', sans-serif",
                      letterSpacing: '0.5px',
                    }}
                  >
                    {confirmingRead
                      ? 'Confirmando...'
                      : lecturaConfirmada
                        ? 'Lectura Confirmada'
                        : 'Confirmar Lectura'}
                  </button>

                  <img
                    src={robotArbitro}
                    alt="Robot reglamento"
                    className="w-[170px] md:w-[220px] xl:w-[250px] object-contain self-end"
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}