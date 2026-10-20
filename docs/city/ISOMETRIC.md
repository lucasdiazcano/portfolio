# Isométrica y tercera persona — 2026-10-20

Se agregó una cámara ortográfica con orientación isométrica como vista inicial y un selector para conservar la tercera persona. V alterna las vistas; el cambio conserva la posición del personaje. El diagnóstico optativo conserva su recorrido en tercera persona.

## Interacción

- Clic o toque sobre suelo libre: caminar hasta el punto. La rueda modifica el zoom isométrico.
- Clic en una etiqueta de sala o en la guía: encontrar una ruta hacia esa sala y abrir su relato al llegar.
- Un clic nuevo sustituye el destino. WASD cancela la orden y permite control manual. Shift permite correr.
- El destino se indica con un anillo; se informa llegada o falta de acceso. Un punto bloqueado se rechaza sin inventar otro destino.
- La ficha aparece como ventana lateral sobre la isométrica, sin cambiar cámara; mantiene foco modal, cierre visible y Escape. En ancho móvil es una ventana inferior que conserva parte del mundo visible.
- Tercera persona mantiene cámara al arrastrar, teclado y controles táctiles previos.

`navigation.ts` usa A* sobre una grilla de 0.5 m y consulta la misma función `canWalk` de las colisiones. Los segmentos se validan con pasos de hasta 0.1 m y solo se simplifican si toda la trayectoria está libre. El seguidor acelera y limita el último paso al punto exacto, sin sobrepasarlo ni atravesar una esquina. No se agregó motor físico ni dependencia de navegación.

Al entrar al museo en isométrica, las paredes pasan a una altura de lectura de maqueta y se ocultan fachada y paneles altos. La colisión completa se conserva. Las etiquetas DOM reemplazan la función de lectura de esos carteles desde arriba. En tercera persona vuelve la arquitectura completa. Los edificios de entorno se muestran con altura reducida en isométrica para limitar oclusiones.

## Alcance de verificación

- 101 tests aprobados, incluidos destinos exactos, recorrido de las cinco salas, segmentos seguros, puertas y rechazo de obstáculos.
- TypeScript, lint y build Webpack final aprobados. Permanece el aviso preexistente de middleware. Build: `INShtP0LY0GWCojDn1-kY`.
- Revisión local: clic en suelo y llegada; ruta desde plaza hasta BBVA y apertura automática de su relato; cierre por botón y regreso a tercera persona conservando el marcador de posición; vuelta a isométrica. Sin errores de consola capturados.
- Capturas: `2026-10-20-isometric-story.png` y `2026-10-20-isometric-museum.png`.
- Sin nuevos benchmarks ni pruebas en teléfonos físicos. La navegación es horizontal sobre la geometría estática actual; una futura escalera o pendiente necesita extender ese contrato.

Las propuestas de mejora de arte e iluminación están en `VISUAL-DIRECTION.md` y no se presentan como implementadas.
