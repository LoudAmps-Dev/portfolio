# Portfolio — Dani Meseguer

Portfolio personal construido desde cero para presentarme como desarrollador frontend junior. El objetivo es doble: mostrar los proyectos web que he hecho y explicar de dónde vengo, porque once años diseñando para bandas de rock no es el camino habitual hacia el frontend, y eso merece una presentación propia.

---

## Para qué sirve este proyecto

Es una web de una sola página (SPA sin frameworks) que funciona como carta de presentación profesional. Cuando alguien entra, ve primero el trabajo de desarrollo web. Si sigue bajando, llega a la sección "Wildside", que muestra el trabajo de diseño gráfico para música.

La idea es que los dos mundos convivan sin mezclarse visualmente. Por eso hay dos paletas:

- **Paleta clara (azul/violeta):** para la parte de frontend. Proyectos, skills, sección "de dónde vengo".
- **Paleta oscura (negro/rojo):** para la parte de diseño gráfico. Vinilos, cartelería, web de la banda.

No hay botón de cambio de tema. El propio scroll hace la transición.

---

## Estructura de archivos

```
Portfolio/
├── index.html       → toda la estructura de la página
├── style.css        → todos los estilos, organizados por sección
├── script.js        → comportamiento: typewriter, contadores, scroll suave, glitch
└── img/             → imágenes del proyecto (vinilos, capturas, fotos)
```

No hay carpeta `node_modules`, no hay `package.json`, no hay bundler. Se abre directamente en el navegador.

---

## Qué hay en la página

### Hero
Nombre con efecto typewriter al cargar. El texto de presentación y los botones entran con una animación escalonada (primero el tag, luego el subtítulo, luego los CTAs). Todo esto está en `script.js` con `requestAnimationFrame` y clases CSS.

### De Dónde Vengo
Sección de presentación. Explica el recorrido: diseño gráfico desde 2015, frontend desde 2026. Las etiquetas de skills son interactivas (hover con transición de color).

### Proyectos
Tres tarjetas:
- **Esta web** — el propio portfolio.
- **Best Nutrition** — web multi-página para una clínica de nutrición con sistema de reserva de citas: selección de servicio, calendario, franjas horarias, validación en cliente y confirmación en tiempo real.
- **Riffs on Time** — herramienta para músicos que permite crear setlists de concierto con duración exacta. Búsqueda de canciones en Spotify, suma automática de tiempos y exportación a Word y PDF. Demo en [loudamps-dev.github.io/riffsontime](https://loudamps-dev.github.io/riffsontime/).

### Wildside (transición)
Sección de separación entre los dos mundos. Usa una foto de concierto como fondo con un degradado de blanco a negro. El título "WILDSIDE" tiene una animación de glitch que se reinicia cada vez que la sección entra en pantalla (IntersectionObserver).

### Diseño gráfico
Dividido en categorías:

- **Vinilo & Print** — maquetación completa de tres álbumes de Hitten: *While Passion Lasts*, *Triumph and Tragedy* y *Twist of Fate*. Portadas, inserts, booklets, preparados para imprenta.
- **Cartelería** — deshabilitada temporalmente. El código está comentado y se puede recuperar quitando los comentarios.
- **Audiovisual** — deshabilitada temporalmente. Mismo caso.
- **Web** — web oficial de Hitten en WordPress.

Los contadores de la intro (discos, países, kilómetros) se animan con `IntersectionObserver` y `requestAnimationFrame` cuando entran en pantalla. Solo se animan una vez.

### Contacto
Email, GitHub y LinkedIn. Fondo negro, continuación visual de la sección de diseño.

---

## Cómo abrirlo

Doble clic en `index.html` y se abre en el navegador. No necesita servidor, no necesita instalación.

Si quieres verlo con recarga automática al editar, puedes usar la extensión **Live Server** de VS Code.

---

## Tecnologías usadas

| Tecnología | Para qué |
|---|---|
| HTML5 | Estructura semántica |
| CSS3 | Estilos, variables CSS, animaciones, grid, clamp() |
| JavaScript (vanilla) | Typewriter, contadores, scroll suave, glitch, IntersectionObserver |
| Google Fonts | Space Grotesk, Bebas Neue, DM Sans |
| GitHub Pages | Hosting del portfolio |

Sin frameworks, sin librerías, sin preprocesadores. Todo escrito a mano.

---

## Estado del proyecto

En desarrollo activo. Las secciones de Cartelería y Audiovisual están deshabilitadas porque el material no está listo. Están comentadas en el HTML y en el CSS con etiquetas que indican dónde empieza y dónde termina cada bloque, para recuperarlas cuando toque.

El enlace de LinkedIn está pendiente de actualizar.

---

## Autor

**Dani Meseguer** — Murcia, 2026  
[daniel.meseguer91@gmail.com](mailto:daniel.meseguer91@gmail.com)  
[github.com/LoudAmps-Dev](https://github.com/LoudAmps-Dev)
