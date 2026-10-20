# Personaje y controles — 2026-10-20

## Ajuste posterior de zancada

La caminata actual usa apoyos en mundo e IK (`gait.ts`), balanceo de 300 ms y elevación de 4.5 cm; carrera de 200 ms y primer paso de 160 ms. El destino anticipa la posición del cuerpo al aterrizar y se adapta al frenado. Brazos y torso siguen la separación real de los pies. Las velocidades actuales compartidas entre teclado y clic son 1.6 m/s y 2.8 m/s; sustituyen los valores originales descritos en el registro inicial inferior.

Se validaron 113 tests de ciudad, lint y build Webpack con TypeScript. Las pruebas incluyen cadencia, alcance a distintos deltas y reposo después del frenado. Revisión local en tercera persona y por clic en isométrica; captura `2026-10-20-longer-stride.png`. La animación sigue siendo procedural; no se añadieron clips capturados ni se probaron teléfonos físicos.

## Registro de implementación inicial

Se implementó un cuerpo estilizado mediante geometría local redondeada y una jerarquía de articulaciones en `Avatar.tsx`. Chaqueta terracota con cierre y bolsillo, mochila verde, pantalón oscuro y zapatillas crema mantienen la paleta de la esquina. La careta y su textura se reutilizan sin editar; el SHA-256 de `public/profile.png` sigue siendo `2716fc268ffa995fa43ed36918804578bd3ede1a7b3b5ddfbd8e6620a320555e`, igual al informe de optimización anterior.

El reposo tiene respiración; caminar y correr articulan caderas, rodillas, tobillos, hombros y codos. La fase sigue la distancia recorrida, mientras la amplitud acompaña la velocidad y se amortigua al detenerse. Empujar una pared deja de generar pasos. No es un GLB con esqueleto ni animación capturada: el apoyo preciso de cada pie durante toda la zancada y los giros sobre el lugar todavía admiten pulido. La altura base de las suelas respeta las superficies existentes de calle, veredas, baldosas y galería.

`locomotion.ts` concentra el avance con aceleración, frenado, normalización de diagonales, deslizamiento por ejes contra obstáculos y giro por el ángulo más corto. Deshabilitar controles detiene la inercia inmediatamente para no mover al jugador bajo una ficha. Se limita el delta a 50 ms después de pausas. Las velocidades máximas originales se conservan: 3.5 m/s y 6.5 m/s.

La cámara conserva el arrastre y el pitch existentes, abre 0.6 m el encuadre al alcanzar la carrera y suaviza la mirada. El segmento completo desde el personaje se verifica antes y después del suavizado, con muestras de hasta 8 cm y el margen de colisión existente. Esto corrige el caso donde una posición de cámara válida podía interpolarse a través de una esquina. El volumen es horizontal y conservador: puede acercarse junto a bancos y faroles aunque el espacio superior esté libre.

Los controles táctiles incluyen ⇧ para correr mientras se mantiene presionado; liberación, cancelación y pérdida de captura limpian la tecla. Las cinco etiquetas tienen versión española e inglesa.

## Validación

- 45 tests de ciudad aprobados: 14 nuevos cubren locomoción, pausa/fichas, paredes, cámara, ruta y superficies. Una aserción por test.
- `npm run lint:city` aprobado.
- `npm run typecheck` aprobado y build final `npm run build -- --webpack` aprobado, incluida su comprobación TypeScript. Permanece el aviso preexistente sobre middleware.
- Build final: `HGd7qiyfiBS5xygnnj4KX`.
- Revisión visual en navegador local: frente de la careta, cuerpo desde atrás, caminar, correr, entrada y salida de la galería. Captura final: `2026-10-20-avatar-front.png`.
- `git diff --check` aprobado para cambios rastreados; los archivos de ciudad siguen sin estar rastreados, como al comenzar esta tarea.
- Corrida del build final: `benchmarks/2026-10-20-avatar-webgl-high-final.json`, WebGL2 alta, 1280 × 720, 74.97 FPS, frame p95 15.6 ms, dibujo p95 258; recorrido completo y sin errores/advertencias de consola capturados. Caché caliente, sin prueba de carga WAN.
- Primera corrida de producción antes del ajuste final de altura: `benchmarks/2026-10-20-avatar-webgl-high-1.json`, WebGL2 alta, 1280 × 720, 74.88 FPS, frame p95 14.3 ms, dibujo p95 258. Referencia local, no prueba estadística de equivalencia frente al baseline.

Pendientes: teléfono físico, multitouch real, GPU integrada, red limitada, animaciones de giro/apoyo preciso y nueva comparación WebGPU. No se instalaron dependencias ni se desplegó el portfolio. Todos los cambios y artefactos permanecen dentro de PORTFOLIO.
