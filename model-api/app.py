import os
import numpy as np
import cv2
import tensorflow as tf
from flask import Flask, jsonify, request
from werkzeug.utils import secure_filename
from tensorflow.keras.models import load_model

app = Flask(__name__)
app.config["ALLOWED_EXTENSIONS"] = set(['png', 'jpg', 'jpeg'])
app.config["UPLOAD_FOLDER"] = "static/upload/"

def allowed_files(filename):
    return "." in filename and filename.split(".", 1)[1] in app.config["ALLOWED_EXTENSIONS"]

model = load_model("model_pertama.h5", compile=False)

@app.route("/")
def index():
    return jsonify({
        "status" : {
            "code" : 201,
            "message": "Sukses API"
        },
        "data" : None
    }), 200

@app.route("/prediction", methods=["GET", "POST"])
def predict():
    if request.method == "POST":
        image = request.files["image"]

        if image and allowed_files(image.filename):
            filename = secure_filename(image.filename)
            image.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
            image_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)

            img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
            img = np.array(img)
            img= img / 255.0
            resized_img = cv2.resize(img, (720, 960))
            images = np.expand_dims(resized_img, axis=-1)
            tes_prediksi = np.expand_dims(images, axis=0)

            prediction = model.predict(tes_prediksi)
            prediction_list = prediction.tolist()
            prediction_list = [[round(num, 2) for num in sublist] for sublist in prediction_list]

            return jsonify({
                "status": {
                    "code" : 200,
                    "message" : "Success"
                },
                "data" : {
                    "prediction": prediction_list
                }
            })
        else:
            return jsonify({
                "status" : {
                    "code" : 400,
                    "message" : "Bad Request"
                },
                "data" : None
            }), 400
    else:
        return jsonify({
            "status" : {
                "code" : 405,
                "message" : "Method not allowed"
            },
            "data" : None
        }), 405

if __name__ == "__main__":
    app.run()