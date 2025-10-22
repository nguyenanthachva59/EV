from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    """Chỉ phục vụ tệp index.html từ thư mục templates"""
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)