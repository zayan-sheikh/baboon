import cv2 as cv
import mediapipe as mp
import numpy as np
import pandas as pd
import joblib
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose


# Initialize model and video capture
knn = joblib.load('learning/knn_model.pkl')
cap = cv.VideoCapture(0)
pose_model = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Cached poses from past n frames
num_to_cache = 60
min_accuracy = 0.9
pose_cache = []

def most_common(lst):
    return max(set(lst), key=lst.count)

def get_pose():
    # Returns the most common pose in the cache (may be None)
    while len(pose_cache) < num_to_cache:
        pose_cache.append(_predict_pose())
    
    mode = most_common(pose_cache)
    if mode and pose_cache.count(mode) / len(mode) < min_accuracy:
        mode = None
    pose_cache.pop(0)
    return mode
    

def _predict_pose():
    # Read frame from camera
    _, frame = cap.read()

    # Convert image color for MediaPipe processing
    image = cv.cvtColor(frame, cv.COLOR_BGR2RGB)
    image.flags.writeable = False

    # Process the image
    results = pose_model.process(image)

    # If landmarks are found, normalize them and store in the variable
    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark
                    
        # Normalize the landmarks and store them in the global variable
        anchor_point = landmarks[mp_pose.PoseLandmark.NOSE]
        normalized_landmarks = normalize_landmarks(landmarks, anchor_point)

        # Draw landmarks on the image
        image.flags.writeable = True
        image = cv.cvtColor(image, cv.COLOR_RGB2BGR)
        mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
        
        # Run classifier on pose
        df = pd.DataFrame(normalized_landmarks, columns=['x', 'y', 'z'])
        dfs = [df]
        flat_df = np.array([dataframe[['x', 'y', 'z']].values.flatten() for dataframe in dfs])
        return knn.predict(flat_df)[0]
    else:
        return None


def normalize_landmarks(landmarks, anchor_point):
    normalized = []
    for lm in landmarks:
        # Normalize each landmark by subtracting anchor_point's coordinates
        normalized.append((lm.x - anchor_point.x, lm.y - anchor_point.y, lm.z - anchor_point.z))
    return normalized


if __name__ == '__main__':
    last_pose = None
    while True:
        pose = get_pose()
        if pose != last_pose:
            print(pose)
        last_pose = pose