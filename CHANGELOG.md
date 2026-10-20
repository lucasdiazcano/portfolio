# Changelog

Historial del portfolio y de DISTRITO. Los cambios nuevos se agregan al principio, con fecha, alcance y validación. Este registro comienza con el prototipo de ciudad creado el 20 de octubre de 2026; no reconstruye cambios anteriores del repositorio.

## 2026-10-20

### Acceso a City desde la navegación principal

- `Navigation.tsx` incorpora el enlace `🏙️ CITY` junto a las demás secciones del portfolio, con el mismo estilo y estado activo. Utiliza el `Link` existente para conservar el idioma: `/es/city` o `/en/city`.
- Validación: revisión del enlace y de la configuración de rutas por idioma. No se ejecutaron pruebas adicionales, siguiendo la indicación del usuario.

### Zancada más amplia y caminata menos acelerada

- `gait.ts` reemplaza los pasos breves de 80–120 ms por balanceos de 300 ms al caminar y 200 ms al correr; el primer paso de arranque dura 160 ms. El aterrizaje se anticipa al avance del cuerpo, el arco de caminata baja a 4.5 cm y la interpolación suaviza despegue/llegada. Los destinos se adaptan al frenar y los apoyos conservan su anclaje mundial.
- Se ajustan las velocidades a 1.6 m/s caminando y 2.8 m/s corriendo para acompañar las piernas de 0.75 m. Teclado y navegación por clic comparten esas constantes. La cámara conserva su apertura de 0.6 m al correr.
- `Avatar.tsx` sincroniza brazos y balanceo del torso con los apoyos reales, eliminando su oscilador independiente. Se conserva la careta y el cuerpo existente.
- Verificación: 113 tests aprobados, incluidos cadencia a 20/30/60/75/120 FPS, alcance de apoyos al caminar/correr, elevación baja y reposo estable tras frenar. Lint de ciudad y build Webpack con TypeScript aprobados; permanece el aviso preexistente de middleware. La suite final se ejecutó después del build porque este limpia su carpeta temporal `.next/city-tests`.
- Revisión local en tercera persona: caminar, Shift para correr y frenado; revisión del desplazamiento por clic en isométrica. Captura: `docs/city/2026-10-20-longer-stride.png`. No se realizaron benchmarks ni pruebas en teléfonos físicos.


### Vista isométrica, navegación por clic y fichas del museo

- Se añadió cámara ortográfica isométrica como modo inicial, conservando tercera persona mediante selector o V. El cambio de cámara conserva la posición y cancela el destino anterior; la rueda controla zoom en isométrica.
- `navigation.ts` resuelve rutas A* con las colisiones existentes, respeta puertas, simplifica solo segmentos libres y limita cada paso al destino. Clic/toque en suelo mueve; etiquetas y guía de salas llevan al personaje y abren el relato al llegar. WASD recupera control manual; Shift permite correr. Destinos bloqueados se rechazan.
- `CityScene.tsx`, `MuseumRooms.tsx` y `PortenoCorner.tsx` incorporan recorte de paredes/fachada al entrar al museo en isométrica, etiquetas legibles y anillo de destino. Tercera persona conserva la arquitectura completa. La altura de edificios de entorno se reduce solo en isométrica para mejorar visibilidad.
- `CityGame.tsx` y CSS presentan el relato como ventana lateral sin cambiar la isométrica, con cierre visible, foco modal, Escape y presentación inferior en móvil. La guía de salas permanece disponible en ventanas angostas. Los controles originales se conservan en tercera persona.
- Verificación: 101 tests aprobados y TypeScript/lint aprobados durante la implementación. Build Webpack final aprobado con su comprobación TypeScript y aviso preexistente de middleware. Revisión local: clic sobre suelo, viaje desde plaza a BBVA por las puertas, llegada y apertura de ficha en isométrica, cierre y cambio a tercera persona conservando el marcador de posición, y regreso a isométrica. Sin errores de consola capturados. Capturas en `docs/city/2026-10-20-isometric-story.png` y `docs/city/2026-10-20-isometric-museum.png`. No se ejecutaron benchmarks ni pruebas físicas de teléfonos. No se instalaron dependencias ni se desplegó.
- Se documentó la interacción en `docs/city/ISOMETRIC.md` y una propuesta de dirección visual en `docs/city/VISUAL-DIRECTION.md`: kit de arte, materiales PBR, iluminación, personaje y ambientación, empezando por una sala BBVA terminada. Esas mejoras de arte son propuestas, no recursos finales ya producidos.

### Museo de trayectoria: Globant, clientes y formación

- Se reemplazaron las tres esculturas provisionales por cinco salones caminables: Globant como empleador y recepción, BBVA, Johnson & Johnson, Banco Hipotecario y Formación. La sala de BBVA es la más amplia entre las cuentas de cliente y destaca mayor recorrido y seniority actual, sin atribuir liderazgo.
- `MuseumRooms.tsx` incorpora pisos, zócalos, paneles y puertas con paletas por empresa; Formación reúne Psicología en Universidad de Palermo y bootcamp en Plataforma 5 como capítulos separados. No se incorporaron capturas, código ni material interno de clientes, ni se inventaron títulos educativos o fechas.
- `world.ts` comparte las paredes renderizadas con las colisiones, amplía el edificio y conserva un pasillo central abierto. Se retiraron pedestales y se movieron al frente dos faroles que habrían quedado dentro del museo. `PortenoCorner.tsx` actualiza el cartel y conserva la fachada.
- `museum.rooms` en español/inglés es la fuente completa del nuevo contenido. `CityGame.tsx` actualiza descripciones, rol, capítulos, guía de salas, ubicación y minimapa. Se conservan controles y careta. La fuente 3D local carece de acentos; `Sign` normaliza diacríticos solo para geometría y mantiene la ortografía en el DOM.
- Se corrigieron afirmaciones antiguas de liderazgo, plataforma completa y mejoras porcentuales en hero, perfil y descripciones de las páginas convencionales, en ambos idiomas. Los relatos describen trabajo senior dentro de los equipos, desarrollo de funcionalidades, integración y despliegues.
- Verificación: 80 tests aprobados, lint de ciudad y TypeScript aprobados durante la implementación. Revisión local por controles reales de las cinco salas; relato de BBVA y capítulos educativos verificados en sus diálogos. Se documenta alcance en `docs/city/MUSEUM.md`. Build Webpack final aprobado con comprobación de TypeScript; permanece el aviso preexistente de middleware. Capturas en `docs/city/2026-10-20-museum-bbva.png` y `docs/city/2026-10-20-museum-education.png`.
- No se ejecutaron nuevos benchmarks ni pruebas físicas de teléfonos. El diagnóstico optativo se adaptó a `museum-globant-v1` y no representa la ruta del baseline anterior. No se agregaron dependencias ni se desplegó; todo permanece en PORTFOLIO.

### Apoyo de pies y controles móviles

- `gait.ts` incorpora anclajes de tobillo en coordenadas del mundo, trayectorias elevadas para cada paso y cinemática inversa de dos segmentos. `Avatar.tsx` adapta rodillas y tobillos a esos apoyos y mantiene el cuerpo al alcance del pie inferior al subir a una superficie.
- Se conserva la orientación del pie apoyado durante los giros y se reinician anclajes al volver al spawn. Las posiciones fuera del alcance físico se limitan; no se implementaron pendientes arbitrarias ni captura de movimiento.
- `city.module.css` coloca correr junto a las flechas, respeta áreas seguras y muestra los controles también en ventanas de hasta 700 px.
- Antes de que el usuario solicitara cerrar las pruebas: 63 tests aprobados, lint de ciudad aprobado, TypeScript global aprobado y build Webpack aprobado con su aviso preexistente sobre middleware. Se revisaron avance, liberación y pausa en una vista móvil de navegador; esto no equivale a probar Safari en iPhone.
- ADB no encontró dispositivos Android y la consulta USB no detectó un iPhone. La prueba física quedó sin realizar. El último recorrido de rendimiento se inició, pero no se recogió su resultado; no se presenta como una medición validada. No se ejecutaron más pruebas tras la indicación del usuario.
- Captura de revisión móvil en `docs/city/2026-10-20-foot-contact-mobile.png`. No se agregaron dependencias ni se modificaron otros proyectos.

### Personaje articulado, locomoción y cámara

- `Avatar.tsx` reemplaza el cuerpo de bloques por una silueta redondeada con chaqueta, cierre, bolsillo, mochila, pantalón y zapatillas. La jerarquía local articula caderas, rodillas, tobillos, hombros y codos. Conserva `FaceMask.tsx`, el WebP y el original sin modificaciones (hash original verificado contra el informe previo).
- Reposo con respiración y transiciones caminar/correr; la fase de pasos depende de distancia realmente recorrida, sin seguir caminando contra una pared. Sigue siendo animación procedural, sin GLB externo ni captura de movimiento; apoyo exacto de pies y giros sobre el lugar requieren pulido adicional.
- `locomotion.ts` añade aceleración, frenado, diagonales normalizadas, giro por el ángulo corto y detención inmediata al deshabilitar controles. `CityScene.tsx` conserva entradas, recorrido de diagnóstico, colisiones y eventos de proximidad.
- La cámara abre ligeramente el encuadre al correr y comprueba todo el segmento al personaje antes y después del suavizado para evitar cortes a través de paredes. `world.ts` expone la altura de las superficies existentes para apoyar las suelas en calle, veredas, baldosas y galería.
- `CityGame.tsx` incorpora correr manteniendo ⇧ en controles táctiles y etiquetas de estos botones en español/inglés. No se agregaron dependencias ni se modificaron otros proyectos.
- Corrida final de producción completada en WebGL2 alta a 1280 × 720: 74.97 FPS, frame p95 15.6 ms y dibujo p95 258. Resultado original en `docs/city/benchmarks/2026-10-20-avatar-webgl-high-final.json`; captura en `docs/city/2026-10-20-avatar-front.png`. No establece equivalencia estadística ni rendimiento móvil.
- Verificación: 45 tests aprobados y lint de ciudad aprobado. TypeScript global y build Webpack final aprobados; evidencia visual y mediciones se documentan en `docs/city/AVATAR.md`. Se conserva la advertencia preexistente de middleware. Pendiente probar multitouch y rendimiento en teléfonos físicos.


### Careta optimizada y primera esquina porteña

- Se generó `public/city/textures/face-mask.webp`: 384 × 557 y 35228 bytes frente a los 583733 bytes originales (93.97 % menos). `public/profile.png` permanece intacto, verificado por SHA-256. `assets.ts` unifica el recurso para la careta y el diagnóstico; el contorno UV se conserva.
- Se agregó `scripts/optimize-city-portrait.mjs` y `assets:city` para regenerar el WebP y su informe usando Sharp ya disponible. No se instalaron dependencias ni se cambió el lockfile.
- `PortenoCorner.tsx` incorpora fachada crema y ladrillo, arcos, ventanas verdes, bronce, cornisas, carteles de calle, numeración, baldosas, bancos y faroles cálidos. Los carteles de empresas conservan sus identidades. Se comparten materiales y se instancian detalles; dos texturas procedurales pequeñas evitan nuevas descargas.
- Se extrajeron Block/Sign a `ScenePrimitives.tsx` para reutilizarlos sin cambiar su contrato. Se ajustó la iluminación de la escena; los seis faroles anteriores con luz individual se reemplazaron por seis faroles instanciados y dos luces de acceso.
- `world.ts` incorpora colisiones de bancos y faroles; tres tests nuevos verifican obstáculos y paso central. Verificación: 31 tests aprobados, ESLint de ciudad/script aprobado, TypeScript global aprobado y build Webpack aprobado. Advertencia preexistente de middleware pendiente.
- Revisión en navegador de producción: fachada, careta de frente y recorrido real a la ficha central completado, sin errores de consola en la revisión final. Una corrida WebGL alta a 1280 × 720 dio 74.97 FPS y p95 14.3 ms; resolución diferente del baseline, sin afirmar mejora comparativa ni rendimiento móvil.
- Evidencia en `docs/city/PORTENO-CORNER.md`, capturas, informe de textura y JSON de benchmark. Se actualizaron README, ROADMAP, VALIDATION y PERFORMANCE. Todo quedó dentro de PORTFOLIO; no se desplegó.

### Baseline de producción y prueba controlada WebGL/WebGPU

- Se agregaron `benchmark.ts`, `DiagnosticsProbe.tsx`, `DiagnosticsPanel.tsx` y `renderer.ts`. El diagnóstico solo se monta con `benchmark=1`; WebGPU se importa dinámicamente al solicitarlo y registra el backend efectivo, incluida la etiqueta de fallback.
- El recorrido medido usa el controlador y las colisiones reales: spawn, calentamiento de 5 segundos, ida a la obra central, apertura de ficha durante 2 segundos, regreso y cooldown de 2 segundos. Se invalidan corridas por pérdida de foco, desviación de ruta o timeout; no hay telemetría externa.
- Se registran intervalos p50/p95, FPS derivados de duración total, contadores de dibujo con sombras, geometrías/texturas, heap JS opcional y Resource Timing con alcance de caché explícito. No se presentan esos datos como tiempo GPU, VRAM ni carga fría por Internet.
- Se completaron tres corridas de producción WebGL y tres WebGPU reales, todas con viewport 768 × 690, buffer 922 × 828 y calidad alta. Medianas: 74.97 FPS en ambos; p95 15.0 ms en WebGL y 14.3 ms en WebGPU, con rangos superpuestos. WebGL sigue siendo el renderer predeterminado.
- Evidencia reproducible: seis JSON y resumen/build ID en `docs/city/benchmarks`, captura en `docs/city/2026-10-20-renderer-benchmark.jpg` e informe en `docs/city/PERFORMANCE.md`. Se actualizaron README y avance parcial de `ROADMAP.md`.
- Verificación: 28 tests aprobados, TypeScript global y ESLint de la ciudad aprobados y build de producción con Webpack aprobado. Se corrigió durante la implementación una reinicialización por actualizar estado dentro de la factory async y se comprobó el arranque estable antes de medir.
- Pendiente: preset ligero, fallback en dispositivo sin WebGPU, GPU integrada/teléfono físico, red limitada y medición de GPU/VRAM. No se publicó en producción ni se instaló ninguna dependencia; todos los cambios y artefactos permanecen dentro de PORTFOLIO.

### Careta fotográfica del personaje

- Se agregó `src/features/city/FaceMask.tsx`: la foto existente `public/profile.png` se proyecta sobre una silueta plana de cara, pelo y orejas mediante coordenadas UV. El archivo original no se modificó ni se enviaron imágenes a servicios externos.
- La careta tiene tamaño exagerado, reverso color cartón y una tira de sujeción. Está dentro del grupo del personaje, por lo que acompaña su orientación y animaciones; reemplaza el visor frontal del avatar provisional.
- La textura se carga con la caché de Drei y Suspense; la geometría se crea una vez por montaje y se libera al desmontar.
- Verificación: ESLint de `FaceMask.tsx` y `CityScene.tsx` y TypeScript global aprobados. Prueba visual en navegador tras recarga: foto de frente y reverso al cambiar de dirección. Captura en `docs/city/2026-10-20-face-mask.jpg`.
- Cambio visual localizado: no se repitieron los tests de colisiones ni el build de producción. Todas las modificaciones y la captura quedaron dentro de PORTFOLIO.

### Identidad por empresa y base técnica verificable

- Se agregó `src/features/city/brands.ts` con las paletas basadas en las referencias del usuario: BBVA azul, Johnson & Johnson rojo y Banco Hipotecario naranja. Los nombres de carteles usan texto provisional, no logotipos oficiales.
- Se declaró `brandId` en los proyectos de `messages/en.json` y `messages/es.json`. La identidad y la escultura dependen de la empresa, no de su índice en la lista.
- Paneles y esculturas 3D, pedestales, carteles de entrada, guía de empresas, botón de interacción y cabecera de ficha comparten esa identidad. Se agregaron colisiones para los pedestales.
- Se corrigieron los cinco errores globales de TypeScript en `ColorSlider.tsx` y `PipBoyColorContext.tsx` mediante tipos explícitos y argumento de contexto; se conservaron el callback opcional y el contexto ausente como `undefined`.
- Se agregaron `scripts/test-city.mjs` y los comandos `lint:city`, `test:city` y `typecheck`, sin instalar dependencias. Los tests generan sus artefactos dentro de `.next/city-tests` del proyecto.
- Se actualizaron el README y el estado parcial de fase 0 en `ROADMAP.md`; `AGENTS.md` registra el límite de escritura dentro de PORTFOLIO.
- Verificación: 17 tests aprobados, TypeScript global aprobado, lint de archivos modificados aprobado sin advertencias y build de producción `next build --webpack` aprobado. El intento predeterminado con Turbopack fue interrumpido y no se da por aprobado; el bundler predeterminado permanece sin cambios.
- Prueba manual: recorrido de galería y apertura de las fichas de las tres empresas. Captura y detalle en `docs/city/2026-10-20-company-gallery.jpg` y `docs/city/VALIDATION.md`.
- Pendiente: mediciones de rendimiento, comparación WebGL/WebGPU y dispositivos reales. No se cambió el renderer ni se completó la fase 0; no se desplegó en producción.

### Plan de producción de DISTRITO

- Se agregó `ROADMAP.md` con fases, entregables, criterios de cierre, estructura de proyecto y presupuestos iniciales de rendimiento.
- Se propone evaluar WebGPU mediante una comparación reproducible y WebAssembly mediante bibliotecas con una necesidad concreta; no se modificó el renderer ni se instalaron dependencias.
- El plan incluye arte y personaje riggeado, controles, contenido profesional, optimización y carga de recursos, accesibilidad, pruebas, publicación e iteración rápida.
- Validación: revisión del prototipo y configuración actuales y consulta de documentación oficial de Three.js, React Three Fiber y Rapier. Los presupuestos son objetivos propuestos, no mediciones. Cambio documental; no se volvieron a ejecutar pruebas de código.

### Registro continuo de cambios

- Se creó este `CHANGELOG.md` con la implementación inicial, tecnologías, verificaciones y límites del prototipo.
- Se agregó `AGENTS.md` en la raíz del proyecto para exigir la actualización de este registro en las modificaciones sucesivas de código, recursos, configuración y documentación.
- Validación: revisión de los archivos de la ciudad, su README y las dependencias declaradas. Este cambio solo agrega documentación; no se volvieron a ejecutar pruebas de código.

### DISTRITO — primera zona jugable

#### Implementación

- Rutas nuevas `/es/city` y `/en/city`, con importación dinámica del juego y renderizado del cliente.
- Código separado en `src/features/city/`; se conservaron las páginas existentes, el Pip-Boy, las dependencias y los archivos de configuración del proyecto.
- Escenario procedural con calle, paso peatonal, edificios, ventanas instanciadas, carteles con fuente local, luminarias, jardineras y galería transitable.
- Personaje provisional articulado, modelado mediante geometrías, con animación procedural de reposo, marcha y carrera.
- Movimiento en tercera persona con WASD o flechas, carrera con Shift y cámara que sigue al personaje y gira al arrastrar.
- Colisiones horizontales con edificios, paredes, jardineras y límites del distrito; aproximación de cámara para evitar atravesar obstáculos.
- Tres exhibiciones basadas exclusivamente en los proyectos reales de `projects.list` del idioma activo. La tecla E o el botón de interacción abre el detalle del proyecto en un diálogo.
- Interfaz con minimapa, posición del personaje, enlaces a proyectos, perfil y Pip-Boy, menú de pausa y retorno a la plaza.
- Botones de movimiento para dispositivos táctiles, diseño adaptable y opciones de calidad: alta con sombras y DPR limitado a 1.5; ligera sin sombras y DPR 1.
- Limpieza de teclas y pausa al perder foco u ocultar la pestaña. El menú de pausa detiene el bucle de renderizado.
- Recuperación ante errores de renderizado, acceso directo a los proyectos y diálogo con foco nativo, cierre con Escape y nombre accesible.
- README del prototipo y diez pruebas de colisiones, límites y selección de exhibiciones.

#### Tecnología utilizada

- Next.js 16 y React 19 para la aplicación y la ruta del juego.
- TypeScript para la escena, controles, contratos y reglas del mundo.
- Three.js para renderizado 3D mediante WebGL; esta versión no implementa WebGPU ni WebAssembly.
- React Three Fiber para integrar la escena y el bucle de animación con React.
- Drei para cartelería 3D (`Text3D` y `Center`), utilizando la fuente ya disponible en `public/fonts/helvetiker_regular.typeface.json`.
- CSS Modules para la interfaz y next-intl para reutilizar los proyectos traducidos y detectar el idioma activo.
- ESLint, TypeScript y `node:test` para las verificaciones. No se instalaron dependencias nuevas.

#### Archivos agregados

- `src/app/[locale]/city/page.tsx`
- `src/features/city/CityGame.tsx`
- `src/features/city/CityScene.tsx`
- `src/features/city/city.module.css`
- `src/features/city/world.ts`
- `src/features/city/world.test.ts`
- `src/features/city/README.md`

#### Verificación realizada

- Las diez pruebas de `world.test.ts` pasaron, compiladas temporalmente a CommonJS con el TypeScript del proyecto y ejecutadas con `node --test`.
- ESLint pasó para `src/features/city` y la ruta de la ciudad.
- TypeScript pasó para la ciudad utilizando una configuración temporal que hereda la del proyecto y limita los archivos incluidos.
- El chequeo global de TypeScript encontró cinco errores preexistentes: tres errores de tipos implícitos en `ColorSlider.tsx` y dos en `PipBoyColorContext.tsx` (argumento ausente de `createContext` y tipo implícito de `children`). No se modificaron esos archivos.
- Prueba manual en navegador: entrar al distrito, caminar desde la plaza hasta la galería, acercarse a una obra, abrir el proyecto de Johnson & Johnson con E, cerrar el diálogo, pausar, elegir calidad ligera y volver a la plaza.
- Revisión de la entrada en inglés a ancho móvil y de las dimensiones del contenido para comprobar que cabe en el viewport.
- No se ejecutó un build de producción ni se midieron FPS. No se verificaron los controles en un dispositivo táctil físico.

#### Estado y límites

- Prototipo jugable con arte provisional, no una ciudad o un personaje de producción.
- Solo la galería tiene un interior visitable; los demás edificios son escenario. Los accesos al perfil y Pip-Boy navegan a sus páginas existentes.
- Las obras son esculturas abstractas de referencia, no capturas ni demos ejecutables de los proyectos.
- No incluye vehículos, audio, multijugador, persistencia de partida ni un motor WASM.
- Se probó con un servidor local; no se desplegó en el sitio público.
