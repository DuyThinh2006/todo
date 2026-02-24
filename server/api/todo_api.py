from flask_restful import Resource, reqparse    
from api.db_utils import *

class TodoItemsApi(Resource):
    def get(self):
        sql = "SELECT id, item FROM todo_items ORDER BY id;"
        rows = exec_get_all(sql)
        result = []
        for row in rows:
            result.append({'id': row[0], 'item': row[1]})
        return result, 200

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('item', type=str, required=True, help='Item cannot be blank!')
        args = parser.parse_args()
        sql = "INSERT INTO todo_items (item) VALUES (%(item)s) RETURNING id;"
        exec_commit(sql, args)
        new_id = exec_get_one(sql, args)[0]
        return {'id': new_id, 'item': args['item']}, 201

class TodoItemApi(Resource):
    def get(self, todo_id):
        sql = "SELECT id, item FROM todo_items WHERE id = %(id)s;"
        row = exec_get_one(sql, {'id': todo_id})
        if row:
            return {'id': row[0], 'item': row[1]}, 200
        return {'message': 'Item not found'}, 404

    def put(self, todo_id):
        parser = reqparse.RequestParser()
        parser.add_argument('item', type=str, required=True, help='Item cannot be blank!')
        args = parser.parse_args()
        sql = "UPDATE todo_items SET item = %(item)s WHERE id = %(id)s RETURNING id;"
        exec_commit(sql, {'id': todo_id, 'item': args['item']})
        updated_id = exec_get_one(sql, {'id': todo_id, 'item': args['item']})
        if updated_id:
            return {'id': updated_id[0], 'item': args['item']}, 200
        return {'message': 'Item not found'}, 404

    def delete(self, todo_id):
        sql = "DELETE FROM todo_items WHERE id = %(id)s;"
        exec_commit(sql, {'id': todo_id})
        return {'message': 'Item deleted'}, 200