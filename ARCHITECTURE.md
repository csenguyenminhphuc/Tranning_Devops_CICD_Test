# Kiến trúc hệ thống MyApp

## Tổng quan kiến trúc

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP Request (Port 80)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND CONTAINER                             │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │  NGINX (Port 80)│    │   REACT STATIC FILES            │ │
│  │                 │    │   (/usr/share/nginx/html)       │ │
│  │  - Serve static │◄───┤   - index.html                  │ │
│  │  - Proxy /api/* │    │   - CSS, JS bundles             │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
└─────────────┬───────────────────────────────────────────────┘
              │ Unix Socket
              │ (/tmp/myapp.sock)
              ▼
┌─────────────────────────────────────────────────────────────┐
│               BACKEND CONTAINER                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              FLASK + GUNICORN                           │ │
│  │                                                         │ │
│  │  API Endpoints:                                         │ │
│  │  - GET  /api/data        (get users)                   │ │
│  │  - POST /api/add-users   (add user)                    │ │
│  │  │ DELETE /api/delete-user/:id (delete user)           │ │
│  └─────────────────┬───────────────────────────────────────┘ │
└────────────────────┼───────────────────────────────────────────┘
                     │ TCP Connection
                     │ (host: db, port: 5432)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 DB CONTAINER                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                PostgreSQL 16                            │ │
│  │                                                         │ │
│  │  Database: phuc_db                                      │ │
│  │  User: phuc / Password: phuc                           │ │
│  │                                                         │ │
│  │  Table: users                                          │ │
│  │  - id (PRIMARY KEY)                                    │ │
│  │  - name                                                │ │
│  │  │ - email (UNIQUE)                                    │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Chi tiết từng thành phần

### 1. Frontend Container (nginx:alpine based)
```
Service: frontend
Ports: 80:80
Base Image: nginx:alpine
Build: Multi-stage
  Stage 1: node:20-alpine (build React)
  Stage 2: nginx:alpine (serve files)

Files:
├── /usr/share/nginx/html/          # React build output
│   ├── index.html
│   ├── static/css/
│   └── static/js/
└── /etc/nginx/nginx.conf           # Nginx config
```

### 2. Backend Container (python:3.12-slim based)
```
Service: backend
Ports: None (Unix socket only)
Base Image: python:3.12-slim
Command: gunicorn --bind unix:/tmp/myapp.sock app:app

Dependencies:
- flask==2.3.2
- psycopg2-binary==2.9.9
- flask-cors==4.0.0
- gunicorn==20.1.0
```

### 3. Database Container (postgres:16)
```
Service: db
Ports: 5432 (internal only)
Base Image: postgres:16
Environment:
  POSTGRES_DB: phuc_db
  POSTGRES_USER: phuc
  POSTGRES_PASSWORD: phuc
Volume: db-data:/var/lib/postgresql/data
```

## Luồng dữ liệu

### 1. Request Flow
```
User Browser → Nginx (Port 80) → React SPA
                ↓
User Action → API Call (/api/*) → Nginx Proxy → Unix Socket → Flask App
                                                                ↓
                                                        PostgreSQL Query
                                                                ↓
Flask Response ← Unix Socket ← Nginx ← Browser ← JSON Response
```

### 2. Communication Methods
```
Frontend ↔ Backend: Unix Socket (/tmp/myapp.sock)
Backend ↔ Database: TCP (postgresql://phuc:phuc@db:5432/phuc_db)
User ↔ Frontend: HTTP (localhost:80)
```

## Docker Volumes

```
Volumes:
├── db-data:/var/lib/postgresql/data     # Database persistence
└── socket:/tmp                          # Shared Unix socket
    ├── frontend container: /tmp (read)
    └── backend container: /tmp (write)
```

## Network Architecture

```
Docker Network: myapp_default (bridge)
├── frontend (nginx + react files)
├── backend (flask + gunicorn)
└── db (postgresql)

External Access: Port 80 → frontend container only
Internal Communication: Container names as hostnames
```

## Security & Configuration

### Nginx Configuration
- Serves static files directly
- Proxies `/api/*` to backend Unix socket
- Sets proper headers for proxy requests

### Backend Configuration
- Connection pooling (1-20 connections)
- CORS enabled for frontend
- Error handling with JSON responses
- ON CONFLICT handling for duplicate emails

### Database Configuration
- PostgreSQL 16 with persistent storage
- User table with unique email constraint
- Connection via environment variables
