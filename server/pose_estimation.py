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
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

def get_pose():
    prediction = None
    _, frame = cap.read()

    # Convert image color for MediaPipe processing
    image = cv.cvtColor(frame, cv.COLOR_BGR2RGB)
    image.flags.writeable = False

    # Process the image
    results = pose.process(image)

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
        prediction = knn.predict(flat_df)
    
    return prediction


def normalize_landmarks(landmarks, anchor_point):
    normalized = []
    for lm in landmarks:
        # Normalize each landmark by subtracting anchor_point's coordinates
        normalized.append((lm.x - anchor_point.x, lm.y - anchor_point.y, lm.z - anchor_point.z))
    return normalized


if __name__ == '__main__':
    while True:
        print(get_pose())