import { normalizeLandmarks, PoseStabilizer, predictKnn } from './pose-classifier.js';

const WASM_PATH = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm';

export class PoseEstimator {
  constructor() {
    this.landmarker = null;
    this.model = null;
    this.stabilizer = new PoseStabilizer();
  }

  async initialize() {
    if (this.landmarker && this.model) return;

    const [{ FilesetResolver, PoseLandmarker }, modelResponse] = await Promise.all([
      import('@mediapipe/tasks-vision'),
      fetch('/knn-model.json')
    ]);

    if (!modelResponse.ok) {
      throw new Error(`Could not load the pose classifier (${modelResponse.status})`);
    }

    const vision = await FilesetResolver.forVisionTasks(WASM_PATH);
    this.model = await modelResponse.json();
    this.landmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: '/pose_landmarker.task',
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
  }

  predict(video, timestamp) {
    if (!this.landmarker || !this.model) return undefined;

    const result = this.landmarker.detectForVideo(video, timestamp);
    const landmarks = result.landmarks[0];
    const prediction = landmarks
      ? predictKnn(normalizeLandmarks(landmarks), this.model)
      : null;
    return this.stabilizer.add(prediction);
  }

  close() {
    this.landmarker?.close();
    this.landmarker = null;
  }
}
