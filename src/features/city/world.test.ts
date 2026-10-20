import assert from 'node:assert/strict';
import test from 'node:test';
import { canWalk, groundHeight, nearbyExhibit, SPAWN, MUSEUM_ROOMS } from './world';

test('the spawn is walkable', () => {
  assert.equal(canWalk(SPAWN.x, SPAWN.z), true);
});

test('the central gallery entrance is open', () => {
  assert.equal(canWalk(0, -8), true);
});

test('the gallery interior is walkable', () => {
  assert.equal(canWalk(-6, -17), true);
});

test('the gallery front wall blocks entry outside the doorway', () => {
  assert.equal(canWalk(5, -8), false);
});

test('the avatar cannot cross the museum back wall', () => {
  assert.equal(canWalk(0, -46.5), false);
});

test('the former sculpture positions now leave the museum corridor open', () => {
  assert.equal(canWalk(0, -18.65), true);
});

test('the entrance hall describes Globant as the employer', () => {
  assert.equal(nearbyExhibit(0, -13, 5), 0);
});

test('the avatar footprint cannot clip through a building corner', () => {
  assert.equal(canWalk(-11.8, 3.8), false);
});

test('the world boundary cannot be crossed', () => {
  assert.equal(canWalk(26, 0), false);
});

test('the new sidewalk benches block the character', () => {
  assert.equal(canWalk(7.3, -5.8), false);
});

test('the street lantern bases block the character', () => {
  assert.equal(canWalk(-8.3, -3), false);
});

test('the central measured route remains walkable across the new corner', () => {
  assert.equal(Array.from({ length: 64 }, (_, index) => canWalk(0, 15 - index * 0.5)).every(Boolean), true);
});

test('the plaza does not expose a gallery interaction', () => {
  assert.equal(nearbyExhibit(0, 15, 3), -1);
});

test('the BBVA room selects its own career description', () => {
  assert.equal(nearbyExhibit(-6, -23, 5), 1);
});

test('an absent room description never exposes an interaction', () => {
  assert.equal(nearbyExhibit(6, -37, 4), -1);
});

test('the street places the avatar soles on the asphalt', () => {
  assert.equal(groundHeight(0, 15), -0.02);
});

test('the frontage places the avatar soles on the patterned pavement', () => {
  assert.equal(groundHeight(0, -5.8), 0.035);
});

test('the gallery places the avatar soles on its raised floor', () => {
  assert.equal(groundHeight(0, -12), 0.09);
});

test('the side sidewalk takes precedence where its surface overlaps the frontage', () => {
  assert.equal(groundHeight(9.2, -5), 0.13);
});

for (const room of MUSEUM_ROOMS.slice(1)) {
  test(`${room.brandId}: the side doorway is physically walkable`, () => {
    assert.equal(canWalk(Math.sign(room.x) * 1.8, room.doorZ), true);
  });

  test(`${room.brandId}: the room can be entered from the central corridor`, () => {
    assert.equal(Array.from({ length: 24 }, (_, index) => canWalk(Math.sign(room.x) * index * 0.25, room.doorZ)).every(Boolean), true);
  });

  test(`${room.brandId}: its interior selects the matching room`, () => {
    assert.equal(nearbyExhibit(room.x, room.z, 5), MUSEUM_ROOMS.indexOf(room));
  });
}

test('the circulation corridor does not claim a client experience', () => {
  assert.equal(nearbyExhibit(0, -25, 5), -1);
});

test('the partition between BBVA and Hipotecario blocks movement', () => {
  assert.equal(canWalk(-6, -34), false);
});

test('the partition between Johnson and Johnson and education blocks movement', () => {
  assert.equal(canWalk(6, -28), false);
});
