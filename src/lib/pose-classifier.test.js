import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { normalizeLandmarks, PoseStabilizer, predictKnn } from './pose-classifier.js';

const model = JSON.parse(
  await readFile(new URL('../../static/knn-model.json', import.meta.url), 'utf8')
);

test('normalizes all pose coordinates relative to the nose', () => {
  assert.deepEqual(
    normalizeLandmarks([
      { x: 0.2, y: 0.4, z: -0.1 },
      { x: 0.5, y: 0.1, z: 0.3 }
    ]),
    [0, 0, 0, 0.3, -0.30000000000000004, 0.4]
  );
});

test('reproduces the scikit-learn KNN predictions', () => {
  const predictions = model.samples.map((sample) => predictKnn(sample, model));
  const digest = createHash('sha256').update(predictions.join('\n')).digest('hex');

  assert.equal(digest, 'eb0d78834417b01a44f37f3e5e354c086a85eb81920d42894413088f57d4a313');
});

test('stabilizes predictions over the original 60-frame window', () => {
  const stabilizer = new PoseStabilizer();
  for (let frame = 0; frame < 59; frame += 1) {
    assert.equal(stabilizer.add('one'), undefined);
  }
  assert.equal(stabilizer.add('one'), 'one');
});

test('requires the configured share of the window before accepting a pose', () => {
  const belowThreshold = new PoseStabilizer();
  const atThreshold = new PoseStabilizer();

  for (let frame = 0; frame < 60; frame += 1) {
    belowThreshold.add(frame < 47 ? 'one' : 'zero');
  }
  for (let frame = 0; frame < 59; frame += 1) {
    atThreshold.add(frame < 48 ? 'one' : 'zero');
  }

  assert.equal(belowThreshold.add('zero'), null);
  assert.equal(atThreshold.add('zero'), 'one');
});
