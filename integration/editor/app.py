from flask import Flask, request, jsonify, render_template
import yaml
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('editor.html')

@app.route('/api/generate-yaml', methods=['POST'])
def generate_yaml():
    data = request.json
    # Structure the SOaC Playbook (The Purpose)
    playbook = {
        "name": data.get("name", "New_Playbook"),
        "description": data.get("description", ""),
        "trigger": {
            "type": "alert",
            "source": data.get("source", "any")
        },
        "actions": [
            {
                "step": 1,
                "type": data.get("action_type", "notify"),
                "target": data.get("target", "admin"),
                "parameters": {
                    "severity": "high",
                    "channel": "slack"
                }
            }
        ],
        "metadata": {
            "version": "1.0",
            "author": "SOaC_Editor"
        }
    }
    yaml_content = yaml.dump(playbook, sort_keys=False)
    return jsonify({"yaml": yaml_content})

if __name__ == '__main__':
    # Local demo only. The Werkzeug debugger allows arbitrary code execution,
    # so it is off unless explicitly enabled, and the server binds to loopback.
    app.run(
        host=os.environ.get("SOAC_EDITOR_HOST", "127.0.0.1"),
        port=int(os.environ.get("SOAC_EDITOR_PORT", "5001")),
        debug=os.environ.get("FLASK_DEBUG", "0") == "1",
    )
