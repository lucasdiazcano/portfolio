'use client';

import { COMPANY_BRANDS } from './brands';
import { Block, Sign } from './ScenePrimitives';
import { MUSEUM_ROOMS, MUSEUM_WALLS, type MuseumRoom } from './world';

/** Builds five walkable career rooms from the same wall contract used by the controller. */
export default function MuseumRooms({ rooms, spanish, cutaway }: { rooms: MuseumRoom[]; spanish: boolean; cutaway: boolean }) {
  return <group>
    {MUSEUM_WALLS.map((wall, index) => <Block key={index} at={[wall.x, cutaway ? 0.55 : 2.5, wall.z]} size={[wall.width, cutaway ? 1.1 : 5, wall.depth]} color="#c8c2b4" />)}
    {/* Continuous open spine connects every room; the entrance hall belongs to Globant. */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.093, -31.4]} receiveShadow>
      <planeGeometry args={[3.25, 30.5]} /><meshStandardMaterial color="#d2c6ae" roughness={0.95} />
    </mesh>
    {[-0.95, 0.95].map((x) => <Block key={x} at={[x, 0.11, -31.4]} size={[0.035, 0.015, 30.5]} color="#a38e60" />)}
    <group visible={!cutaway}>
    <Sign text={spanish ? 'MUSEO DE MI TRAYECTORIA' : 'MUSEUM OF MY JOURNEY'} at={[0, 4.65, -15.8]} size={0.16} color="#253d3a" />
    <Block at={[0, 3.95, -15.8]} size={[3.25, 0.8, 0.15]} color={COMPANY_BRANDS.globant.surface} />
    <Sign text="Globant" at={[0, 3.95, -15.68]} size={0.43} color={COMPANY_BRANDS.globant.accent} />
    <Sign text={spanish ? 'RECORRIDO / NORTE' : 'JOURNEY / NORTH'} at={[0, 2.3, -46.7]} size={0.15} color="#32423e" />
    <Sign text={spanish ? 'FORMACION >' : 'EDUCATION >'} at={[0, 1.9, -46.7]} size={0.13} color="#513c60" />
    </group>
    {rooms.map((room, index) => {
      const layout = MUSEUM_ROOMS[index];
      const brand = COMPANY_BRANDS[room.brandId];
      const lobby = room.brandId === 'globant';
      const boardZ = layout.z - layout.depth / 2 + 0.23;
      return <group key={room.brandId}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[layout.x, 0.092, layout.z]} receiveShadow>
          <planeGeometry args={[layout.width - 0.4, layout.depth - 0.4]} /><meshStandardMaterial color={brand.surface} roughness={0.9} />
        </mesh>
        <Block at={[layout.x, 0.114, layout.z + layout.depth / 2 - 0.4]} size={[layout.width - 0.5, 0.02, 0.1]} color={brand.accent} />
        <group visible={!cutaway}>
        {!lobby && <>
          <mesh position={[Math.sign(layout.x) * 9.23, 1.5, layout.z]} rotation={[0, -Math.sign(layout.x) * Math.PI / 2, 0]}>
            <planeGeometry args={[layout.depth - 0.4, 2.8]} /><meshStandardMaterial color={brand.surface} roughness={0.9} />
          </mesh>
          <Block at={[Math.sign(layout.x) * 9.2, 2.9, layout.z]} size={[0.035, 0.06, layout.depth - 0.4]} color={brand.accent} />
        </>}
        {lobby ? <>
          {[-5.5, 5.5].map((x, side) => <group key={x} position={[x, 0, -15.7]}>
            <Block at={[0, 2.5, 0]} size={[5.9, 3.9, 0.08]} color={brand.surface} />
            <Sign text={side === 0 ? (spanish ? 'MI EMPLEADOR' : 'MY EMPLOYER') : 'SENIOR SOFTWARE ENGINEER'} at={[0, 3.8, 0.08]} size={0.2} color={brand.accent} />
            <Sign text={side === 0 ? 'Globant' : (spanish ? 'FEATURES. EQUIPO. ENTREGAS.' : 'FEATURES. TEAM. DELIVERY.')} at={[0, 2.7, 0.08]} size={side === 0 ? 0.6 : 0.21} color={brand.ink} />
            <Sign text={side === 0 ? 'BBVA / J&J / HIPOTECARIO' : (spanish ? 'MI APORTE COMO SENIOR' : 'MY CONTRIBUTION AS A SENIOR')} at={[0, 1.6, 0.08]} size={0.18} color={brand.ink} />
          </group>)}
        </> : <>
          <Block at={[layout.x, 2.5, boardZ]} size={[6.4, 4.2, 0.1]} color={brand.surface} />
          <Sign text={`0${index + 1}`} at={[layout.x, 4.15, boardZ + 0.08]} size={0.25} color={brand.accent} />
          <Sign text={room.label} at={[layout.x, 3.3, boardZ + 0.08]} size={room.label.length > 16 ? 0.28 : 0.62} color={brand.ink} />
          <Sign text={room.brandId === 'education' ? (spanish ? 'PSICOLOGIA / DESARROLLO WEB' : 'PSYCHOLOGY / WEB DEVELOPMENT') : 'SENIOR FRONTEND ENGINEER'} at={[layout.x, 2.55, boardZ + 0.08]} size={0.16} color={brand.ink} />
          {room.brandId === 'bbva' && <Sign text={spanish ? 'MAYOR RECORRIDO / EXPERIENCIA ACTUAL' : 'LONGEST EXPERIENCE / CURRENT WORK'} at={[layout.x, 2.05, boardZ + 0.08]} size={0.13} color={brand.ink} />}
          {room.sections.map((section, sectionIndex) => {
            const x = layout.x + (sectionIndex - (room.sections.length - 1) / 2) * 2.05;
            return <group key={section.title}>
              <Block at={[x, 1.25, boardZ + 0.08]} size={[1.9, 0.08, 0.08]} color={brand.accent} />
              <Sign text={section.title} at={[x, 1.55, boardZ + 0.15]} size={section.title.length > 20 ? 0.085 : 0.11} color={brand.ink} />
            </group>;
          })}
          {/* Door headings face the corridor; passage below remains completely open. */}
          <Block at={[Math.sign(layout.x) * 1.8, 3.65, layout.doorZ]} size={[0.35, 0.45, 3.2]} color={brand.surface} />
          <group position={[Math.sign(layout.x) * 1.59, 3.65, layout.doorZ]} rotation={[0, -Math.sign(layout.x) * Math.PI / 2, 0]}>
            <Sign text={`${String(index + 1).padStart(2, '0')} / ${room.label}`} at={[0, 0, 0]} size={room.label.length > 16 ? 0.12 : 0.19} color={brand.ink} />
          </group>
        </>}
        <Sign text={spanish ? 'MI TRAYECTORIA' : 'MY JOURNEY'} at={[lobby ? -5.5 : layout.x, 0.6, lobby ? -15.55 : boardZ + 0.1]} size={0.15} color={brand.ink} />
        </group>
      </group>;
    })}
  </group>;
}
