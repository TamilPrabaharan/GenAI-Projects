import cv2
import pygame
from ultralytics import YOLO

# Path to the trained YOLOv8 model
trained_model_path = r'D:\AI and Data Science\Deep Learning\FireDetectionAndAlert\runs\detect\train\weights\best.pt'

# Load the trained YOLOv8 model
trained_model = YOLO(trained_model_path)

# Path to the voice alert file
voice_alert_path = r'D:\AI and Data Science\Deep Learning\FireDetectionAndAlert\FireAlertWarning.mp3'

# Initialize pygame mixer
pygame.mixer.init()
pygame.mixer.music.load(voice_alert_path)

# Webcam fire detection function with voice alert
def detect_fire_with_voice_alert():
    cap = cv2.VideoCapture(0)  # Open webcam
    if not cap.isOpened():
        print("Error: Unable to access the webcam.")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Unable to read from the webcam.")
            break

        # Perform inference on the frame
        results = trained_model.predict(source=frame, conf=0.25, imgsz=640)

        # Check if 'Fire' is detected
        fire_detected = False
        for result in results[0].boxes.data:
            x1, y1, x2, y2, conf, cls = result.cpu().numpy()
            if int(cls) == 0:  # Assuming class 0 is 'Fire'
                fire_detected = True
                # Draw bounding box and label
                cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 0, 255), 2)  # Red box
                cv2.putText(frame, f"Fire {conf:.2f}", (int(x1), int(y1) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

        # Play voice alert if fire is detected
        if fire_detected and not pygame.mixer.music.get_busy():
            pygame.mixer.music.play()

        # Display the frame
        cv2.imshow("Fire Detection", frame)

        # Exit on pressing 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    pygame.mixer.quit()  # Quit pygame mixer when exiting

# Run fire detection with voice alert
detect_fire_with_voice_alert()
