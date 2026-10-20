import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { COMPANY_BRANDS } from './brands';
import { MUSEUM_ROOMS, type MuseumRoom } from './world';

/** Reads the localized museum source consumed by the scene and its room descriptions. */
function readRooms(locale: string): MuseumRoom[] {
  return JSON.parse(readFileSync(resolve('messages', `${locale}.json`), 'utf8')).museum.rooms;
}

for (const locale of ['en', 'es']) {
  test(`${locale}: every room has a configured company identity`, () => {
    assert.equal(readRooms(locale).every((project) => Object.hasOwn(COMPANY_BRANDS, project.brandId)), true);
  });

  test(`${locale}: room identities are unique React keys in the museum`, () => {
    const ids = readRooms(locale).map((project) => project.brandId);
    assert.equal(new Set(ids).size, ids.length);
  });
}

test('both languages expose the same room identities in the same museum slots', () => {
  assert.deepEqual(readRooms('en').map((project) => project.brandId), readRooms('es').map((project) => project.brandId));
});

for (const locale of ['es', 'en']) {
  test(`${locale}: room content matches the physical layout without mixing client and employer`, () => {
    assert.deepEqual(readRooms(locale).map((room) => room.brandId), MUSEUM_ROOMS.map((room) => room.brandId));
  });
}
