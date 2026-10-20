# Dirección visual propuesta para DISTRITO

Propuesta, no arte final implementado. Fecha: 2026-10-20.

## Objetivo

Un diorama porteño estilizado con calidad de juego cuidado: arquitectura reconocible, materiales con carácter, luz cálida y un museo legible desde isométrica y tercera persona. El contenido sigue siendo la trayectoria profesional; la ambientación no necesita mostrar productos confidenciales.

La base actual resuelve recorrido y contenido. El mayor salto perceptual vendría de autoría de arte y composición. Las formas genéricas, superficies de color uniforme y salas poco amuebladas todavía hacen visible la etapa de prototipo.

## Orden de trabajo recomendado

1. **Una sala y su acceso con arte final.** Empezar por BBVA: piso de piedra o madera, zócalos y señalización azules, metal cepillado, carpintería y muebles de museo. Reservar el azul intenso para elementos que guíen la mirada. Diseñar un módulo de pared con espesores, marcos y cantos biselados; después replicar el sistema en las demás salas.
2. **Materiales diferenciados.** Cerámica, madera, revoque, ladrillo, tela y metal necesitan rugosidad y detalle de superficie distintos. Crear texturas de color, normales y rugosidad coherentes; evitar estirar una textura o aumentar resolución sin corregir UVs y escala. Three.js ya dispone de un material PBR con estas capacidades; no hace falta cambiar el motor para incorporarlas. [MeshStandardMaterial](https://threejs.org/docs/pages/MeshStandardMaterial.html).
3. **Iluminación diseñada por ambiente.** Exterior con una hora del día definida; interiores con luz de exposición cálida, contraste controlado y sombras de contacto. Evaluar iluminación y oclusión precalculadas para arquitectura estática, con un conjunto pequeño de luces dinámicas. Afinar alcance y resolución de sombras antes de sumar efectos. Una exposición y corrección de color comunes deben unir las salas.
4. **Personaje de autor.** Cuerpo modelado, mejor silueta, manos, ropa, articulaciones y animaciones de caminar/correr/girar. Conservar la careta fotográfica como decisión de identidad. Priorizar el contorno y la lectura a distancia en isométrica y los detalles de ropa a corta distancia.
5. **Ambientación con intención.** Bancos, alfombras, luminarias, plantas y vitrinas o paneles descriptivos, dejando libre la circulación. Globant: recepción contemporánea con verde lima; BBVA: azul y materiales sobrios; J&J: blanco cálido con acentos rojos; Hipotecario: tonos crema, madera y naranja; Formación: biblioteca/espacio de estudio con dos capítulos reconocibles.
6. **Interfaz y movimiento.** Jerarquía tipográfica, etiquetas contextuales que no se superpongan, selección y llegada claras, ventanas con transiciones breves. Refinar recortes de techos y paredes para que tengan remates modelados. Añadir movimiento ambiental discreto después de resolver modelos, materiales y luz.

## Recursos y entrega web

Autoría en una herramienta 3D y exportación glTF/GLB para los módulos. Seleccionar compresión y tamaños de textura según recursos reales; `GLTFLoader` admite integración de Meshopt, Draco y KTX2. Esto es una propuesta para cuando haya assets, no una dependencia instalada ni un resultado medido. [GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html).

Mantener componentes repetidos instanciados, cargar recursos por necesidad y conservar una calidad ligera. El cambio de WebGL a WebGPU por sí solo no reemplaza mejores modelos, materiales o composición. Evitar estimar FPS o memoria sin medir el arte final en el dispositivo objetivo.

## Próxima entrega concreta sugerida

**Sala BBVA y su tramo de pasillo con acabado final en ambas cámaras.** Un pequeño kit de arquitectura, materiales terminados, iluminación de exposición, muebles y una ficha cuidada. Esa muestra define el estándar visual antes de extenderlo al museo completo.
