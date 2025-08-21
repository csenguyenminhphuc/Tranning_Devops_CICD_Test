from flask import Flask, jsonify, request
import psycopg2
from psycopg2 import pool
from flask_cors import CORS
import os

app = Flask(__name__)
# CORS config để cho phép frontend gọi API
CORS(app, origins=[
    'https://phucncc.com',      # Frontend domain
    'https://be.localhost',     # Backend domain
    'https://localhost',        # Local development
    'https://be.phucncc.com'    # Backup backend domain
], supports_credentials=True)

# Đọc cấu hình từ environment variables

config = {
    'database': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT')
}

# Khởi tạo connection pool với thông tin từ key.json
try:
    db_pool = psycopg2.pool.SimpleConnectionPool(
        1, 20,
        user=config['user'],
        password=config['password'],
        host=config['host'],
        port=config['port'],
        database=config['database']
    )
except Exception as e:
    print(f"Error connecting to database: {e}")
    exit(1)

@app.route('/data', methods=['GET'])
def get_data():
    try:
        conn = db_pool.getconn()
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, email FROM users")
        rows = cursor.fetchall()
        data = [{"id": row[0], "name": row[1], "email": row[2]} for row in rows]
        cursor.close()
        db_pool.putconn(conn)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/add-users', methods=['POST'])
def add_users():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        if not name or not email:
            return jsonify({"error": "Name and email are required"}), 400
        
        conn = db_pool.getconn()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (name, email) VALUES (%s, %s) ON CONFLICT (email) DO NOTHING",
            (name, email)
        )
        conn.commit()
        cursor.close()
        db_pool.putconn(conn)
        return jsonify({"message": "User added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/delete-user/<int:id>', methods=['DELETE'])
def delete_user(id):
    try:
        conn = db_pool.getconn()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM users WHERE id = %s", (id,))
        if cursor.rowcount == 0:
            return jsonify({"error": "User not found"}), 404
        conn.commit()
        cursor.close()
        db_pool.putconn(conn)
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "backend"}), 200

# Nếu dùng Gunicorn, xóa đoạn dưới và dùng CMD trong Dockerfile
if __name__ == '__main__':
    app.run(debug=True, unix_socket='/tmp/myapp.sock')