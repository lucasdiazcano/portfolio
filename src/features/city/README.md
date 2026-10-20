# DISTRITO — career museum

Routes: `/es/city` and `/en/city`. A walkable porteño district leads into five real rooms: Globant (employer and entrance hall), BBVA, Johnson & Johnson, Banco Hipotecario and education. The education room has separate chapters for Psychology at Universidad de Palermo and the Plataforma 5 bootcamp.

The museum presents the owner's senior engineering contributions and education using descriptions. It contains no confidential product screenshots, client source code or reconstructed internal interfaces. BBVA has the largest client room and highlights the owner's longer track record and current seniority without assigning a leadership title. Conventional portfolio copy has been corrected to match that account.

## Play

- Default isometric view: click/tap the ground to move, wheel to zoom, click a room label or the room guide to visit and read. Paths use the existing walls and doors.
- Use the camera selector or V to switch to third person without resetting position. WASD / arrows move relative to the camera; Shift runs; drag orbits/elevates in third person. Manual movement cancels a click destination.
- Enter through Globant, then follow the central corridor. First left: BBVA; first right: Johnson & Johnson; second left: Banco Hipotecario; second right: education.
- Inside a room, press E or the interaction button to read its description and contribution chapters. Isometric stories open as closable windows while the camera stays isometric.
- Escape / menu: pause or resume. Return to plaza resets the spawn. Blur/hidden tabs pause movement.
- Touch controls: direction buttons, hold ⇧ to run, drag to look. The menu offers lower resolution without shadows.

## Data and structure

- `messages/{es,en}.json` → `museum.rooms`: the complete localized source for museum content. `projects.list` remains the separate conventional portfolio contract; it is never blended into museum data.
- `world.ts`: ordered room footprints, all museum walls, collisions, floor heights and world bounds. Rendered walls and controller obstacles share `MUSEUM_WALLS`.
- `MuseumRooms.tsx`: five rooms, company floors and wall panels, door headings and circulation spine.
- `CityGame.tsx`: canvas, HUD, room descriptions, map, keyboard/touch input and lifecycle.
- `CityScene.tsx`: district, interchangeable orthographic/perspective cameras, click navigation, destination marker and room labels.
- `navigation.ts`: bounded A*, walkable segments and exact waypoint following.
- `Avatar.tsx` / `gait.ts` / `locomotion.ts`: articulated local character, planted foot targets, inverse kinematics and movement.
- `FaceMask.tsx` / `assets.ts`: preserved photographic mask and optimized local texture. Regenerate with `npm run assets:city`; the original `public/profile.png` remains intact.
- `PortenoCorner.tsx`: porteño frontage, patterned pavement, benches and lanterns.
- `ScenePrimitives.tsx`: blocks and bundled-font 3D signs; accents are normalized for the limited 3D glyph set while DOM copy retains accents.
- `brands.ts` / `city.module.css`: palettes and isolated interface styles.

The city uses procedural geometry, local fonts and textures. No external model service is required. It is a playable prototype; there is no driving, networking, saving or WASM engine. Existing home, profile and project routes remain accessible. See `docs/city/MUSEUM.md`, `docs/city/ISOMETRIC.md`, `docs/city/VISUAL-DIRECTION.md` and CHANGELOG for the current scope.

## Verification

Use the Node version supported by Next 16 (20.9 or newer):

```sh
npm run typecheck
npm run lint:city
npm run test:city
npm run build -- --webpack
```

Tests compile into `.next/city-tests` inside PORTFOLIO. They cover room identity/order in both locales, doors, walls, movement and interaction. They do not establish physical mobile performance.

## Opt-in diagnostics

WebGL remains the default. `?benchmark=1&renderer=webgl&quality=high` enables local diagnostics; requesting `renderer=webgpu` loads the experimental alternative and reports the actual backend. Diagnostics never send results externally.

The museum tour now visits Globant's entrance hall and carries route ID `museum-globant-v1`. Its geometry and route differ from the earlier sculpture baseline, so historical JSON results are not a direct comparison. No new museum benchmark was run. Frame intervals are not GPU execution times, and resource object counts are not VRAM. Existing raw results remain historical evidence in `docs/city/benchmarks`.
