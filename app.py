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

@app.route('/update-user/<int:id>', methods=['PUT'])
def update_user(id):
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        if not name or not email:
            return jsonify({"error": "Name and email are required"}), 400
        
        conn = db_pool.getconn()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE users SET name = %s, email = %s WHERE id = %s",
            (name, email, id)
        )
        if cursor.rowcount == 0:
            return jsonify({"error": "User not found"}), 404
        conn.commit()
        cursor.close()
        db_pool.putconn(conn)
        return jsonify({"message": "User updated successfully"}), 200
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

# About me endpoint
@app.route('/about', methods=['GET'])
def get_about():
    about_info = {
        "name": "Nguyễn Minh Phúc",
        "title": "Sinh viên năm thứ 4 chuyên ngành Khoa học Máy tính",
        "focus": "DevSecOps",
        "skills": [
            {"name": "DevSecOps", "level": 85},
            {"name": "Computer Science", "level": 90},
            {"name": "Security", "level": 80},
            {"name": "Development", "level": 88}
        ],
        "interests": [
            "Security & Cybersecurity",
            "Web & Mobile Development", 
            "DevOps & Infrastructure",
            "CI/CD & Automation"
        ]
    }
    return jsonify(about_info), 200

# Statistics endpoint
@app.route('/stats', methods=['GET'])
def get_stats():
    try:
        conn = db_pool.getconn()
        cursor = conn.cursor()
        
        # Get total users count
        cursor.execute("SELECT COUNT(*) FROM users")
        total_users = cursor.fetchone()[0]
        
        # Get users added today (if we had timestamp columns)
        # For now, we'll just return some mock statistics
        stats = {
            "total_users": total_users,
            "active_sessions": 1,  # Mock data
            "system_status": "healthy",
            "last_updated": "2025-09-25"
        }
        
        cursor.close()
        db_pool.putconn(conn)
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Search users endpoint
@app.route('/search-users', methods=['GET'])
def search_users():
    try:
        query = request.args.get('q', '')
        if not query:
            return jsonify([]), 200
            
        conn = db_pool.getconn()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, name, email FROM users WHERE name ILIKE %s OR email ILIKE %s",
            (f"%{query}%", f"%{query}%")
        )
        rows = cursor.fetchall()
        data = [{"id": row[0], "name": row[1], "email": row[2]} for row in rows]
        cursor.close()
        db_pool.putconn(conn)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Nếu dùng Gunicorn, xóa đoạn dưới và dùng CMD trong Dockerfile
if __name__ == '__main__':
    app.run(debug=True, unix_socket='/tmp/myapp.sock')