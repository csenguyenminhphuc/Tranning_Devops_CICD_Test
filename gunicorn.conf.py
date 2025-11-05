# Server socket
bind = "unix:/tmp/myapp.sock"
workers = 2                    # CPU cores * 2 + 1
timeout = 30                   # Thời gian chờ request (giây)
keepalive = 2                  # Giữ kết nối HTTP

# Logging
loglevel = "info"
accesslog = "-"               # Ghi log truy cập ra stdout
errorlog = "-"                # Ghi log lỗi ra stderr

# Process naming
proc_name = "myapp_backend"   # Tên tiến trình để dễ nhận diện