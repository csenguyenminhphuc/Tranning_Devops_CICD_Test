# 🔒 SSL Certificates cho phucncc.com

Thư mục này chứa tất cả config và scripts cho SSL certificates.

## 📁 Files trong thư mục

### OpenSSL (Self-signed)
- `openssl.conf` - Config cho OpenSSL certificate
- `cert.pem` - Certificate file  
- `key.pem` - Private key file

### Let's Encrypt 
- `letsencrypt.conf` - Config chung cho Let's Encrypt
- `setup-phucncc-letsencrypt.sh` - Script setup chính ⭐
- `test-phucncc-staging.sh` - Test với staging environment
- `troubleshoot-letsencrypt.sh` - Troubleshooting tool
- `renew-phucncc.sh` - Script gia hạn certificate
- `nginx.acme.conf` - Nginx config cho ACME challenge
- `docker-compose.acme.yml` - Docker setup cho Let's Encrypt
- `Dockerfile.acme` - Docker image cho ACME challenge

## 🚀 Hướng dẫn sử dụng Let's Encrypt

### Bước 1: Chuẩn bị
```bash
# Domain: phucncc.com
# Email: phucncc@ncc.asia

# ⚠️ QUAN TRỌNG: Domain phải trỏ về IP công cộng của server
# Hiện tại phucncc.com -> 127.0.0.1 (localhost) sẽ KHÔNG hoạt động
```

### Bước 2: Kiểm tra hệ thống
```bash
./certs/troubleshoot-letsencrypt.sh
```

### Bước 3: Test staging (Khuyến nghị)
```bash
# Test trước để tránh rate limit
./certs/test-phucncc-staging.sh
```

### Bước 4: Setup production
```bash
# Chỉ chạy khi test staging thành công
./certs/setup-phucncc-letsencrypt.sh
```

## ⚠️ Yêu cầu cho Let's Encrypt

### 1. DNS Configuration
```bash
# Domain PHẢI trỏ về IP công cộng
# VÍ DỤ:
# phucncc.com A record -> 203.0.113.1 (IP server của bạn)

# KHÔNG được là:
# phucncc.com -> 127.0.0.1 (localhost)
# phucncc.com -> 192.168.x.x (IP nội bộ)
```

### 2. Firewall Settings
```bash
# Port 80 và 443 phải mở từ internet
sudo ufw allow 80
sudo ufw allow 443

# Hoặc với iptables:
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

### 3. Server Requirements
- Server phải có IP công cộng
- Domain phải resolve từ bên ngoài internet
- Không có reverse proxy che chắn

## 🔄 Gia hạn Certificate

Let's Encrypt certificates hết hạn sau 90 ngày.

### Auto-renewal (Tự động)
```bash
# Script tự động thêm cron job:
# 0 2 * * * /path/to/renew-phucncc.sh

# Kiểm tra cron:
crontab -l
```

### Manual renewal (Thủ công)
```bash
./certs/renew-phucncc.sh
```

## 🧪 Testing & Verification

### Kiểm tra certificate
```bash
# Online SSL test
https://www.ssllabs.com/ssltest/analyze.html?d=phucncc.com

# Command line
openssl s_client -connect phucncc.com:443 -servername phucncc.com
```

### Kiểm tra expiry
```bash
echo | openssl s_client -connect phucncc.com:443 2>/dev/null | openssl x509 -noout -dates
```

## 🚨 Troubleshooting

### Lỗi thường gặp:

1. **Domain validation failed**
   ```
   Lỗi: Domain doesn't resolve to this server
   Fix: Cập nhật DNS records
   ```

2. **Rate limit exceeded**
   ```
   Lỗi: Too many requests for domain
   Fix: Đợi 1 tuần hoặc dùng staging test
   ```

3. **Port not accessible**
   ```
   Lỗi: Connection refused on port 80
   Fix: Mở firewall ports 80/443
   ```

4. **ACME challenge failed**
   ```
   Lỗi: Challenge verification failed
   Fix: Kiểm tra nginx config và webroot
   ```

### Debug commands:
```bash
# Check containers
docker compose -f certs/docker-compose.acme.yml ps

# Check nginx logs  
docker logs $(docker compose -f certs/docker-compose.acme.yml ps -q frontend)

# Check certbot logs
sudo journalctl -u certbot
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# Test webroot
curl http://phucncc.com/.well-known/acme-challenge/test
```

## 🔀 Chuyển đổi giữa certificate types

### Từ OpenSSL về Let's Encrypt:
1. Backup OpenSSL certs: `cp cert.pem cert.pem.backup`
2. Run Let's Encrypt setup
3. Update nginx config để dùng Let's Encrypt paths

### Từ Let's Encrypt về OpenSSL:
1. Stop Let's Encrypt containers
2. Generate new OpenSSL certs
3. Update docker-compose.yml về bản gốc

## 📞 Support

Nếu gặp vấn đề:
1. Chạy troubleshoot script: `./certs/troubleshoot-letsencrypt.sh`
2. Kiểm tra logs: `sudo journalctl -u certbot`
3. Test staging trước: `./certs/test-phucncc-staging.sh`

---
*Created for domain: phucncc.com*  
*Email: phucncc@ncc.asia*  
*Date: August 11, 2025*
