import assert from 'node:assert/strict';
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

test('recognizes every training pose', () => {
  const predictions = model.samples.map((sample) => predictKnn(sample, model));
  assert.deepEqual(predictions, model.labels);
});

test('keeps predictions stable as the subject moves closer or farther away', () => {
  for (let index = 0; index < model.samples.length; index += 1) {
    const scaledPose = model.samples[index].map((coordinate) => coordinate * 0.6);
    assert.equal(predictKnn(scaledPose, model), model.labels[index]);
  }
});

test('stabilizes predictions over the responsive 20-frame window', () => {
  const stabilizer = new PoseStabilizer();
  for (let frame = 0; frame < 19; frame += 1) {
    assert.equal(stabilizer.add('one'), undefined);
  }
  assert.equal(stabilizer.add('one'), 'one');
});

test('requires the configured share of the window before accepting a pose', () => {
  const belowThreshold = new PoseStabilizer();
  const atThreshold = new PoseStabilizer();

  for (let frame = 0; frame < 20; frame += 1) {
    belowThreshold.add(frame < 12 ? 'one' : 'zero');
  }
  for (let frame = 0; frame < 19; frame += 1) {
    atThreshold.add(frame < 13 ? 'one' : 'zero');
  }

  assert.equal(belowThreshold.add('zero'), null);
  assert.equal(atThreshold.add('zero'), 'one');
});
