# LỘ TRÌNH CHUYỂN ĐỔI CINEMASYS (TO-DO LIST)

Dưới đây là danh sách các hạng mục cần thực thi để chuyển đổi toàn bộ 6 Microservices sang kiến trúc Monolith Java Core Swing. Chúng ta sẽ thực hiện tuần tự từng Module.

## 🟦 Module 1: Identity (Quản lý Người dùng & Xác thực)
- [x] **Model**: User.java (Định nghĩa thực thể người dùng và phân quyền).
- [x] **DAO**: UserDAO.java (Logic đăng nhập và CRUD người dùng).
- [x] **View**: LoginFrame.java (Giao diện đăng nhập chuẩn Swing).
- [x] **View**: UserManagementFrame.java (Quản lý danh sách nhân viên cho Admin).
- [x] **View**: UserFormDialog.java (Thêm/Sửa thông tin nhân viên).

## 🟨 Module 2: Movie (Quản lý Phim & Thể loại)
- [x] **Model**: Movie.java, Genre.java.
- [x] **DAO**: MovieDAO.java (CRUD Phim, xử lý liên kết nhiều Thể loại).
- [x] **View**: MovieManagementFrame.java (Bảng danh sách phim kèm poster).
- [x] **View**: MovieFormDialog.java (Form nhập liệu: Title, Duration, ReleaseDate, URLs).

## 🟩 Module 3: Cast (Quản lý Diễn viên & Đạo diễn)
- [x] **Model**: Actor.java, Director.java.
- [x] **DAO**: CastDAO.java (Quản lý Actor/Director).
- [x] **View**: CastManagementFrame.java (Giao diện quản lý danh sách Cast).
- [x] **View**: CastFormDialog.java (Thêm/Sửa Actor, Director).

## 🟥 Module 4: Facility (Cơ sở vật chất - Rạp & Phòng)
- [x] **Model**: Theatre.java, Room.java.
- [x] **DAO**: FacilityDAO.java (Xử lý Transaction: Tạo Rạp kèm các Phòng chiếu).
- [x] **View**: FacilityManagementFrame.java (Quản lý rạp và sơ đồ phòng).
- [x] **View**: TheatreFormDialog.java (Cấu hình Rạp và danh sách Phòng).

## 🟧 Module 5: Schedule (Lịch chiếu - Showtimes)
- [ ] **Model**: Showtime.java.
- [ ] **DAO**: ScheduleDAO.java (Logic kiểm tra xung đột thời gian chiếu tại phòng).
- [ ] **View**: ScheduleManagementFrame.java (Quản lý lịch theo Rạp/Phòng).
- [ ] **View**: ShowtimeFormDialog.java (Thiết lập suất chiếu và giá vé).

## 🟪 Module 6: Booking & POS (Bán vé & Hoàn vé)
- [ ] **Model**: Booking.java, Ticket.java.
- [ ] **DAO**: BookingDAO.java (Xử lý đặt vé, kiểm tra ghế đã bán, tính tổng tiền).
- [ ] **View**: TheatreSelectionFrame.java (Nhân viên chọn rạp làm việc).
- [ ] **View**: POSFrame.java (Giao diện bán vé: Chọn phim -> Chọn suất -> Chọn ghế).
- [ ] **Util Component**: SeatMapPanel.java (Vẽ sơ đồ ghế A1, A2... tương tác được).
- [ ] **View**: RefundFrame.java (Logic hoàn vé dựa trên thời gian bắt đầu).
- [ ] **Util**: TicketPrinter.java (Xuất hóa đơn/vé ra file PDF hoặc Text).

---
## 🛠 Giai đoạn Hoàn thiện (Polishing)
- [ ] **Util UI**: Thiết kế lớp CustomButton.java, CustomTable.java để giao diện đồng nhất.
- [ ] **Main Dashboard**: Giao diện chính phân quyền (Admin thấy Dashboard, Staff thấy POS).
- [ ] **Testing**: Kiểm tra kết nối DB và tính toàn vẹn của logic nghiệp vụ.
