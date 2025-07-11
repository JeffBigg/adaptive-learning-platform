from flask import Flask, request, jsonify
import numpy as np
from sklearn.cluster import KMeans
import tensorflow as tf

app = Flask(__name__)

# Parámetros de clustering
K = 3  # fácil, intermedio, avanzado
SEED = 42

# Cargar modelo (dummy embedding en este prototipo)
def embed_vector(x):
    # x: lista de 0/1 length N
    arr = np.array(x, dtype=np.float64) 
    # Embedding simple: expandir a dimensión k
    return np.tile(arr.mean(), (K,))

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    # Esperamos {'responses': [0,1,1,0,...]}
    responses = data.get('responses', [])
    if not responses:
        return jsonify({'error': 'Sin vector de respuestas'}), 400

    # Vectorizar
    vec = embed_vector(responses)
    vec = vec.reshape(-1, 1)  # para clustering

    # Clustering
    kmeans = KMeans(n_clusters=K, random_state=SEED, n_init=10)  # <-- n_init explícito
    kmeans.fit(vec)
    # Determinar cluster de nuestro vector medio
    cluster = kmeans.predict([[vec.mean()]])[0]

    # Etiquetado según cluster
    labels = {0: 'fácil', 1: 'intermedio', 2: 'avanzado'}
    level = labels.get(cluster, 'intermedio')

    return jsonify({'level': level})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)