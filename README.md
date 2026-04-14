# TechCup Fútbol — Frontend

**Plataforma digital para la gestión del torneo semestral de fútbol**  
Escuela Colombiana de Ingeniería Julio Garavito · Programas de Ingeniería

[![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow?style=flat-square)](.)
[![Curso](https://img.shields.io/badge/curso-DOSW%202026--1-blue?style=flat-square)](.)
[![Licencia](https://img.shields.io/badge/licencia-privada-red?style=flat-square)](.)

---

## Tabla de contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Configuración del Backend](#configuración-del-backend)
- [Páginas y Rutas](#páginas-y-rutas)
- [Componentes Reutilizables](#componentes-reutilizables)
- [Servicios y API](#servicios-y-api)
- [Autenticación](#autenticación)
- [Usuarios de Prueba](#usuarios-de-prueba)
- [Funcionalidades](#funcionalidades)
- [Identidad Visual](#identidad-visual)
- [Estado del Proyecto](#estado-del-proyecto)
- [Pendiente por el Backend](#pendiente-por-el-backend)
- [Equipo](#equipo)

---

## Descripción

TechCup Fútbol es la interfaz oficial de la plataforma que centraliza la gestión del torneo semestral de fútbol entre los programas de ingeniería. El frontend consume la API REST del backend para cubrir todo el ciclo del torneo: desde el registro de jugadores hasta la visualización de estadísticas finales.

La plataforma está dirigida a cinco tipos de usuario con experiencias diferenciadas:

| Rol | Responsabilidad |
|---|---|
| **Jugador** | Perfil deportivo, disponibilidad, historial |
| **Capitán** | Gestión de equipo, alineaciones, invitaciones |
| **Árbitro** | Registro de resultados, panel de partido |
| **Administrador** | Configuración del torneo, canchas, reglamento |
| **Organizador** | Coordinación general del torneo |

---

## Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19.2.4 | Framework principal |
| React Router DOM | 7.14.0 | Navegación entre páginas |
| Vite | 8.0.0 | Bundler y servidor de desarrollo |
| Tailwind CSS | 4.2.2 | Estilos utilitarios |
| Axios | 1.14.0 | Cliente HTTP (disponible) |
| React Icons | 5.6.0 | Iconografía adicional |

---

## Estructura del Proyecto

```
src/
├── assets/
│   ├── campus/               # Fotos del campus ECI (hero de fondo)
│   ├── logos/                # Logo TCF en distintas variantes
│   └── robots/               # Mascotas robot del sistema (por rol y estado)
├── pages/
│   ├── Landing.jsx           # Página de bienvenida pública
│   ├── Login.jsx             # Inicio de sesión
│   ├── Home.jsx              # Selección de rol (pre-registro)
│   ├── Register.jsx          # Formulario de registro
│   ├── Dashboard.jsx         # Panel principal + componentes reutilizables
│   ├── PerfilDeportivo.jsx   # Perfil deportivo del jugador
│   ├── Invitaciones.jsx      # Gestión de invitaciones
│   ├── Calendario.jsx        # Calendario de partidos
│   ├── Torneo.jsx            # Información del torneo
│   ├── Reglamento.jsx        # Reglamento del torneo
│   ├── TablaPosiciones.jsx   # Tabla de posiciones
│   └── Llaves.jsx            # Llaves eliminatorias
├── services/
│   └── api.js                # Todas las llamadas al backend
├── App.jsx                   # Rutas principales
└── main.jsx                  # Punto de entrada
```

---

## Instalación y Ejecución

### Requisitos previos
- Node.js 18 o superior
- npm 9 o superior
- Backend corriendo (ver sección siguiente)

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd Tech-Cup-DOSW-FrontEnd-2026-1-intento

# 2. Instalar dependencias
npm install

# 3. Iniciar en desarrollo
npm run dev
```

La app queda disponible en `http://localhost:5173`

### Otros comandos

```bash
npm run build    # Compilar para producción
npm run preview  # Vista previa del build
npm run lint     # Revisar errores de código
```

---

## Configuración del Backend

El proxy del backend se configura en `vite.config.js`:

```js
server: {
  proxy: {
    '/api': {
      target: 'https://localhost:8443',  // Backend local
      changeOrigin: true,
      secure: false,
    }
  }
}
```

### Cuando el backend esté en Azure

Cambiar `target` en `vite.config.js`:

```js
target: 'https://techcup-backend.azurewebsites.net'
```

O directamente el `BASE_URL` en `src/services/api.js`:

```js
const BASE_URL = 'https://techcup-backend.azurewebsites.net/api';
```

---

## Páginas y Rutas

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `Landing` | Página pública de bienvenida |
| `/iniciar-sesion` | `Login` | Formulario de login |
| `/seleccionar-rol` | `Home` | Selección de rol antes del registro |
| `/registro` | `Register` | Formulario de registro |
| `/dashboard` | `Dashboard` | Panel principal del usuario |
| `/perfil-deportivo` | `PerfilDeportivo` | Perfil deportivo del jugador |
| `/invitaciones` | `Invitaciones` | Gestión de invitaciones a equipos |
| `/calendario` | `Calendario` | Calendario de partidos |
| `/torneo` | `Torneo` | Información del torneo |
| `/reglamento` | `Reglamento` | Reglamento del torneo |
| `/tabla` | `TablaPosiciones` | Tabla de posiciones |
| `/llaves` | `Llaves` | Llaves del torneo |

---

## Componentes Reutilizables

Todos exportados desde `Dashboard.jsx` para ser usados en cualquier pantalla:

### `<Sidebar active="key" onLogout={fn} />`
Barra lateral de navegación con expansión al hover. Muestra badges de notificaciones e íconos de alerta.

**Valores válidos para `active`:**
`'principal'` · `'perfil'` · `'invitaciones'` · `'calendario'` · `'torneo'` · `'reglamento'` · `'tabla'` · `'llaves'`

### `<Topbar userName fullName userPhoto userRole onLogout />`
Barra superior con logo y menú dropdown al hacer click en el usuario. El menú muestra nombre completo, `@username`, rol, botón de perfil y cierre de sesión.

### `<LogoutModal onConfirm={fn} onCancel={fn} />`
Modal de confirmación de cierre de sesión con robot animado.

### `<PantallaEnConstruccion titulo="Nombre" />`
Pantalla placeholder para secciones aún no implementadas.

### `useDashboard()` — Hook personalizado

Centraliza la lógica del perfil de usuario y el logout.

**Retorna:**
```js
{
  profile,            // Objeto completo del perfil
  loading,            // boolean
  userName,           // username o firstName
  fullName,           // firstName + lastName
  userPhoto,          // URL de foto o null
  userRole,           // Rol del backend (PLAYER, CAPTAIN, etc.)
  showLogoutModal,    // boolean
  setShowLogoutModal,
  confirmLogout       // Limpia localStorage y redirige al login
}
```

### Plantilla estándar para nuevas pantallas

```jsx
import { Sidebar, Topbar, LogoutModal, PantallaEnConstruccion, useDashboard } from './Dashboard';

export default function MiPantalla() {
  const {
    userName, userPhoto, fullName, userRole,
    loading, showLogoutModal, setShowLogoutModal, confirmLogout
  } = useDashboard();

  return (
    <div className="flex h-screen w-full overflow-hidden relative" style={{ background: '#000F20' }}>
      {showLogoutModal && (
        <LogoutModal onConfirm={confirmLogout} onCancel={() => setShowLogoutModal(false)} />
      )}
      <Sidebar active="mi-key" onLogout={() => setShowLogoutModal(true)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          userName={loading ? '...' : userName}
          fullName={fullName}
          userPhoto={userPhoto}
          userRole={userRole}
          onLogout={() => setShowLogoutModal(true)}
        />
        <PantallaEnConstruccion titulo="Mi Pantalla" />
      </div>
    </div>
  );
}
```

---

## Servicios y API

Archivo: `src/services/api.js`

| Función | Método | Endpoint | Descripción |
|---|---|---|---|
| `loginUser(email, password)` | POST | `/api/auth/login` | Login, guarda token en localStorage |
| `registerUser(formData)` | POST | `/api/auth/register` | Registro de nuevo usuario |
| `resendVerification(email)` | POST | `/api/auth/resend-verification` | Reenviar email de verificación |
| `getToken()` | — | — | Lee el token del localStorage |
| `authFetch(url, options)` | — | — | Fetch con Authorization header automático |

### Ejemplo de uso de `authFetch`

```js
import { authFetch } from '../services/api';

// GET autenticado
const res = await authFetch('/profile');
const data = await res.json();

// PUT autenticado con body
const res = await authFetch('/players/1/profile', {
  method: 'PUT',
  body: JSON.stringify({ position: 'Delantero' })
});
```

---

## Autenticación

El sistema usa **JWT (JSON Web Token)**:

1. Al hacer login, el backend devuelve `token` y `refreshToken`
2. Ambos se guardan en `localStorage`
3. Cada petición autenticada incluye el header `Authorization: Bearer <token>`
4. Al cerrar sesión, se eliminan ambos tokens del localStorage

### Flujo de login
```
/iniciar-sesion → POST /api/auth/login → Guarda token → /dashboard
```

---

## Usuarios de Prueba

Todos usan la misma contraseña: **`password123`**

| Email | Nombre | Rol |
|---|---|---|
| `admin@escuelaing.edu.co` | Admin TechCup | ADMINISTRATOR |
| `admintest@escuelaing.edu.co` | Admin Test | ADMINISTRATOR |
| `juan.perez@mail.eci.edu.co` | Juan Pérez | PLAYER |
| `andres.ruiz@mail.escuelaing.edu.co` | Andres Delantero Ruiz | PLAYER |
| `luis.diaz@mail.escuelaing.edu.co` | Luis Mediocampo Diaz | PLAYER |
| `sofia.martinez@mail.escuelaing.edu.co` | Sofia Defensa Martinez | PLAYER |
| `diego.gomez@mail.escuelaing.edu.co` | Diego Portero Gomez | PLAYER |
| `valentina.rios@mail.escuelaing.edu.co` | Valentina Goleadora Rios | PLAYER |
| `sebastian.castro@mail.escuelaing.edu.co` | Sebastian Volante Castro | PLAYER |
| `camila.herrera@mail.escuelaing.edu.co` | Camila Central Herrera | PLAYER |
| `felipe.mora@mail.escuelaing.edu.co` | Felipe Arquero Mora | PLAYER |
| `capitan.ingenieros@mail.escuelaing.edu.co` | Pedro Capitan Garcia | CAPTAIN |
| `capitan.byte@mail.escuelaing.edu.co` | Maria Capitan Torres | CAPTAIN |

> ⚠️ Estos usuarios deben existir en la base de datos local `techcup_db`. Ver instrucciones de seed en el repositorio del backend en `src/main/resources/data-seed.sql`.

---

## Funcionalidades

### Autenticación y perfil
- Registro e inicio de sesión de usuarios
- Verificación de correo electrónico
- Selección de rol en el registro
- Edición de perfil deportivo
- Gestión de disponibilidad de jugadores

### Gestión del torneo
- Creación y configuración de torneos
- Definición de reglamento y canchas
- Control de estados del torneo
- Vista pública del torneo

### Equipos
- Creación de equipos y gestión de plantilla
- Búsqueda de jugadores disponibles
- Sistema de invitaciones
- Carga de comprobante de pago

### Partidos
- Organización de alineaciones
- Visualización de la alineación rival
- Registro de resultados
- Panel de árbitros

### Resultados y estadísticas
- Tabla de posiciones
- Bracket eliminatorio
- Ranking de goleadores
- Historial de partidos y resultados por equipo

---

## Identidad Visual

La marca **TECHCUP** nace de la unión entre tecnología y deporte universitario. El sistema visual refleja este concepto en cada componente de la interfaz.

### Logotipo

El logo representa **un robot amigable apoyado sobre un balón de fútbol**: el robot simboliza los programas de Sistemas, Inteligencia Artificial y Ciberseguridad; el balón es el elemento central del torneo. Las formas redondeadas y líneas suaves garantizan reconocimiento rápido y buena adaptación a interfaces digitales.

### Paleta de colores

| Rol / Uso | Color | HEX | Significado |
|---|---|---|---|
| Fondo principal | 🔵 Azul muy oscuro | `#000F20` | Fondo general de la app |
| Cards y paneles | 🔵 Azul medio | `#002060` | Componentes sobre el fondo |
| Activo / Hover | 🔵 Azul acento | `#003C81` | Sidebar activo, hover |
| Jugador | 🔵 Azul | `#002652` | Rol jugador |
| Administrador | 🔴 Rojo | `#50070C` | Autoridad, acciones críticas |
| Capitán | 🟢 Verde | `#01540D` | Liderazgo, campo de juego |
| Árbitro | 🟡 Amarillo | `#514F01` | Imparcialidad, regulación |
| Organizador | 🟣 Morado | `#260053` | Planificación, coordinación |
| En construcción | 🟡 Amarillo | `#facc15` | Placeholders y alertas |
| Logout / Error | 🔴 Rojo claro | `#f87171` | Cierre de sesión y errores |

### Tipografía

| Elemento | Fuente | Uso |
|---|---|---|
| Título principal (H1) | **Anton SC** | Headings y títulos grandes |
| Subtítulo (H2) | **Oswald** | Subtítulos de sección |
| Texto general | **Inter** | Labels y textos descriptivos |
| Botones | **Poppins** | Botones y navegación |

### Estilo de componentes

- Fondo dominante: azul oscuro `#000F20`
- Cards con `backdrop-filter: blur(8px)` sobre imagen de campus de fondo
- Bordes sutiles `rgba(255,255,255,0.08)`
- Formas redondeadas `rounded-xl` en todos los componentes
- Alto contraste texto blanco sobre fondo oscuro

---

## Estado del Proyecto

> 🚧 **En desarrollo** — Curso Ciclos de Desarrollo de Software (DOSW) · Periodo 2026-1

| Sección | Estado | Notas |
|---|---|---|
| Landing | ✅ Completo | |
| Login | ✅ Completo | |
| Selección de Rol | ✅ Completo | |
| Registro | ✅ Completo | |
| Dashboard Principal | ✅ Completo | Nombre y rol pendientes del back |
| Perfil Deportivo | 🔧 En construcción | Espera `/api/profile` completo |
| Invitaciones | 🔧 En construcción | Espera endpoint del back |
| Calendario | 🔧 En construcción | Espera endpoint del back |
| Torneo | 🔧 En construcción | Espera `GET /api/tournaments/{id}` |
| Reglamento | 🔧 En construcción | |
| Tabla de Posiciones | 🔧 En construcción | Espera endpoint del back |
| Llaves | 🔧 En construcción | Espera endpoint del back |

---

## Pendiente por el Backend

### Urgente
- **`GET /api/profile`** — Actualmente solo devuelve `email`, `roles` y `authenticated`. Debe devolver el `UserResponse` completo con `firstName`, `lastName`, `username`, `role`, `id`, `photoUrl`.

### Para próximas pantallas
- `GET /api/matches` — Próximos partidos del usuario
- `GET /api/standings` — Tabla de posiciones
- `GET /api/news` — Noticias y datos del torneo
- `GET /api/invitations` — Invitaciones recibidas
- `GET /api/calendar` — Eventos del calendario

### Ya disponibles y funcionando
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/resend-verification`
- `GET /api/profile` *(parcial)*
- `GET /api/players/{id}/profile`
- `PUT /api/players/{id}/profile`
- `POST /api/players/{id}/photo`
- `GET /api/teams/{id}`
- `GET /api/teams/{id}/roster`
- `GET /api/tournaments/{id}`

---

## Diseño en Figma

| Recurso | Enlace |
|---|---|
| Archivo principal Figma | `https://www.figma.com/design/vMNE1kiq3VHUqf8gKMgujR/Correcion-De-moukcup?node-id=0-1&t=oWLFRjCbIUNArwW8-1` |
| Manual de identidad visual | `src/assets/imagenes TCF (2)/Manual_de_identidad_final.pdf` |

---

## Equipo

| Nombre |
|---|
| Joshua David Quiroga Landazabal |
| Juan David Valero Abril |
| Juan Carlos Bohórquez Monroy |
| Carlos Andrés Uribe Vargas |
| Andrés Felipe Savogal Wilches |

---

<div align="center">
  <sub>TechCup Fútbol · Escuela Colombiana de Ingeniería Julio Garavito</sub>
</div>

