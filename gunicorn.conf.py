# Gunicorn configuration file

# Server socket
bind = "unix:/tmp/myapp.sock"
backlog = 2048

# Worker processes
workers = 2                    # CPU cores * 2 + 1
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2

# Restart workers after this many requests, to prevent memory leaks
max_requests = 1000
max_requests_jitter = 50

# Logging
accesslog = "-"               # stdout
errorlog = "-"                # stderr
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# Process naming
proc_name = "myapp_backend"

# Server mechanics
daemon = False
pidfile = "/tmp/gunicorn.pid"
user = None
group = None
tmp_upload_dir = None

# SSL (nếu cần)
# keyfile = "/path/to/keyfile"
# certfile = "/path/to/certfile"

# Application
# module = "app:app"  # Được define trong CMD
