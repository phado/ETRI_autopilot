from flask import Flask, request, render_template
from db_conn import get_pool_conn
app = Flask(__name__)

# mariadb_pool = get_pool_conn()

@app.route('/login')
def login():
    return render_template("login/login.html")

@app.route('/findPwd')
def findId():
    return render_template("findPwd.html")
# @app.route('/register')
# def register():
#     return render_template("login.html")

# @app.route('/findId')
# def findId():
#     return render_template("")





@app.route('/dataManagement')
def dataManagement():
    return render_template("dataManagement/dataManagement.html")

@app.route('/modelManagement')
def modelManagement():
    return render_template("modelManagement/modelManagement.html")

@app.route('/systemManager')
def systemManager():
    return render_template("userManagement/systemManager.html")

@app.route('/dataManager')
def dataManager():
    return render_template("userManagement/dataManager.html")

@app.route('/modelManager')
def modelManager():
    return render_template("userManagement/modelManager.html")

@app.route('/agencyManagement')
def agencyManagement():
    return render_template("systemManagement/agencyManagement.html")

if __name__ == '__main__':
    app.run(debug=True)