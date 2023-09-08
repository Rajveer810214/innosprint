import cv2
import dlib
import numpy as np
import face_recognition

# Load the face detection model from dlib
detector = dlib.get_frontal_face_detector()
# Load a reference face (you should replace this with your own database of known faces)
# Load the image file of the face you want to encode
face_image = face_recognition.load_image_file("arsh.jpeg")
# Compute the face encoding for the loaded image
known_face_encodings = face_recognition.face_encodings(face_image)[0]
known_face_names = ["Arsh"]
# Load the pre-trained face detection model for OpenCV
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
# Initialize the camera
cap = cv2.VideoCapture(0)

count = 0

while True:
    # Read a frame from the camera
    ret, frame = cap.read()

    # Convert the frame to grayscale for face detection
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Perform face detection using OpenCV
    faces_opencv = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5, minSize=(30, 30))

    # Detect faces in the grayscale frame using dlib
    faces_dlib = detector(gray)

    # Convert detected face rectangles from dlib to the expected format
    face_locations_dlib = [(face.top(), face.right(), face.bottom(), face.left()) for face in faces_dlib]

    # Iterate over detected faces from dlib
    for face_location in face_locations_dlib:
        # Get face encodings for the detected face
        face_encoding = face_recognition.face_encodings(frame, [face_location])[0]

        # Compare the detected face with known faces in the database
        matches = face_recognition.compare_faces([known_face_encodings], face_encoding, tolerance=0.6)

        # If a match is found, display the name of the known person
        if any(matches):
            match_index = matches.index(True)
            name = known_face_names[match_index]
            print(f"Detected {name}")
            break
        else:
            print("No Match")
            count = count + 1

        if count == 10:
            print("Another Face detected, Exam cancelled")
            cap.release()
            cv2.destroyAllWindows()

        # Draw a rectangle around the detected face
        (top, right, bottom, left) = face_location
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)

    # Display the frame with detected faces
    cv2.imshow("Face Detection", frame)

    # Check if multiple faces are detected using OpenCV
    if len(faces_opencv) > 1:
        print("Multiple faces detected, Exam")
        cap.release()
        cv2.destroyAllWindows()

    # Break the loop if 'a' key is pressed
    if cv2.waitKey(10) == ord("a"):
        break

# Release the camera and close all OpenCV windows
cap.release()
cv2.destroyAllWindows()