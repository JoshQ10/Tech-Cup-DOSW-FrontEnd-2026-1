# Assets — TechCup Fútbol

Guía de referencia de todos los recursos visuales usados en el `README.md` principal y en la documentación del proyecto.

---

## Estructura de carpetas

```text
assets/readme/
├── branding/          # Logos, isotipo y wordmark oficiales
├── robot/             # Variantes del robot mascota por rol
├── mockups/           # Capturas de pantalla de las vistas del sistema
├── flows/             # Diagramas de flujo y navegación
└── components/        # Fragmentos de UI: botones, tarjetas, tipografía, etc.
```

---

## Reglas de nombres

| Tipo | Convención | Ejemplo |
|---|---|---|
| Logo | `logo-[variante].[ext]` | `logo-principal.svg`, `logo-dark.svg` |
| Robot | `robot-[rol].[ext]` | `robot-jugador.png`, `robot-capitan.png` |
| Mockup | `mockup-[nombre-vista].[ext]` | `mockup-login.webp`, `mockup-tabla.webp` |
| Flujo | `flow-[nombre].[ext]` | `flow-registro.png` |
| Componente | `component-[nombre].[ext]` | `component-paleta.png` |

> Usa siempre **kebab-case** (minúsculas con guiones). Sin espacios, sin acentos, sin mayúsculas.

---

## Formatos recomendados

| Formato | Úsalo para |
|---|---|
| **SVG** | Logos, isotipo, iconos — escalan sin perder calidad |
| **WebP** | Mockups de pantallas — mejor compresión que PNG/JPG |
| **PNG** | Robot mascota y elementos con transparencia |

**Peso máximo:** 500 KB por imagen (límite sugerido 1 MB).

---

## Branding

### Logo principal

Logo completo con el robot apoyado sobre el balón + wordmark "TECHCUP". Fondo oscuro (azul `#002652`), para usar sobre fondos claros o con versión invertida.

> 📁 `assets/readme/branding/logo-principal.svg`

```md
![Logo principal TechCup](assets/readme/branding/logo-principal.svg)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

### Logo versión clara

Misma composición del logo principal pero sobre fondo blanco o transparente. Para documentación, presentaciones y fondos claros.

> 📁 `assets/readme/branding/logo-light.svg`

```md
![Logo versión clara TechCup](assets/readme/branding/logo-light.svg)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

### Isotipo — Hexágono de circuito

Símbolo secundario de marca: hexágono con trazos que simulan circuitos electrónicos. Representa la interconexión entre Sistemas, IA y Ciberseguridad. Se usa solo cuando el espacio no permite el logo completo.

> 📁 `assets/readme/branding/isotipo.svg`

```md
![Isotipo TechCup](assets/readme/branding/isotipo.svg)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

### Wordmark — Tipografía TCF

Logotipo tipográfico con las siglas o nombre completo en **Anton SC**. Versiones: color principal y monocromático.

> 📁 `assets/readme/branding/wordmark.svg`

```md
![Wordmark TechCup](assets/readme/branding/wordmark.svg)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

### Paleta de colores

Vista completa del sistema de color con los cinco colores por rol (azul, rojo, verde, amarillo, morado) y los acentos funcionales (blanco, cian `#00C8B4`).

> 📁 `assets/readme/branding/paleta-colores.png`

```md
![Paleta de colores TechCup](assets/readme/branding/paleta-colores.png)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

### Tipografía — Sistema jerárquico

Muestra de las cuatro fuentes en uso: **Anton SC** (títulos), **Oswald** (subtítulos), **Poppins** (botones) e **Inter** (texto general), con sus tamaños de referencia.

> 📁 `assets/readme/branding/tipografia.png`

```md
![Sistema tipográfico TechCup](assets/readme/branding/tipografia.png)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

## Robot mascota

El robot es la firma visual del proyecto. Sus ojos en cian `#00C8B4` son constantes en todas las variantes. Cada rol tiene su propia versión con indumentaria y color de fondo correspondiente.

---

### Robot — Jugador (base)

Robot sonriente apoyado sobre el balón de fútbol. Fondo azul oscuro `#002652`. Es la versión principal que representa el rol de usuario/jugador.

> 📁 `assets/readme/robot/robot-jugador.png`

```md
![Robot mascota — Jugador](assets/readme/robot/robot-jugador.png)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

### Robot — Capitán

Robot con indumentaria de director técnico. Fondo verde `#01540D`. Acompañado del mensaje *"Listo para empezar a dirigir"* en las pantallas de selección de rol.

> 📁 `assets/readme/robot/robot-capitan.png`

```md
![Robot mascota — Capitán](assets/readme/robot/robot-capitan.png)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

### Robot — Administrador

Robot con atuendo de administrador del sistema. Fondo rojo oscuro `#50070C`. Transmite autoridad y acceso a operaciones críticas.

> 📁 `assets/readme/robot/robot-administrador.png`

```md
![Robot mascota — Administrador](assets/readme/robot/robot-administrador.png)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

### Robot — Árbitro

Robot con vestimenta de árbitro (rayas). Fondo amarillo/oliva `#514F01`. Evoca las tarjetas del fútbol y el rol regulador e imparcial.

> 📁 `assets/readme/robot/robot-arbitro.png`

```md
![Robot mascota — Árbitro](assets/readme/robot/robot-arbitro.png)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

### Robot — Organizador

Robot con elementos de coordinación y planificación. Fondo morado `#260053`. Representa la figura que estructura el torneo completo.

> 📁 `assets/readme/robot/robot-organizador.png`

```md
![Robot mascota — Organizador](assets/readme/robot/robot-organizador.png)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

### Robot — Vista comparativa de roles

Imagen compuesta con las cinco variantes del robot lado a lado. Útil para el README principal y presentaciones para mostrar el sistema de roles de un vistazo.

> 📁 `assets/readme/robot/robot-comparativa-roles.png`

```md
![Comparativa de roles — Robot mascota](assets/readme/robot/robot-comparativa-roles.png)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

## Mockups

Capturas de las vistas principales del sistema en formato **WebP**. El color dominante en todas es el azul oscuro `#002652`; los modales y áreas de contenido usan grises claros `#F0F0F0`.

---

### Inicio de sesión

Vista dividida en dos mitades: izquierda con fotografía del campus de la Escuela + robot saludando, derecha con formulario de autenticación sobre fondo azul oscuro. Incluye campos Email/Usuario y Contraseña, enlaces de recuperación y logo TCF.

> 📁 `assets/readme/mockups/mockup-login.webp`

```md
![Mockup — Inicio de sesión](assets/readme/mockups/mockup-login.webp)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

### Selección de rol

Pantalla de selección de rol con checkboxes para Jugador, Capitán, Administrador, Árbitro y Organizador. El color de fondo cambia dinámicamente según el rol activo.

> 📁 `assets/readme/mockups/mockup-seleccion-rol.webp`

```md
![Mockup — Selección de rol](assets/readme/mockups/mockup-seleccion-rol.webp)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

### Registro de cuenta

Formulario de creación de cuenta con campos de nombre, apellidos, usuario, contraseña y correo. El robot aparece en esquinas como elemento decorativo. Fondo azul oscuro.

> 📁 `assets/readme/mockups/mockup-registro.webp`

```md
![Mockup — Registro de cuenta](assets/readme/mockups/mockup-registro.webp)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

### Perfil deportivo

Vista del perfil del jugador con información personal y deportiva, disponibilidad y estadísticas individuales.

> 📁 `assets/readme/mockups/mockup-perfil.webp`

```md
![Mockup — Perfil deportivo](assets/readme/mockups/mockup-perfil.webp)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

### Gestión de equipo

Panel del capitán para administrar la plantilla: búsqueda de jugadores, sistema de invitaciones y carga de comprobante de pago.

> 📁 `assets/readme/mockups/mockup-equipo.webp`

```md
![Mockup — Gestión de equipo](assets/readme/mockups/mockup-equipo.webp)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

### Alineación de partido

Vista de organización táctica donde el capitán arma la alineación y puede ver la formación del equipo rival.

> 📁 `assets/readme/mockups/mockup-alineacion.webp`

```md
![Mockup — Alineación de partido](assets/readme/mockups/mockup-alineacion.webp)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

### Tabla de posiciones

Vista de resultados del torneo con clasificación de equipos, puntos, victorias, derrotas y empates. Verde = victoria · Rojo = derrota · Dorado = empate.

> 📁 `assets/readme/mockups/mockup-tabla-posiciones.webp`

```md
![Mockup — Tabla de posiciones](assets/readme/mockups/mockup-tabla-posiciones.webp)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

### Bracket eliminatorio

Vista del cuadro de eliminación directa con el árbol de partidos y los avances de cada equipo.

> 📁 `assets/readme/mockups/mockup-bracket.webp`

```md
![Mockup — Bracket eliminatorio](assets/readme/mockups/mockup-bracket.webp)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

### Panel de árbitro

Vista exclusiva del árbitro para registrar resultados, eventos del partido (goles, tarjetas) y validar el acta final.

> 📁 `assets/readme/mockups/mockup-arbitro.webp`

```md
![Mockup — Panel de árbitro](assets/readme/mockups/mockup-arbitro.webp)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

## Flows

Diagramas del flujo de navegación del sistema. Exportar en **PNG** con fondo blanco o transparente desde Figma.

---

### Flujo de registro y autenticación

Diagrama que muestra el recorrido desde el acceso a la plataforma hasta el ingreso completo: registro → verificación de correo → selección de rol → pantalla principal.

> 📁 `assets/readme/flows/flow-registro.png`

```md
![Flujo — Registro y autenticación](assets/readme/flows/flow-registro.png)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

### Flujo de gestión del torneo

Diagrama del ciclo completo de un torneo: creación → inscripción de equipos → fase de grupos → eliminatorias → final.

> 📁 `assets/readme/flows/flow-torneo.png`

```md
![Flujo — Gestión del torneo](assets/readme/flows/flow-torneo.png)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

## Components

Fragmentos de UI aislados para documentar el design system.

---

### Botones por estado

Muestra de los botones principales en sus estados: default, hover, disabled y loading. Con la fuente **Poppins 24 px** y los colores por rol.

> 📁 `assets/readme/components/component-botones.png`

```md
![Componentes — Botones](assets/readme/components/component-botones.png)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

### Tarjetas de equipo e inputs

Ejemplos de los componentes de formulario (campos de texto, checkboxes) y tarjetas de información que aparecen en las vistas de equipo y torneo.

> 📁 `assets/readme/components/component-cards-inputs.png`

```md
![Componentes — Tarjetas e inputs](assets/readme/components/component-cards-inputs.png)
```

<!-- INSERTAR IMAGEN AQUÍ -->

---

<div align="center">
  <sub>TechCup Fútbol · assets/readme · Escuela Colombiana de Ingeniería Julio Garavito</sub>
</div>