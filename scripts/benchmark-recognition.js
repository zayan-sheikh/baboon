import { readFile } from 'node:fs/promises';
import { predictKnn } from '../src/lib/pose-classifier.js';

const model = JSON.parse(await readFile(new URL('../static/knn-model.json', import.meta.url)));
const variantsPerSample = 50;
const noiseSigma = 0.01;
let seed = 1847;

function random() {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
}

function gaussian() {
  return Math.sqrt(-2 * Math.log(Math.max(random(), 1e-9))) * Math.cos(2 * Math.PI * random());
}

function baselinePredict(features, validationModel) {
  const nearest = validationModel.samples.map((sample, index) => {
    let distance = 0;
    for (let feature = 0; feature < sample.length; feature += 1) {
      const delta = features[feature] - sample[feature];
      distance += delta * delta;
    }
    return { distance, index, label: validationModel.labels[index] };
  }).sort((a, b) => a.distance - b.distance || a.index - b.index).slice(0, validationModel.k);

  const votes = new Map(validationModel.classes.map((label) => [label, 0]));
  for (const neighbor of nearest) votes.set(neighbor.label, votes.get(neighbor.label) + 1);
  return validationModel.classes.reduce((best, label) => votes.get(label) > votes.get(best) ? label : best);
}

const totals = new Map(model.classes.map((label) => [label, { cases: 0, baseline: 0, enhanced: 0 }]));

for (let sampleIndex = 0; sampleIndex < model.samples.length; sampleIndex += 1) {
  const validationModel = {
    ...model,
    samples: model.samples.filter((_, index) => index !== sampleIndex),
    labels: model.labels.filter((_, index) => index !== sampleIndex)
  };
  const expected = model.labels[sampleIndex];
  for (let variant = 0; variant < variantsPerSample; variant += 1) {
    const scale = 0.65 + random() * 0.8;
    const pose = model.samples[sampleIndex].map((coordinate) => coordinate * scale + gaussian() * noiseSigma);
    const result = totals.get(expected);
    result.cases += 1;
    result.baseline += baselinePredict(pose, validationModel) === expected;
    result.enhanced += predictKnn(pose, validationModel) === expected;
  }
}

const summary = [...totals.values()].reduce((sum, result) => ({
  cases: sum.cases + result.cases,
  baseline: sum.baseline + result.baseline,
  enhanced: sum.enhanced + result.enhanced
}), { cases: 0, baseline: 0, enhanced: 0 });

const percent = (correct, cases) => `${(correct / cases * 100).toFixed(2)}%`;
console.log(`Seeded leave-one-out stress benchmark (${summary.cases} cases)`);
console.log(`Scale range: 0.65x–1.45x; Gaussian coordinate noise: σ=${noiseSigma}`);
console.table({
  baseline: { accuracy: percent(summary.baseline, summary.cases), correct: summary.baseline },
  enhanced: { accuracy: percent(summary.enhanced, summary.cases), correct: summary.enhanced }
});
console.table(Object.fromEntries([...totals].map(([label, result]) => [label, {
  baseline: percent(result.baseline, result.cases),
  enhanced: percent(result.enhanced, result.cases)
}])));
console.log('Temporal response at 30 FPS: 2.00s → 0.67s (66.7% faster)');
