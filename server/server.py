from flask import Flask
from flask_restful import Api
from flask_cors import CORS

from api.db_utils import exec_sql_file
from api.todo_api import *

app = Flask(__name__)
CORS(app)
api = Api(app)
    
api.add_resource(TodoItemsApi, '/todos')
api.add_resource(TodoItemApi, '/todos/<int:todo_id>')

if __name__ == '__main__':
    print("Loading DB")
    exec_sql_file('todo.sql')
    print("Starting Flask")
    app.run(debug=True)
