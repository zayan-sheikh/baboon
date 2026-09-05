export function normalizeLandmarks(landmarks) {
  if (landmarks.length === 0) return [];

  const anchor = landmarks[0];
  return landmarks.flatMap((landmark) => [
    landmark.x - anchor.x,
    landmark.y - anchor.y,
    landmark.z - anchor.z
  ]);
}

export function predictKnn(features, model) {
  if (features.length !== model.samples[0]?.length) {
    throw new Error(`Expected ${model.samples[0]?.length ?? 0} pose features, received ${features.length}`);
  }

  const queryScale = getShoulderScale(features);
  const nearest = model.samples
    .map((sample, index) => {
      const sampleScale = getShoulderScale(sample);
      let squaredDistance = 0;
      for (let feature = 0; feature < sample.length; feature += 1) {
        const landmark = Math.floor(feature / 3);
        const weight = landmark >= 11 && landmark <= 22
          ? 2
          : landmark >= 23
            ? 0.15
            : 0.35;
        const delta = features[feature] / queryScale - sample[feature] / sampleScale;
        squaredDistance += weight * delta * delta;
      }
      return { distance: squaredDistance, index, label: model.labels[index] };
    })
    .sort((a, b) => a.distance - b.distance || a.index - b.index)
    .slice(0, model.k);

  const votes = new Map(model.classes.map((label) => [label, 0]));
  for (const neighbor of nearest) {
    const voteWeight = 1 / (Math.sqrt(neighbor.distance) + 1e-6);
    votes.set(neighbor.label, votes.get(neighbor.label) + voteWeight);
  }

  let prediction = model.classes[0];
  for (const label of model.classes) {
    if (votes.get(label) > votes.get(prediction)) prediction = label;
  }
  return prediction;
}

function getShoulderScale(features) {
  const leftShoulder = 11 * 3;
  const rightShoulder = 12 * 3;
  const dx = features[leftShoulder] - features[rightShoulder];
  const dy = features[leftShoulder + 1] - features[rightShoulder + 1];
  const dz = features[leftShoulder + 2] - features[rightShoulder + 2];
  return Math.max(Math.hypot(dx, dy, dz), 1e-6);
}

export class PoseStabilizer {
  constructor(windowSize = 20, minimumAccuracy = 0.65) {
    this.windowSize = windowSize;
    this.minimumAccuracy = minimumAccuracy;
    this.cache = [];
  }

  add(pose) {
    this.cache.push(pose);
    if (this.cache.length < this.windowSize) return undefined;

    const counts = new Map();
    for (const cachedPose of this.cache) {
      counts.set(cachedPose, (counts.get(cachedPose) ?? 0) + 1);
    }

    let mode = this.cache[0];
    for (const [poseName, count] of counts) {
      if (count > counts.get(mode)) mode = poseName;
    }

    if (mode && counts.get(mode) / this.windowSize < this.minimumAccuracy) mode = null;

    this.cache.shift();
    return mode;
  }
}
