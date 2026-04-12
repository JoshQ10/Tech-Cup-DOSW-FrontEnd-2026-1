# TechCup Fútbol - Frontend

Plataforma web para la gestión de un torneo de fútbol robótico (TechCup) construida con React + Vite.

## 📋 Descripción del Proyecto

TechCup Fútbol es una aplicación web que permite a diferentes usuarios (Jugadores, Capitanes, Administradores, Árbitros y Organizadores) interactuar con un sistema de gestión de torneo robótico.

## 🚀 Tecnologías Utilizadas

- **React** 19.2.4 - Librería de UI
- **Vite** 8.0.0 - Herramienta de build y desarrollo
- **Tailwind CSS** 4.2.2 - Framework de estilos
- **React Router DOM** 7.14.0 - Enrutamiento de páginas
- **Axios** 1.14.0 - Cliente HTTP para peticiones
- **React Icons** 5.6.0 - Iconos de interfaz
- **ESLint** 9.39.4 - Linter para código

## 📁 Estructura del Proyecto

```
src/
├── pages/
│   ├── Home.jsx              # Página principal con selección de roles
│   ├── Landing.jsx           # Página de inicio/bienvenida
│   ├── Login.jsx             # Página de login
│   ├── Register.jsx          # Página de registrarse
│   └── PerfilDeportivo.jsx   # Perfil deportivo del usuario
├── assets/
│   ├── logos/                # Logos del proyecto
│   ├── robots/               # Imágenes de robots por rol
│   ├── campus/               # Imágenes del campus
│   └── imagenes TCF/         # Otros recursos visuales
├── App.jsx                   # Componente principal
├── main.jsx                  # Punto de entrada
├── App.css                   # Estilos globales
└── index.css                 # Estilos base
```

## ✅ Funcionalidades Implementadas

### 1. Página de Inicio (Home.jsx)
- Selección de roles de usuario con 5 opciones:
  - 👤 Jugador - Para participar en equipos
  - 🎖️ Capitán - Para dirigir equipos
  - ⚙️ Administrador - Para gestionar el torneo
  - 🏁 Árbitro - Para dirige partidos
  - 📋 Organizador - Para coordinar eventos
- Cambio dinámico de colores según rol seleccionado
- Carrusel de imágenes del campus (rotación cada 5 segundos)
- Interfaz responsiva (mobile, tablet, desktop)

### 2. Autenticación
- Página de Login (Login.jsx)
- Página de Registro (Register.jsx)
- Sistema de sesión de usuarios

### 3. Perfil de Usuario
- Página de Perfil Deportivo (PerfilDeportivo.jsx)
- Visualización y edición de información del usuario

### 4. Página de Bienvenida
- Landing.jsx - Primera impresión del usuario

## 🎨 Diseño Visual

- **Paleta de colores por rol:**
  - Jugador: #002652 (Azul oscuro)
  - Capitán: #01540D (Verde oscuro)
  - Administrador: #50070C (Rojo oscuro)
  - Árbitro: #514F01 (Marrón oscuro)
  - Organizador: #260053 (Púrpura oscuro)

- **Tipografía:**
  - Anton SC para títulos
  - Inter para textos regulares

## 🔧 Instalación y Setup

### Requisitos
- Node.js 16+ 
- npm o yarn

### Instalación

```bash
# Clonar repositorio
git clone <url-del-repositorio>

# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Preview de build
npm run preview
```

## 📦 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo en http://localhost:5173/
- `npm run build` - Genera build optimizado para producción
- `npm run lint` - Ejecuta ESLint para validar código
- `npm run preview` - Visualiza el build antes de desplegar

## 📝 Estado Actual

### Completado ✅
- Estructura base del proyecto con React + Vite
- Rutas principales configuradas
- Página de inicio con selección de roles
- Sistema de autenticación (estructurado)
- Perfil de usuario
- Assets visuales (logos, robots, campus)
- Estilos con Tailwind CSS
- Responsividad en todas las páginas

### En Progreso 🔄
- Integración con API backend
- Validaciones de formularios
- Sistema de permisos por rol

### Por Hacer 📌
- Conectar con endpoints del backend
- Dashboard específico por rol
- Gestión de equipos y partidos
- Notificaciones en tiempo real

## 🌿 Ramas Git

- `main` - Rama principal (producción)
- `Develop` - Rama de desarrollo
- `intento` - Rama de trabajo actual

## 📞 Contacto y Contribución

Este es un proyecto del Tech-Cup DOSW Frontend 2026

---

**Última actualización:** Abril 2026
