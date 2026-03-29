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
- [Funcionalidades](#funcionalidades)
- [Identidad visual](#identidad-visual)
- [Diseño en Figma](#diseño-en-figma)
- [Equipo](#equipo)
- [Estado del proyecto](#estado-del-proyecto)

---

## Descripción

TechCup Fútbol es la interfaz oficial de la plataforma que centraliza la gestión del torneo semestral de fútbol entre los programas de ingeniería. El frontend consume la API REST del backend para cubrir todo el ciclo del torneo: desde el registro de jugadores hasta la visualización de estadísticas finales.

La plataforma está dirigida a cuatro tipos de usuario con experiencias diferenciadas:

| Rol | Responsabilidad |
|---|---|
| **Jugador** | Perfil deportivo, disponibilidad, historial |
| **Capitán** | Gestión de equipo, alineaciones, invitaciones |
| **Árbitro** | Registro de resultados, panel de partido |
| **Administrador / Organizador** | Configuración del torneo, canchas, reglamento |

---

## Tecnologías


---

## Funcionalidades

### Autenticación y perfil
- Registro e inicio de sesión de usuarios
- Verificación de correo electrónico
- Protección de rutas por rol
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

## Identidad visual

La marca **TECHCUP** nace de la unión entre tecnología y deporte universitario. El sistema visual refleja este concepto en cada componente de la interfaz.

### Logotipo

El logo representa **un robot amigable apoyado sobre un balón de fútbol**: el robot simboliza los programas de Sistemas, Inteligencia Artificial y Ciberseguridad; el balón es el elemento central del torneo. Las formas redondeadas y líneas suaves garantizan reconocimiento rápido y buena adaptación a interfaces digitales.

Como símbolo de marca secundario se usa un **hexágono con trazos de circuito electrónico**, representando la interconexión entre las disciplinas tecnológicas.

### Paleta de colores

La paleta diferencia los roles del sistema mediante colores con semántica deportiva e institucional clara:

| Rol | Color | HEX | Significado |
|---|---|---|---|
| Usuario (base) | 🔵 Azul oscuro | `#002652` | Confianza, estabilidad, tecnología |
| Administrador | 🔴 Rojo | `#50070C` | Autoridad, acciones críticas |
| Capitán | 🟢 Verde | `#01540D` | Liderazgo, campo de juego |
| Árbitro | 🟡 Amarillo | `#514F01` | Imparcialidad, regulación |
| Organizador | 🟣 Morado | `#260053` | Planificación, coordinación |

**Colores funcionales / semánticos:**  
`#FFFFFF` / `#F0F0F0` — fondos de contenido y formularios  
`#00C8B4` — acento cian/agua marina (ojos del robot, badges, enlaces activos)  
Verde — victorias · Rojo — derrotas · Dorado — empates

### Tipografía

| Elemento | Fuente | Tamaño |
|---|---|---|
| Título principal (H1) | **Anton SC** | 100 px |
| Subtítulo (H2) | **Oswald** | 40 px |
| Texto general | **Inter** | 24 px |
| Botones | **Poppins** | 24 px |

### Estilo de componentes

- Fondo dominante: azul oscuro `#002652` en headers, barras laterales y paneles
- Modales y áreas de contenido: gris claro `#F0F0F0`–`#D8D8D8` (67–80 % del área modal)
- Formas redondeadas y líneas suaves para todos los componentes interactivos
- Alto contraste texto blanco sobre fondo oscuro para accesibilidad

---

## Diseño en Figma

| Recurso | Enlace |
|---|---|
| Archivo principal Figma | `[PONER_LINK_AQUI]` |
| Manual de identidad visual | `docs/Manual_de_identidad_final.pdf` |

### Mockups



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

## Estado del proyecto

> 🚧 **En desarrollo** — Curso Ciclos de Desarrollo de Software (DOSW) · Periodo 2026-1

---

<div align="center">
  <sub>TechCup Fútbol · Escuela Colombiana de Ingeniería Julio Garavito</sub>
</div>