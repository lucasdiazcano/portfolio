# Museo de trayectoria — 2026-10-20

El interior de DISTRITO pasa de tres esculturas a cinco espacios caminables. La entrada sigue en la esquina porteña. El edificio se extiende hacia el norte y un pasillo conecta cuatro puertas laterales:

| Sala | Identidad | Contenido |
| --- | --- | --- |
| 01 · Globant | Carbón y verde lima | Empleador y marco de las experiencias con clientes. Rol senior y entregas en equipo. |
| 02 · BBVA | Azul | Sala más amplia entre las cuentas de cliente. Mayor recorrido, contexto acumulado, autonomía y seniority actual; desarrollo e integración de features y despliegues. |
| 03 · Johnson & Johnson | Blanco y rojo | Aporte como senior al frontend, visualización, entregas y colaboración internacional. |
| 04 · Banco Hipotecario | Crema y naranja | Desarrollo frontend, integración y despliegue como senior dentro del equipo. |
| 05 · Formación | Ciruela y dorado | Dos capítulos separados: Psicología en Universidad de Palermo y bootcamp de desarrollo web en Plataforma 5. |

Las salas representan experiencias profesionales y formación. No contienen capturas, código, interfaces internas ni reproducciones de productos de clientes. Los textos no atribuyen liderazgo, creación integral de plataformas ni mejoras porcentuales sin sustento. No se infieren graduaciones, fechas educativas ni un ascenso a un cargo formal específico.

## Recorrido

Entrar por el arco lleva al salón Globant. Luego, por el pasillo central: primera puerta izquierda BBVA, primera derecha Johnson & Johnson, segunda izquierda Banco Hipotecario y segunda derecha Formación. E o el botón en pantalla abre el relato de la sala ocupada. El corredor no selecciona una cuenta por proximidad a través de una pared. La guía lateral, el nombre del lugar y el minimapa indican las cinco salas.

`museum.rooms` en cada locale es la fuente completa del contenido del museo. No se completan campos desde `projects.list`. El índice y `brandId` se verifican contra `MUSEUM_ROOMS`. Las paredes de `MUSEUM_WALLS` se usan tanto para geometría como para colisiones. Se retiraron pedestales y se trasladaron al frente los dos faroles que habrían quedado dentro del edificio ampliado.

`MuseumRooms.tsx` genera arquitectura, paneles descriptivos, pisos y zócalos por marca. `CityGame.tsx` presenta el rol y los capítulos. `PortenoCorner.tsx` conserva la fachada y actualiza el cartel a museo de trayectoria, con Globant en la entrada. Se conservan el personaje, la careta y los controles.

Se corrigieron también las descripciones antiguas en las páginas convencionales del portfolio, el hero y el perfil en español e inglés: ya no dicen que Lucas lideró los equipos o arquitectó y lanzó una plataforma completa ni prometen integridad del 100% o una reducción del 30%.

La fuente 3D local no incluye vocales acentuadas ni ñ. `Sign` elimina marcas diacríticas al generar geometría; los textos DOM y las traducciones conservan su ortografía.

## Verificación

- 80 tests aprobados; incluyen identidad y orden de las cinco salas en ambos idiomas, puertas abiertas, recorridos laterales, separación entre salas e interacción independiente del pasillo.
- TypeScript, lint de ciudad y build Webpack final aprobados. Permanece el aviso preexistente sobre middleware. Build: `LKDW3MIjz4vZ1l80BYBwc`.
- Revisión local por controles reales: entrada Globant, lectura de su vínculo laboral y del relato de BBVA, cruce a Johnson & Johnson y acceso a Formación y Banco Hipotecario. Los dos capítulos educativos se comprobaron en el diálogo.
- Capturas finales: `2026-10-20-museum-bbva.png` y `2026-10-20-museum-education.png`. Sin errores de consola capturados en la revisión final.
- No se repitieron benchmarks de rendimiento ni pruebas en teléfonos físicos. La ruta optativa existente ahora visita el salón Globant y se etiqueta `museum-globant-v1`; no se debe comparar como si fuera el antiguo recorrido de obra central.

No se instalaron dependencias ni se desplegó el portfolio. Los colores son una interpretación visual para el museo; la señalización usa texto y no logotipos oficiales.
