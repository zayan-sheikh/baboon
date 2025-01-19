from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS

import lang
import pose_estimation  # starts camera feed and model

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins='*')

    
def send_state():
    last_pose = None
    while True:
        # predict pose
        pose = pose_estimation.get_pose()
        if pose is not None and pose != 'neut' and pose != last_pose:
            # new pose detected, try adding to model
            try:
                lang.doPose(pose)
            except lang.LangException as err:
                print(f"Error: {err}")
                socketio.emit('error', str(err))
            state = lang.getState()
            socketio.emit('state', state)
            print(f"Sent: {state}")
        last_pose = pose


if __name__ == "__main__":
    socketio.start_background_task(send_state)
    socketio.run(app, host='localhost', port=6969)