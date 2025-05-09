from flask import Flask, render_template, request, jsonify
import numpy as np
import base64
import re
import tensorflow as tf
from io import BytesIO
from PIL import Image

app = Flask(__name__)
model = tf.keras.models.load_model("models/mnist_model.keras")

def preprocess_image(data_url):
    img_str = re.search(r"base64,(.*)", data_url).group(1)
    image_data = BytesIO(base64.b64decode(img_str))
    img = Image.open(image_data).convert("L").resize((28, 28))
    img = np.array(img)
    img = (255 - img) / 255.0

    return img.reshape(1, 28, 28)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    img = preprocess_image(data["image"])
    prediction = model.predict(img)[0]
    prediction = [float(i) for i in prediction] 
    
    return jsonify({"prediction": prediction})


if __name__ == "__main__":
    app.run(debug=True)
