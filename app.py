from flask import Flask, request, render_template
app = Flask(__name__)

@app.route('/dataManagement')
def dataManagement():
    return render_template("dataManagement.html")

@app.route('/modelManagement')
def modelManagement():
    return render_template("modelManagement.html")

if __name__ == '__main__':
    app.run(debug=True)