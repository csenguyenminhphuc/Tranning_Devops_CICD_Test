Image: Một bản mẫu (template) bất biến, mô tả cách container sẽ được tạo. Thường được build từ Dockerfile.
    Build image từ Dockerfile: docker build -t <tên_image>:<tag> <đường_dẫn_tới_Dockerfile>.
    Liệt kê images: docker images hoặc docker image ls.
    Xóa image: docker rmi <tên_image>:<tag>.
    Pull image từ registry: docker pull <tên_image>:<tag>.
    Push image lên registry: docker push <tên_image>:<tag> (sau khi login).
    Các biến và tùy chọn:
        Tag: Phiên bản của image (ví dụ: :latest, :v1.0). Biến này giúp quản lý phiên bản, tránh overwrite.



Container: Phiên bản chạy thực tế của image. Có thể start, stop, xóa, và tạo mới bất cứ lúc nào.

Code và lệnh liên quan:
    Tạo và chạy container từ image: docker run -d --name <tên_container> <tên_image>:<tag>.
    Start/stop container: docker start <tên_container>, docker stop <tên_container>.
    Liệt kê containers: docker ps (chỉ đang chạy) hoặc docker ps -a (tất cả).
    Xóa container: docker rm <tên_container> (phải stop trước nếu đang chạy).
    Exec vào container: docker exec -it <tên_container> /bin/bash (mở shell bên trong).




Dockerfile: File script chứa tập hợp các lệnh để build image.
    FROM <image>- điều này chỉ định hình ảnh cơ sở mà bản dựng sẽ mở rộng.
    WORKDIR <path>- hướng dẫn này chỉ định "thư mục làm việc" hoặc đường dẫn trong hình ảnh nơi các tập tin sẽ được sao chép và các lệnh sẽ được thực thi.
    COPY <host-path> <image-path>- hướng dẫn này yêu cầu người xây dựng sao chép các tệp từ máy chủ và đưa chúng vào hình ảnh chứa.
    RUN <command>- lệnh này yêu cầu trình xây dựng chạy lệnh đã chỉ định.
    ENV <name> <value>- hướng dẫn này thiết lập biến môi trường mà một container đang chạy sẽ sử dụng.
    EXPOSE <port-number>- hướng dẫn này thiết lập cấu hình trên hình ảnh để chỉ ra cổng mà hình ảnh muốn hiển thị.
    USER <user-or-uid>- hướng dẫn này thiết lập người dùng mặc định cho tất cả các hướng dẫn tiếp theo.
    CMD ["<command>", "<arg1>"]- hướng dẫn này thiết lập lệnh mặc định mà một container sử dụng hình ảnh này sẽ chạy.


Docker Hub: Kho lưu trữ image công khai (hoặc private) để chia sẻ hoặc tải về.
    Login: docker login (nhập username/password).
    Push image: docker push <username>/<tên_image>:<tag>, ví dụ: docker push myuser/myapp:1.0.
    Pull image: docker pull <username>/<tên_image>:<tag>.
    Search image: docker search <từ_khóa>, ví dụ: docker search nginx.
    Tạo repo: Qua web interface tại hub.docker.com.

Volume: Cơ chế lưu trữ dữ liệu bền vững cho container.
    Code và lệnh liên quan:
    Tạo volume: docker volume create <tên_volume>.
    Mount volume vào container: docker run -v <tên_volume>:<container_path> <image>.
    Liệt kê volumes: docker volume ls.
    Xóa volume: docker volume rm <tên_volume>.
    Inspect: docker volume inspect <tên_volume>.

Network: Kết nối container với nhau hoặc với môi trường bên ngoài.
bridge (default), host, overlay (cho swarm)
    Code và lệnh liên quan:
    Tạo network: docker network create <tên_network>.
    Chạy container với network: docker run --network <tên_network> <image>.
    Kết nối container vào network: docker network connect <tên_network> <tên_container>.
    Liệt kê networks: docker network ls.
    Inspect: docker network inspect <tên_network>.
    Xóa: docker network rm <tên_network>.

cd /home/adminpoi/Desktop/myapp/certs && openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -config openssl.conf -extensions v3_req


cd /home/adminpoi/Desktop/myapp && docker compose down && docker compose build frontend && docker compose up -d



 openssl req -new -x509 -days 365 -key key.pem -out cert.crt -config openssl.conf