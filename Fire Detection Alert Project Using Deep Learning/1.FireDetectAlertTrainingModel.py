from ultralytics import YOLO

# Paths to your dataset and YAML file
dataset_path = r'D:\AI and Data Science\Deep Learning\FireDetectionAndAlert\Dataset'  # Update with your dataset path
yaml_content = f"""
path: {dataset_path}
train: train/images
val: valid/images
test: test/images

nc: 1  # Number of classes (e.g., 'Fire' is 1 class)
names: ['Fire']  # Class names
"""

# Create the YAML file
yaml_path = './fire_detection.yaml'
with open(yaml_path, 'w') as yaml_file:
    yaml_file.write(yaml_content)

# Initialize the YOLOv8 model (use 'yolov8n.pt' for faster training or 'yolov8s.pt' for better accuracy)
model = YOLO('yolov8n.pt')

# Train the model
model.train(data=yaml_path, epochs=50, imgsz=640, batch=8)

# Save the trained model
trained_model_path = r'D:\AI and Data Science\Deep Learning\FireDetectionAndAlert\runs\detect\train\weights\best.pt'
print(f"Model trained and saved to: {trained_model_path}")