# DISTRITO — plan de producción

Fecha: 2026-10-20. Estado: propuesta de trabajo; ninguna fase de este documento se considera implementada por estar descrita aquí.

Avance verificado del 2026-10-20: identidades por empresa incorporadas a la galería, errores globales de TypeScript corregidos, comandos de validación reproducibles y build de producción con Webpack aprobado. Detalle en `docs/city/VALIDATION.md` y `CHANGELOG.md`.

Actualización de mediciones: completado el baseline local de producción con tres recorridos WebGL y tres WebGPU reales bajo la misma resolución/calidad. Se conserva WebGL por defecto; la comparación no mostró incremento de FPS. Evidencia y decisión en `docs/city/PERFORMANCE.md`. La fase 0 sigue parcialmente abierta por la matriz física de dispositivos, red limitada y validación de fallback; ya no queda pendiente la comparación local inicial.

Actualización de arte: fachada de galería porteña con arcos, cornisas, ventanas, bancos, faroles, carteles y baldosas implementada. Careta optimizada a WebP conservando la foto original. Es una primera muestra de dirección de arte; no cierra la fase de personaje ni reemplaza el resto del blockout. Ver `docs/city/PORTENO-CORNER.md`.

## Resultado buscado

Un portfolio que se recorre como un juego en tercera persona, ambientado en una Buenos Aires retrofuturista de autor. Un personaje cuidado explora un distrito compacto y entra a edificios que presentan proyectos, trayectoria y experimentos. El visitante puede conocer el trabajo en menos de un minuto o quedarse a explorar.

Primera experiencia de producción: plaza y calle con identidad visual, personaje riggeado y animado, galería con tres casos de estudio, estudio personal y dispositivo de navegación. Alcance posterior: laboratorio interactivo y una misión corta que conecte esos espacios. Vehículos y expansión del mapa se evalúan después.

La web convencional sigue disponible con enlaces directos. El contenido profesional debe ser accesible sin jugar y sin inicializar el motor 3D.

## Decisiones técnicas propuestas

- Mantener inicialmente Next.js, React, TypeScript, Three.js y React Three Fiber. El prototipo ya permite validar la experiencia; no hay evidencia que justifique reescribirlo en otro motor.
- Conservar un único repositorio y una aplicación. Separar la experiencia dentro de `src/features/city`. No crear un monorepo, un paquete por sistema ni otro proceso de build sin una necesidad medida.
- Evaluar WebGPU temprano, antes de producir los materiales y efectos definitivos. Hacer una comparación acotada con WebGL sobre la misma escena y hardware. La decisión incluye calidad, compatibilidad, memoria, tiempos de arranque y mantenimiento, no solo FPS.
- Three.js documenta `WebGPURenderer` con backend WebGPU y alternativa WebGL 2. Eso no garantiza que cada efecto o dependencia del proyecto funcione en ambos: validar materiales, luces, sombras, fuentes, carga y postprocesado con las versiones instaladas.
- Incorporar WebAssembly mediante una biblioteca concreta cuando aporte una función: por ejemplo, evaluar Rapier para el controlador del personaje y las interacciones físicas. Compararlo con las necesidades reales antes de reemplazar las colisiones simples. No convertir el código de React a WASM.
- Mantener la simulación y las actualizaciones por frame fuera del estado de React. Estado de UI solo para transiciones observables: menú, obra seleccionada, calidad, misión y navegación.
- Una fuente de contenido compartida entre páginas y ciudad. Empezar con `projects.list`; cuando los casos requieran imágenes, enlaces y métricas, definir un contrato y migrar ambos consumidores explícitamente. No mantener copias divergentes.

## Fase 0 — base verificable y decisiones de plataforma

1. Registrar un recorrido de prueba reproducible: plaza → galería → abrir obra → regresar. Relevar versión de navegador, dispositivo, resolución y preset.
2. Medir versión de producción: descarga inicial, tiempo hasta poder moverse, tiempos de frame p50/p95, llamadas de dibujo, triángulos y estabilidad de memoria. Separar carga, compilación de shaders, CPU y GPU; anotar cuándo una métrica no está disponible.
3. Confirmar y corregir de forma localizada los errores globales de TypeScript previamente encontrados. Agregar comandos reproducibles de lint, typecheck, tests y build; correrlos en CI con el Node admitido por la versión de Next instalada.
4. Probar WebGPU en una rama o cambio reversible sobre la misma escena. Validar también la alternativa WebGL 2 y registrar la decisión antes de crear shaders definitivos. Si la prueba requiere migrar dependencias o rehacer efectos, documentar ese costo.
5. Fijar una matriz mínima con hardware identificado: un equipo de escritorio con GPU integrada, otro con GPU dedicada y un teléfono real. Elegir los navegadores objetivo y la experiencia que recibe cada uno.

Entrega: baseline reproducible, build comprobado y decisión de renderer documentada. Salida: no quedan errores de tipo/build sin explicar y se conocen los límites del primer dispositivo objetivo.

## Fase 1 — dirección de arte y personaje

1. Definir una guía visual: arquitectura porteña, paleta, hora, iluminación, señalética, materiales, silueta del personaje y referencias. Preparar un plano del distrito y una toma objetivo para la plaza y la galería.
2. Elegir una identidad gráfica coherente. Aprobar una escena pequeña con calidad final antes de producir el barrio entero: una fachada, vereda, luminaria y personaje bajo la misma luz.
3. Crear o adquirir con licencia un personaje en Blender u otra herramienta de modelado: malla, UV, texturas PBR y esqueleto. Registrar procedencia, atribución y condiciones de uso de cada recurso.
4. Exportar GLB con clips de reposo, caminar, correr, girar e interactuar. Verificar escala en metros, pivote, orientación, materiales y reproducción de animaciones en el renderer elegido.
5. Usar IA para explorar conceptos y acelerar tareas de producción; revisar manualmente topología, rig, materiales, licencias y resultado en el juego. Una imagen generada no equivale a un modelo riggeado listo para producción.

Entrega: guía visual, personaje y una esquina con arte final. Salida: el conjunto se reconoce como un mismo mundo y cumple el presupuesto inicial en el dispositivo objetivo.

## Fase 2 — control y sensación de juego

1. Separar el control del personaje de la representación visual para reemplazar el avatar sin alterar movimiento y colisiones.
2. Añadir aceleración, desaceleración, giro y mezcla de animaciones en función de la velocidad real. Evitar deslizamiento de pies y corregir el movimiento diagonal.
3. Mejorar la cámara: sensibilidad, suavizado, límites, obstáculos y transiciones al entrar en interiores. Evaluar un controlador cinemático con colisionador de cápsula para escalones y pendientes; adoptar Rapier si resuelve esas necesidades con costo aceptable.
4. Unificar acciones de teclado, mouse y táctil. Limpiar entradas al perder foco, abrir un diálogo o cambiar de ruta. Si se usa pointer lock, pedirlo mediante una acción explícita y permitir liberarlo con Escape.
5. Implementar interacción consistente por proximidad y orientación, con señal visible y alternativa accesible. Probar paredes finas, esquinas, puertas, cambios de FPS y retorno al punto seguro.
6. Añadir sonido de pasos y ambiente con activación tras interacción del usuario, control de volumen, mute y suspensión cuando corresponda.

Entrega: personaje final recorriendo la primera zona. Salida: diez minutos de recorrido sin atravesar paredes, perder controles ni sufrir saltos de cámara; validación adicional en teléfono real.

## Fase 3 — galería y contenido profesional

1. Reemplazar las esculturas provisionales por instalaciones propias de cada proyecto: composición, capturas autorizadas y una interacción que ayude a entender el trabajo.
2. Preparar cada caso: problema, rol personal, decisiones, restricciones, resultado y evidencia. No inventar métricas ni publicar material interno de clientes.
3. Compartir identificadores y contenido con la página convencional. Mantener URLs enlazables para cada caso y estados claros cuando no exista una demo pública.
4. Construir el estudio con trayectoria y contacto; integrar el Pip-Boy como mapa y acceso rápido. Reutilizar su contenido y lenguaje visual sin montar una segunda escena costosa permanentemente.
5. Localizar interfaz, controles y contenido en español e inglés. Sustituir gradualmente los textos incrustados de la nueva experiencia por claves de traducción.
6. Hacer que una persona recién llegada encuentre un proyecto o contacto en pocos pasos, sin completar misiones.

Entrega: portfolio profesional completo dentro y fuera del mundo. Salida: navegación, foco de diálogos, teclado, enlaces y cambio de idioma funcionan; el contenido esencial permanece disponible sin WebGL/WebGPU.

## Fase 4 — producción de recursos y rendimiento

1. Mantener archivos fuente de arte separados de los exportados para runtime. Crear un manifiesto tipado de recursos: URL versionada, tamaño, distrito, licencia y perfil de calidad.
2. Optimizar GLB con herramientas de glTF; comparar Meshopt/Draco según descarga y decodificación. Evaluar KTX2/Basis para texturas con los decodificadores servidos desde el propio sitio. Probar soporte y costos en el renderer elegido.
3. Usar módulos arquitectónicos, materiales compartidos, instancing y LOD cuando correspondan. Colisionadores simples independientes de la malla visual. Revisar geometría y resolución de texturas por importancia en cámara.
4. Priorizar iluminación horneada o estática cuando sirva al diseño; limitar luces dinámicas y sombras. Agregar reflejos, niebla, lluvia y postprocesado uno por vez con comparación visual y de rendimiento.
5. Cargar primero el personaje y la plaza. Cargar interiores y detalles al aproximarse, con precarga y caché acotadas. Desmontar una zona debe liberar recursos exclusivos sin destruir los compartidos.
6. Implementar presets y ajuste de resolución con histéresis para evitar oscilaciones. No depender solo de identificar el navegador o del DPR del dispositivo para estimar su capacidad.
7. Medir volver al mismo espacio varias veces y alternar entre ciudad y páginas. Buscar pérdida de contextos, eventos duplicados, fuga de memoria y descargas repetidas.

Presupuestos iniciales propuestos, sujetos al baseline y al dispositivo acordado:

| Métrica | Objetivo inicial |
| --- | --- |
| Fluidez de escritorio | 60 FPS objetivo; frame p95 ≤ 20 ms en el recorrido acordado |
| Teléfono en calidad ligera | 30 FPS objetivo; frame p95 ≤ 40 ms, con prueba sostenida de 10 minutos |
| Transferencia hasta la primera zona jugable | ≤ 12 MB comprimidos, sumando JS y recursos necesarios |
| Tiempo hasta control en carga fría | ≤ 8 segundos con perfil documentado de 20 Mbps y 50 ms de latencia |
| Llamadas de dibujo en la plaza | Presupuesto inicial ≤ 200; revisar junto con materiales y tiempo GPU |
| Navegación convencional | No cargar el módulo de la ciudad al visitar solo perfil o proyectos |
| Memoria | Sin crecimiento sostenido tras ciclos repetidos; fijar techo después de medir hardware y recursos finales |

No son resultados medidos ni promesas universales. Medir calentamiento, batería y pausas de carga; distinguir primera visita de caché caliente. Usar WebGPU o WASM no exime de cumplir estos presupuestos.

Entrega: primer distrito con arte final y perfiles medidos. Salida: presupuesto cumplido o desviación documentada con corrección acordada antes de ampliar el mapa.

## Fase 5 — personalidad, publicación y operación

1. Añadir una misión de 3–5 minutos que conecte galería, estudio y laboratorio; descubrimientos opcionales y un final propio. Mantener acceso inmediato al contenido profesional.
2. Diseñar una entrada breve, transiciones de espacios y feedback de interacción. Respetar reducción de movimiento, mute, controles alternativos y contraste de UI.
3. Agregar una prueba end-to-end del recorrido principal, además de pruebas focalizadas de movimiento, proximidad, carga y navegación. Comparar capturas en vistas conocidas; no confundir una captura con una prueba de rendimiento.
4. Verificar build de producción en Chrome, Edge, Firefox y Safari de los dispositivos acordados. Probar capacidades ausentes y pérdida de contexto, navegación de vuelta, touch físico y tamaños de pantalla.
5. Publicar una preview, medir desde el hosting real, revisar caché/CDN y confirmar que assets y decodificadores funcionan. Promover a producción solo tras revisar el resultado concreto y conservar una versión anterior recuperable.
6. Registrar errores sin datos sensibles. Si se añade analítica, definir primero qué decisión justifica cada evento y su tratamiento de privacidad. Guardar reportes de calidad y actualizar `CHANGELOG.md` en cada cambio.

Entrega: versión pública con recorrido completo y evidencia de calidad. Salida: enlaces estables, fallback funcional, recursos con licencias registradas y plan de recuperación comprobado.

## Estructura objetivo, creciendo cuando se necesite

```text
portfolio/
  AGENTS.md
  CHANGELOG.md
  ROADMAP.md
  art-source/                  # Blender y fuentes de arte; no se sirven al visitante
  public/city/                 # GLB, texturas, audio y decodificadores optimizados
  src/app/[locale]/city/       # Entrada de Next; sin lógica de simulación
  src/features/city/
    CityGame.tsx              # Composición y ciclo de vida de la experiencia
    scene/                    # Distrito, interiores, luces y renderer
    player/                   # Control, cámara y animación
    interaction/              # Selección de obras y objetos utilizables
    assets/                   # Manifiesto, carga y propiedad de recursos
    ui/                       # HUD, mapa, menús y diálogos
    world.ts                  # Datos espaciales y reglas compartidas
  src/content/                # Contrato compartido cuando se amplíen los casos
  tests/e2e/                  # Recorridos del navegador cuando se incorpore el runner
```

Esta estructura es una dirección, no una tarea de crear carpetas vacías. Extraer responsabilidades al modificarlas o cuando crezcan. Mantener pruebas unitarias junto al módulo probado. No añadir ECS, event bus global o wrappers de Three sin una necesidad concreta.

Para iterar y compilar rápido: recurso del distrito bajo carga dinámica, tareas de arte incrementales, caché de exportaciones basada en cambios y herramientas de diagnóstico solo en desarrollo. No procesar todos los modelos en cada guardado de TypeScript. Medir arranque frío, recompilación y navegación; modificar la configuración del bundler únicamente si el perfil lo justifica.

## Próxima entrega concreta

Ejecutar fase 0 y producir la muestra visual de fase 1: un personaje riggeado frente a una esquina porteña y la entrada de la galería. Decidir el renderer con esa muestra antes de extender el mapa. La siguiente entrega debe mejorar tanto el aspecto como la sensación de juego y adjuntar mediciones comparables.

## Fuentes técnicas consultadas

- Three.js, WebGPURenderer: https://threejs.org/docs/pages/WebGPURenderer.html
- React Three Fiber, Canvas y configuración de WebGPU: https://r3f.docs.pmnd.rs/api/canvas
- Rapier, integración JavaScript y WebAssembly: https://rapier.rs/docs/user_guides/javascript/getting_started_js/

Las páginas actuales describen capacidades generales. Confirmar APIs y compatibilidad contra las versiones instaladas al implementar cada fase.
