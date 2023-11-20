from flask import Flask, request, render_template
from db_conn import get_pool_conn
app = Flask(__name__)

# mariadb_pool = get_pool_conn()

@app.route('/login')
def login():
    return render_template("login.html")

@app.route('/register')
def register():
    return render_template("login.html")

@app.route('/findId')
def findId():
    return render_template("")

@app.route('/findPwd')
def findId():
    return render_template("")



@app.route('/dataManagement')
def dataManagement():
    return render_template("dataManagement.html")

@app.route('/modelManagement')
def modelManagement():
    return render_template("modelManagement.html")




if __name__ == '__main__':
    app.run(debug=True)