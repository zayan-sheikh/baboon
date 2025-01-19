import cv2
import mediapipe as mp
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
import pickle

# MediaPipe setup
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils

# Define the KNN Classifier
class PoseEstimator:
    def __init__(self, k=3):
        self.knn = KNeighborsClassifier(n_neighbors=k)
        self.trained = False

    def train(self, X, y):
        self.knn.fit(X, y)
        self.trained = True

    def predict(self, landmarks):
        if not self.trained:
            raise ValueError("Model is not trained yet.")
        return self.knn.predict([landmarks])[0]

    def save_model(self, filename="pose_model.pkl"):
        with open(filename, "wb") as f:
            pickle.dump(self.knn, f)

    def load_model(self, filename="pose_model.pkl"):
        with open(filename, "rb") as f:
            self.knn = pickle.load(f)
            self.trained = True

# Function to extract pose landmarks
def extract_landmarks(results):
    if not results.pose_landmarks:
        return None
    landmarks = []
    for landmark in results.pose_landmarks.landmark:
        landmarks.extend([landmark.x, landmark.y, landmark.z])  # Flatten x, y, z
    return np.array(landmarks)

# Collect training data
def collect_training_data(estimator, labels, save_path="pose_data.npy"):
    cap = cv2.VideoCapture(0)
    X, y = [], []

    print("Press 'q' to stop collecting data for the current pose.")
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Flip the frame for a mirrored effect
        frame = cv2.flip(frame, 1)
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image)

        # Draw landmarks
        mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        landmarks = extract_landmarks(results)
        if landmarks is not None:
            X.append(landmarks)
            y.append(labels)

        cv2.putText(frame, f"Collecting for label: {labels}", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
        cv2.imshow("Training Mode", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

    # Save data
    np.save(save_path, (np.array(X), np.array(y)))
    print(f"Training data saved to {save_path}.")

# Real-time pose prediction
def predict_pose(estimator):
    cap = cv2.VideoCapture(0)

    print("Press 'q' to exit.")
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image)

        mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        landmarks = extract_landmarks(results)
        if landmarks is not None and estimator.trained:
            pose_label = estimator.predict(landmarks)
            cv2.putText(frame, f"Pose: {pose_label}", (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2, cv2.LINE_AA)

        cv2.imshow("Pose Estimation", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    estimator = PoseEstimator(k=5)

    print("1: Collect Training Data")
    print("2: Train Model")
    print("3: Load Model and Predict Pose")
    choice = int(input("Enter your choice: "))

    if choice == 1:
        label = input("Enter the label for the pose: ")
        collect_training_data(estimator, label)
    elif choice == 2:
        data_path = input("Enter the path to training data: ")
        X, y = np.load(data_path, allow_pickle=True)
        estimator.train(X, y)
        estimator.save_model()
        print("Model trained and saved.")
    elif choice == 3:
        estimator.load_model()
        predict_pose(estimator)
