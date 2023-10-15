from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import logging

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/uflproxy/<path:subpath>', methods=['GET', 'POST'])
def proxy(subpath):
    url = 'https://ufl.instructure.com/' + subpath

    app.logger.info(f'Request URL: {url}')

    headers = {key: value for (key, value) in request.headers if key != 'Host'}
    
    if request.method == 'GET':
        response = requests.get(url, params=request.args, headers=headers)
    elif request.method == 'POST':
        response = requests.post(url, json=request.get_json(), headers=headers)
        
    # erroring here:

    app.logger.info(f'Request URL: {response}')

    return jsonify(response.json()), response.status_code

if __name__ == '__main__':
    logging.basicConfig(stream=sys.stdout, level=logging.INFO)
    app.run(port=5000)
