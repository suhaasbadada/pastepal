import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# In-memory data structure
data = {
    "Skills": ["Python", "Flask", "SQL"],
    "Education": ["M.S. Computer Science", "B.Tech CSE"],
}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/groups", methods=["GET"])
def get_groups():
    return jsonify(data)

@app.route("/groups", methods=["POST"])
def add_group():
    name = request.json.get("name")
    if name and name not in data:
        data[name] = []
    return jsonify(data)

@app.route("/groups/<group>", methods=["DELETE"])
def delete_group(group):
    if group in data:
        del data[group]
    return jsonify(data)

@app.route("/groups/<group>/snippets", methods=["POST"])
def add_snippet(group):
    text = request.json.get("text")
    if group in data and text:
        data[group].append(text)
    return jsonify(data)

@app.route("/groups/<group>/snippets/<int:index>", methods=["DELETE"])
def delete_snippet(group, index):
    if group in data and 0 <= index < len(data[group]):
        del data[group][index]
    return jsonify(data)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)