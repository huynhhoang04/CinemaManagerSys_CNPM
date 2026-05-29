# Hướng Dẫn Triển Khai CinemaSys_Java

Dự án này là phiên bản viết lại (rewrite) của hệ thống CinemaManagerSys_CNPM từ kiến trúc Microservices (.NET + ReactJS) sang kiến trúc Monolith (Java Core Swing + JDBC).

## 1. Kiến Trúc Ứng Dụng
Ứng dụng được xây dựng theo mô hình **MVC kết hợp DAO (Data Access Object)**:
- **Model**: Chứa các lớp thực thể (Entity) đại diện cho các bảng trong cơ sở dữ liệu.
- **DAO**: Chứa logic xử lý tương tác với cơ sở dữ liệu (CRUD) và một số nghiệp vụ kinh doanh.
- **View**: Giao diện người dùng được xây dựng bằng Java Swing.
- **Util**: Các lớp tiện ích dùng chung như DBConnection (đọc cấu hình từ file .properties) và các component giao diện tùy chỉnh.

## 2. Cấu Hình Cơ Sở Dữ Liệu
Hệ thống sử dụng cơ sở dữ liệu **PostgreSQL**.
Thông tin kết nối không được hardcode trong mã nguồn mà được đặt tại file config.properties ở thư mục gốc của dự án.
- **Username mặc định**: postgres
- **Password mặc định**: 4105

### Chuẩn bị Database
Bạn cần tạo một database tên là cinemasys trong PostgreSQL và khởi tạo các bảng tương ứng với các Microservices cũ. Lược đồ database nên được gộp chung thành một database duy nhất do đây là kiến trúc Monolith.

## 3. Tiến Trình Xử Lý & Chạy Ứng Dụng
1. **Kiểm tra cấu hình**: Mở file config.properties và đảm bảo thông tin kết nối chính xác.
2. **Cài đặt thư viện**: Do yêu cầu không sử dụng Maven/Gradle, bạn cần cấu hình 2 file thư viện: postgresql-x.x.x.jar (JDBC Driver) và jbcrypt-0.4.jar (đã được tải sẵn trong thư mục lib) vào Classpath của IDE (Eclipse, IntelliJ, NetBeans).
3. **Biên dịch và chạy**: Chạy lớp Main.java (sẽ được tạo làm entry point của ứng dụng) để khởi động giao diện đăng nhập (Login Frame).

## 4. Bảo Toàn Logic Nghiệp Vụ
- Logic xử lý phân quyền (Admin, Staff) được giữ nguyên.
- Logic hoàn vé, tính toán giá vé theo thời gian chiếu được ánh xạ 1-1 từ logic frontend ReactJS cũ.
- Việc xử lý giao dịch mua vé (Transaction) sẽ được quản lý thông qua connection.setAutoCommit(false) trong JDBC để đảm bảo tính toàn vẹn dữ liệu.
