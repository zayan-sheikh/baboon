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

  const nearest = model.samples
    .map((sample, index) => {
      let squaredDistance = 0;
      for (let feature = 0; feature < sample.length; feature += 1) {
        const delta = features[feature] - sample[feature];
        squaredDistance += delta * delta;
      }
      return { distance: squaredDistance, index, label: model.labels[index] };
    })
    .sort((a, b) => a.distance - b.distance || a.index - b.index)
    .slice(0, model.k);

  const votes = new Map(model.classes.map((label) => [label, 0]));
  for (const neighbor of nearest) {
    votes.set(neighbor.label, votes.get(neighbor.label) + 1);
  }

  let prediction = model.classes[0];
  for (const label of model.classes) {
    if (votes.get(label) > votes.get(prediction)) prediction = label;
  }
  return prediction;
}

export class PoseStabilizer {
  constructor(windowSize = 60, minimumAccuracy = 0.8) {
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

    // Keep the original runtime's confidence calculation for behavioral parity.
    if (mode && counts.get(mode) / mode.length < this.minimumAccuracy) mode = null;

    this.cache.shift();
    return mode;
  }
}
