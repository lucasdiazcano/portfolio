This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
hola. JAJAJA
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Arquitectura e Ingeniería de Interfaces Diegéticas: Implementación de Menús 3D Estilo Pip-Boy en Ecosistemas Next.js
La integración de interfaces de usuario diegéticas en el desarrollo web contemporáneo representa una convergencia entre la ingeniería de software de alto rendimiento y el diseño de experiencias inmersivas. Una interfaz diegética, concepto popularizado en el diseño de videojuegos y personificado por el dispositivo Pip-Boy de la franquicia Fallout, se define como un elemento funcional que existe físicamente dentro del mundo narrativo y espacial de la aplicación.1 A diferencia de las interfaces de usuario tradicionales (HUD) que se superponen bidimensionalmente sobre el contenido, el menú diegético se somete a las leyes de la perspectiva, la iluminación y los materiales del entorno tridimensional.2 En el contexto de un portfolio profesional desarrollado con Next.js, esta técnica no solo demuestra competencia técnica en gráficos computacionales, sino que también transforma la navegación convencional en una experiencia exploratoria.5
La arquitectura de una solución de este tipo requiere un orquestador que medie entre la estructura declarativa de React y el imperativo motor de WebGL. React Three Fiber (R3F) cumple esta función, permitiendo que los objetos de Three.js se gestionen como componentes de React, aprovechando el ciclo de vida, los ganchos (hooks) y el sistema de estados del framework.1 Para el año 2026, la implementación de estas interfaces ha madurado gracias a la estabilización de WebGPU y las optimizaciones de renderizado en el servidor proporcionadas por Next.js 15, lo que permite ejecutar escenas complejas con una latencia mínima.10
Fundamentos del Stack Tecnológico y Sincronización de Dependencias
La construcción de un menú diegético comienza con la selección rigurosa de dependencias. La compatibilidad entre las versiones de los paquetes es el factor crítico de éxito más relevante, especialmente ante la transición global hacia React 19 y Next.js 15.1 La arquitectura debe diseñarse para minimizar los conflictos en el reconciliador de React y maximizar el aprovechamiento de la GPU.1
Matriz de Dependencias y Compatibilidad
La siguiente tabla detalla los componentes esenciales del ecosistema necesarios para una implementación técnica robusta. Es imperativo respetar la paridad de versiones entre @react-three/fiber y la versión de React instalada para asegurar la estabilidad del renderizador.1

Paquete
Versión Recomendada (2025-2026)
Función Arquitectónica
next
15.x o superior
Framework base y optimización de rutas.10
react
19.x o superior
Librería de UI con soporte para React Compiler.14
three
r171 o superior
Motor de WebGL y WebGPU.1
@react-three/fiber
9.x
Puente declarativo entre React y Three.js.1
@react-three/drei
10.x
Helpers para cámaras, texturas y RenderTexture.1
zustand
4.x o superior
Gestión de estado global de baja latencia.1
framer-motion-3d
11.x
Orquestación de animaciones espaciales.1
maath
0.x
Funciones matemáticas para damping y suavizado.1

Procedimiento de Instalación y Configuración del Entorno
El proceso de instalación debe realizarse considerando que Next.js 15 utiliza por defecto el App Router, lo que influye en cómo se exponen los componentes del Canvas.10 Se recomienda el uso de npm o pnpm para la gestión de paquetes, prestando especial atención a las dependencias de pares (peer dependencies).1

Bash


# Instalación del núcleo de renderizado
npm install three @react-three/fiber @react-three/drei

# Instalación de utilidades de animación y estado
npm install zustand framer-motion motion/react maath

# Tipado para TypeScript (requerido para proyectos Next.js modernos)
npm install -D @types/three


Para entornos que ya han migrado a React 19, es posible que se requiera el uso del flag --legacy-peer-deps debido a que algunas bibliotecas del ecosistema Three.js podrían no haber actualizado sus metadatos de compatibilidad, aunque el código subyacente sea funcional.13
Configuración Arquitectónica en Next.js
La integración de Three.js en Next.js presenta desafíos específicos debido al renderizado en el servidor (SSR). Three.js depende del objeto window y del contexto del navegador, los cuales no están disponibles durante la fase de compilación o ejecución en el servidor.5 La estrategia técnica consiste en delegar el renderizado del Canvas exclusivamente al cliente.5
El Problema de la Hidratación y el Componente Canvas
El componente <Canvas /> de React Three Fiber debe instanciarse de manera que no interrumpa el flujo de hidratación de Next.js. Se implementa mediante una importación dinámica con la opción ssr: false.5 Además, es fundamental que el Canvas sea persistente a través de los cambios de ruta para evitar que el contexto WebGL se destruya y se vuelva a crear cada vez que el usuario navega por el portfolio.5
Un patrón de diseño eficiente es el uso de un componente de "partición" que separe los elementos del DOM tradicional (como el texto del portfolio) de los elementos de R3F.5 Este script de partición identifica los componentes marcados con una propiedad específica (por ejemplo, r3f) y los redirige hacia el Canvas global, mientras que el resto del contenido se renderiza en el DOM estándar.5
Optimización del Bundler y Transpilación
El archivo next.config.js debe ajustarse para manejar correctamente los paquetes de Three.js, que a menudo se distribuyen en formatos que requieren transpilación adicional para funcionar en el entorno de Next.js.15 La propiedad transpilePackages es la herramienta estándar para este propósito.18

JavaScript


/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  experimental: {
    optimizePackageImports: ['@react-three/drei'],
  },
};
module.exports = nextConfig;


Esta configuración no solo asegura que las clases de Three.js se carguen correctamente, sino que también permite que el optimizador de Next.js reduzca el tamaño del bundle eliminando código no utilizado (tree-shaking) de las librerías de utilidades.19
Pipeline de Activos 3D: El Modelo del Pip-Boy
La efectividad de un menú diegético depende de la calidad y optimización del modelo 3D. El estándar de la industria es el formato GLB (GL Transmission Format Binary), que permite empaquetar geometría, texturas y animaciones en un solo archivo binario eficiente para la transferencia web.20
Modelado y Exportación para Web
El modelo del Pip-Boy debe diseñarse en software como Blender, asegurando que las normales de las caras sean correctas y que el mapeado UV esté optimizado para la pantalla.2 Un aspecto técnico vital es la separación de la geometría de la pantalla del resto del chasis del dispositivo.2 Esto permite aplicar materiales diferentes y, lo más importante, inyectar una textura de renderizado interactiva en el área de la pantalla.21

Parámetro Técnico
Recomendación para Portfolio
Razón de Optimización
Formato de archivo
.GLB (Binary)
Minimiza peticiones HTTP y tamaño.20
Recuento de polígonos
< 40,000 triángulos
Garantiza 60 FPS en dispositivos móviles.2
Compresión
Google Draco
Reduce el tamaño de la malla hasta un 90%.20
Texturas
WebP / Basis Universal
Mayor fidelidad con menor consumo de VRAM.20

Transformación Declarativa con gltfjsx
Una vez exportado el modelo, se utiliza la herramienta gltfjsx para convertir el archivo binario en un componente de React. Este paso es fundamental porque permite manipular cada parte del Pip-Boy como un objeto de React, facilitando la adición de eventos de clic a los botones físicos o la modificación de materiales en tiempo real.23

Bash


npx gltfjsx public/models/pipboy.glb --transform --types


El flag --transform aplica automáticamente la compresión Draco y optimiza las texturas, mientras que --types genera las definiciones de TypeScript para asegurar que el acceso a los nodos del modelo sea seguro y autocompletado.24
Implementación de la Pantalla Diegética: RenderTexture
La funcionalidad del Pip-Boy como menú reside en su pantalla interactiva. Técnicamente, esto se logra renderizando una escena de React secundaria dentro de una textura que se aplica a la malla de la pantalla del modelo 3D.21 Este proceso utiliza lo que en gráficos se denomina FBO (Frame Buffer Object).21
Arquitectura de Escena dentro de Escena
El componente RenderTexture de la librería Drei actúa como un portal. Los elementos situados dentro de este componente no se renderizan en el Canvas principal, sino en un buffer de memoria que luego se proyecta como una textura map sobre un material.21
Para que la pantalla sea interactiva, R3F debe calcular la intersección del rayo (raycasting) no solo en el espacio del mundo, sino también traducir las coordenadas de esa intersección a las coordenadas UV de la malla de la pantalla.27 R3F maneja esta complejidad internamente, permitiendo que un botón <button> estándar de React dentro de la RenderTexture responda a eventos de puntero como si estuviera en un plano 2D normal.27

TypeScript


<mesh geometry={nodes.Screen.geometry}>
  <meshStandardMaterial>
    <RenderTexture attach="map" anisotropy={16}>
      <PerspectiveCamera makeDefault manual aspect={1} position={} />
      <color attach="background" args={['#001100']} />
      <TerminalUI />
    </RenderTexture>
  </meshStandardMaterial>
</mesh>


Esta técnica permite que el contenido de la pantalla (TerminalUI) sea un componente de React totalmente funcional con sus propios estados, efectos y lógica de negocio, aislado de la complejidad de la escena 3D exterior.21
Estética Retro-Futurista: Ingeniería de Shaders
Para que el Pip-Boy se sienta auténtico, la pantalla debe emular la tecnología de los monitores CRT de los años 50. Esto implica la creación de efectos visuales como líneas de escaneo (scanlines), parpadeo (flicker), distorsión esférica y aberración cromática.30 Estos efectos se implementan mediante fragment shaders escritos en GLSL.32
El Fragment Shader de la Terminal
Un fragment shader para un efecto CRT procesa cada píxel de la textura de la pantalla para alterar su color y luminosidad basándose en el tiempo y la posición.32 Un elemento clave es la generación de líneas horizontales oscuras que simulen la rejilla de apertura de un monitor antiguo.30
La intensidad de la línea de escaneo puede calcularse mediante una función sinusoidal que depende de la coordenada vertical UV:

Donde  es el nivel de brillo mínimo y  controla el contraste de las líneas.30 Al integrar esto en un shaderMaterial de R3F, se puede vincular el reloj de la escena (uTime) para que las líneas se desplacen sutilmente, aumentando el realismo del hardware antiguo.33
Post-procesamiento y Selectividad
Aunque se pueden aplicar efectos a toda la escena, el realismo diegético mejora si los efectos de post-procesamiento se limitan solo a la pantalla.36 El uso de EffectComposer permite añadir capas de ruido y resplandor (bloom) que hagan que el texto verde de la terminal parezca emitir luz física sobre el brazo del Pip-Boy.38 La selectividad se logra utilizando capas (layers) de Three.js para que el efecto de brillo solo afecte a los objetos en la capa de la terminal.36
Interactividad y Sistemas de Eventos en Espacios 3D
La navegación en un menú diegético requiere una gestión de eventos más compleja que la web tradicional. En R3F, los eventos de puntero no se basan en coordenadas de píxeles del DOM, sino en la intersección de un rayo proyectado desde la cámara con la geometría de la escena.28
Gestión de Raycasting y Propagación
Cuando el usuario hace clic en el Pip-Boy, es posible que el rayo atraviese varios objetos. Es crucial utilizar e.stopPropagation() en los manejadores de eventos para evitar que los clics en los botones de la interfaz disparen acciones en el fondo de la escena.29 Además, para un portfolio fluido, se debe implementar una lógica de "foco" donde la cámara se desplace automáticamente hacia una vista de primer plano de la pantalla cuando el usuario interactúa con ella.3
Para suavizar las transiciones de la cámara, se recomienda la librería camera-controls o el helper PerspectiveCamera de Drei con propiedades de makeDefault.2 La interpolación de la posición de la cámara debe realizarse utilizando funciones de damping para evitar movimientos bruscos que puedan causar desorientación o cinetosis en el usuario.16
Integración con el Estado de React
El menú diegético debe estar sincronizado con el resto de la aplicación de Next.js. Si el usuario selecciona un proyecto en la pantalla del Pip-Boy, este cambio debe reflejarse en el estado global. Zustand es la elección predilecta por su capacidad para manejar actualizaciones fuera del ciclo de renderizado de React, lo que es vital para mantener 60 FPS constantes en la escena 3D.1

JavaScript


const useStore = create((set) => ({
  currentTab: 'STATS',
  setTab: (tab) => set({ currentTab: tab }),
  selectedProject: null,
  selectProject: (id) => set({ selectedProject: id }),
}));


Este estado puede ser consumido tanto por los componentes de la RenderTexture (para mostrar la información correcta) como por los componentes del mundo exterior (para activar sonidos o cambios de iluminación ambiental).45
Optimización de Rendimiento y Memoria
Un menú 3D en un portfolio web puede ser costoso en términos de recursos. La optimización no es solo una mejora de calidad, sino una necesidad para garantizar la accesibilidad en dispositivos menos potentes.20
Estrategias de Carga y Suspense
Next.js y R3F permiten el uso de <Suspense /> para manejar los estados de carga de los modelos pesados.6 Se debe implementar un componente de carga (loader) que proporcione retroalimentación visual al usuario mientras se descargan los activos del Pip-Boy.6 El hook useProgress de Drei ofrece información en tiempo real sobre el porcentaje de descarga, lo que permite crear barras de progreso estilizadas con la estética de Fallout.6
Gestión del Bucle de Renderizado (Render Loop)
La mayor causa de lentitud en aplicaciones R3F es el exceso de trabajo en el hook useFrame. Este hook se ejecuta en cada cuadro del renderizado y debe usarse con extrema precaución.45 Cualquier mutación de objetos de Three.js debe hacerse directamente sobre las referencias (ref.current) para evitar re-renderizados innecesarios de React.45
Para optimizar el rendimiento de la CPU, se pueden utilizar técnicas de "renderizado bajo demanda". Por defecto, Three.js renderiza la escena continuamente, pero en un portfolio, se puede configurar el Canvas con frameloop="demand", lo que indica a R3F que solo debe renderizar un nuevo cuadro si hay cambios en el estado o interacciones del usuario, reduciendo drásticamente el consumo de batería en portátiles y móviles.1
Accesibilidad y Experiencia de Usuario (UX)
La creación de un menú 3D no exime al desarrollador de cumplir con las pautas de accesibilidad web (WCAG). Una interfaz diegética puede ser difícil de navegar para usuarios que dependen de lectores de pantalla o navegación por teclado.5
El Enfoque de react-three-a11y
La librería @react-three/a11y permite crear un puente entre el mundo 3D y el árbol de accesibilidad del navegador.5 Al envolver los componentes interactivos del Pip-Boy en un componente <A11y />, se genera un elemento HTML invisible pero real en el DOM que puede recibir el foco del teclado y ser leído por software de asistencia.5
Esto permite que un usuario presione la tecla Tab para navegar por las perillas del Pip-Boy, y que cada una sea anunciada correctamente (por ejemplo, "Perilla de selección de modo"). Cuando el elemento recibe el foco, se puede disparar una animación en la escena 3D para resaltar el objeto visualmente, manteniendo la coherencia entre la accesibilidad y la inmersión.3
El Futuro de las Interfaces Diegéticas: WebGPU y 2026
Mirando hacia el futuro cercano, la adopción masiva de WebGPU está redefiniendo los límites de lo que es posible en el navegador.11 WebGPU ofrece un acceso de menor nivel a la GPU, permitiendo el uso de compute shaders para simulaciones físicas que antes eran imposibles de ejecutar de manera fluida en la web.12
Para un portfolio con un Pip-Boy, esto significa que se podrán integrar efectos de iluminación global en tiempo real y reflejos físicos precisos en el cristal de la pantalla, haciendo que el dispositivo se sienta verdaderamente integrado en un entorno fotorrealista.12 La migración de los proyectos actuales de WebGL a WebGPU en R3F se ha simplificado gracias a los adaptadores de Three.js, permitiendo que las aplicaciones escalen automáticamente según las capacidades del hardware del usuario.12
Conclusión y Recomendaciones Finales
La creación de un menú 3D diegético tipo Pip-Boy para un portfolio en Next.js es un ejercicio de ingeniería que requiere una comprensión profunda del ciclo de renderizado, la optimización de activos y la integración de frameworks modernos. La clave del éxito radica en tratar la interfaz no como un gráfico estático, sino como un sistema dinámico de React que vive dentro de un entorno espacial optimizado.1
Se recomienda seguir un proceso de desarrollo iterativo:
Establecer la base: Configurar Next.js con un Canvas persistente y gestión de estado mediante Zustand.5
Pipeline de activos: Optimizar el modelo GLB con compresión Draco y convertirlo a JSX para manipulación declarativa.20
Implementar la pantalla: Utilizar RenderTexture para proyectar una sub-aplicación de React sobre la geometría de la pantalla.21
Refinar la estética: Desarrollar shaders personalizados para efectos CRT y configurar el post-procesamiento selectivo.30
Optimizar y hacer accesible: Ajustar el rendimiento para dispositivos móviles y asegurar que la interfaz sea navegable para todos los usuarios.5
Este enfoque garantiza que el portfolio no solo sea una muestra de habilidades artísticas, sino un testimonio de excelencia en ingeniería de software, capaz de ofrecer una experiencia fluida, accesible y tecnológicamente avanzada en el panorama digital de 2026.
Works cited
R3F - Introduction - React Three Fiber, accessed on February 4, 2026, https://r3f.docs.pmnd.rs/getting-started/introduction
Building a Realistic 3D Monitor with Reflections and HTML Interface ..., accessed on February 4, 2026, https://dev.to/blamsa0mine/building-a-realistic-3d-monitor-with-reflections-and-html-interface-using-react-three-fiber-4dcj
portfolio - Codesandbox, accessed on February 4, 2026, https://codesandbox.io/s/portfolio-f89bsw
MeshPortalMaterial - Drei, accessed on February 4, 2026, https://drei.docs.pmnd.rs/portals/mesh-portal-material
React Three Fiber and NextJS Starter Template, accessed on February 4, 2026, https://whoisryosuke.com/blog/2022/react-three-fiber-and-nextjs-starter-template
How to Build a Simple 3D Portfolio Website with Vite, React, Three.js, and Strapi, accessed on February 4, 2026, https://strapi.io/blog/build-a-simple-3-d-portfolio-website-with-vite-react-three-js-and-strapi
Making a very basic portfolio 3D-object website using react and three-fiber - Medium, accessed on February 4, 2026, https://medium.com/geekculture/making-a-very-basic-portfolio-3d-object-website-using-react-and-three-fiber-d2673e620dac
pmndrs/react-three-fiber: A React renderer for Three.js - GitHub, accessed on February 4, 2026, https://github.com/pmndrs/react-three-fiber
React Three Fiber for Displaying a glTF 3D Model - Thomas Derflinger, accessed on February 4, 2026, https://tderflinger.com/en/react-three-fiber-displaying-gltf-model
Getting Started: Installation - Next.js, accessed on February 4, 2026, https://nextjs.org/docs/app/getting-started/installation
Three.js in 2026 and beyond — where do you think it's really heading? : r/threejs - Reddit, accessed on February 4, 2026, https://www.reddit.com/r/threejs/comments/1qqdm49/threejs_in_2026_and_beyond_where_do_you_think_its/
What Changed in Three.js 2026? WebGPU, Vibe Coding & Beyond - Utsubo, accessed on February 4, 2026, https://www.utsubo.com/blog/threejs-2026-what-changed
How to integrate R3F into React (Next.js 15 & React 19)? : r/threejs - Reddit, accessed on February 4, 2026, https://www.reddit.com/r/threejs/comments/1jhh42d/how_to_integrate_r3f_into_react_nextjs_15_react_19/
Next.js 15, accessed on February 4, 2026, https://nextjs.org/blog/next-15
Installation - Introduction - React Three Fiber, accessed on February 4, 2026, https://r3f.docs.pmnd.rs/getting-started/installation
Basic 3D camera movement with React-three-fiber and maath library | by Sudeepto Bose, accessed on February 4, 2026, https://sudeeptobose.medium.com/basic-3d-camera-movement-with-react-three-fiber-and-maath-library-4b060bfe7c5c
How To Set Up Next.js 15 For Production In 2025 - Jan Hesters, accessed on February 4, 2026, https://janhesters.com/blog/how-to-set-up-nextjs-15-for-production-in-2025
transpilePackages - next.config.js, accessed on February 4, 2026, https://nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages
Guides: Package Bundling - Next.js, accessed on February 4, 2026, https://nextjs.org/docs/pages/guides/package-bundling
Optimizing 3D Models for the Web using Draco and other tools | Axel Cuevas, accessed on February 4, 2026, https://www.axl-devhub.me/blog/optimizing-3d-models
RenderTexture - Drei, accessed on February 4, 2026, https://drei.docs.pmnd.rs/portals/render-texture
Is there any way to speed up three js sites like mine with 3 models? - Stack Overflow, accessed on February 4, 2026, https://stackoverflow.com/questions/79130796/is-there-any-way-to-speed-up-three-js-sites-like-mine-with-3-models
Loading Models - Introduction - React Three Fiber - Poimandres, accessed on February 4, 2026, https://r3f.docs.pmnd.rs/tutorials/loading-models
GLTFJSX - React Three Fiber Tutorials, accessed on February 4, 2026, https://sbcode.net/react-three-fiber/gltfjsx/
Introduction to React-three-fiber Part 2 - Obytes, accessed on February 4, 2026, https://www.obytes.com/blog/introduction-to-react-three-fiber-part-2
Render Target - Wawa Sensei, accessed on February 4, 2026, https://wawasensei.dev/courses/react-three-fiber/lessons/render-target
drei/src/core/RenderTexture.tsx at master · pmndrs/drei - GitHub, accessed on February 4, 2026, https://github.com/pmndrs/drei/blob/master/src/core/RenderTexture.tsx
Events - React Three Fiber, accessed on February 4, 2026, https://r3f.docs.pmnd.rs/api/events
Events - React Three Fiber Tutorials, accessed on February 4, 2026, https://sbcode.net/react-three-fiber/events/
Creating a Fallout-Style UI Using Modern CSS - Codemotion, accessed on February 4, 2026, https://www.codemotion.com/magazine/frontend/creating-a-fallout-style-ui-using-modern-css/
How to Create Shader Transitions with React Three Fiber and Lygia (PART 2), accessed on February 4, 2026, https://wawasensei.dev/tuto/how-to-create-shader-transitions-with-react-three-fiber-and-lygia
react-three-fiber by example | A collection of examples of using react-three-fiber, accessed on February 4, 2026, https://onion2k.github.io/r3f-by-example/examples/materials/shader-material/
The Study of Shaders with React Three Fiber - Maxime Heckel's Blog, accessed on February 4, 2026, https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/
How to Code a Shader Based Reveal Effect with React Three Fiber & GLSL | Codrops, accessed on February 4, 2026, https://tympanus.net/codrops/2024/12/02/how-to-code-a-shader-based-reveal-effect-with-react-three-fiber-glsl/
Shader tutorial on creating a CRT effect in Unity (xpost /r/shaders) : r/Unity3D - Reddit, accessed on February 4, 2026, https://www.reddit.com/r/Unity3D/comments/2qyubt/shader_tutorial_on_creating_a_crt_effect_in_unity/
How to use post processing effects only on a single object? - three.js forum, accessed on February 4, 2026, https://discourse.threejs.org/t/how-to-use-post-processing-effects-only-on-a-single-object/42792
Applying postprocessing effect on certain 3D objects only - Stack Overflow, accessed on February 4, 2026, https://stackoverflow.com/questions/11360345/applying-postprocessing-effect-on-certain-3d-objects-only
Post processing - Wawa Sensei, accessed on February 4, 2026, https://wawasensei.dev/courses/react-three-fiber/lessons/post-processing
Outline - React Postprocessing, accessed on February 4, 2026, https://react-postprocessing.docs.pmnd.rs/effects/outline
React three fiber - setting up postprocessing using effectComposer and Passes (OutlinePass) from three.js addons - Stack Overflow, accessed on February 4, 2026, https://stackoverflow.com/questions/78738271/react-three-fiber-setting-up-postprocessing-using-effectcomposer-and-passes-o
Mouse pointer events in react threee fiber with next's - YouTube, accessed on February 4, 2026, https://www.youtube.com/watch?v=ZawNz59PsTQ
Help Needed with Raycasting in React Three Fiber and Three.js - Questions, accessed on February 4, 2026, https://discourse.threejs.org/t/help-needed-with-raycasting-in-react-three-fiber-and-three-js/70337
r3f add events on imported gltf dynamically - threejs - Reddit, accessed on February 4, 2026, https://www.reddit.com/r/threejs/comments/13hjd9t/r3f_add_events_on_imported_gltf_dynamically/
Camera Controls - Wawa Sensei, accessed on February 4, 2026, https://wawasensei.dev/courses/react-three-fiber/lessons/camera-controls
Performance pitfalls - React Three Fiber, accessed on February 4, 2026, https://r3f.docs.pmnd.rs/advanced/pitfalls
(React-three-fiber) Trying to understand the react workflow - Questions - three.js forum, accessed on February 4, 2026, https://discourse.threejs.org/t/react-three-fiber-trying-to-understand-the-react-workflow/46743
Managing Rendering & State · Issue #31 · pmndrs/react-three-fiber - GitHub, accessed on February 4, 2026, https://github.com/pmndrs/react-three-fiber/issues/31
