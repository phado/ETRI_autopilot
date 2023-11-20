from flask import Flask, request, render_template
from db_conn import get_pool_conn
app = Flask(__name__)

mariadb_pool = get_pool_conn()

@app.route('/dataManagement')
def dataManagement():
    return render_template("dataManagement.html")

@app.route('/modelManagement')
def modelManagement():
    return render_template("modelManagement.html")




if __name__ == '__main__':
    app.run(debug=True)