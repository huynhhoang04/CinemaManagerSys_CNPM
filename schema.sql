-- Khởi tạo cấu trúc Database cho CinemaSys_Java (PostgreSQL)

-- 1. Bảng Users (Module Identity)
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL -- 'Admin' or 'Staff'
);

-- 2. Bảng Thể loại (Genres)
CREATE TABLE Genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- 3. Bảng Phim (Movies)
CREATE TABLE Movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    poster_url VARCHAR(500),
    trailer_url VARCHAR(500),
    duration INT NOT NULL, -- Thời lượng tính bằng phút
    release_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active' -- 'Active', 'Inactive'
);

-- Bảng trung gian Phim - Thể loại
CREATE TABLE MovieGenres (
    movie_id INT NOT NULL REFERENCES Movies(id) ON DELETE CASCADE,
    genre_id INT NOT NULL REFERENCES Genres(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
);

-- 4. Bảng Diễn viên & Đạo diễn (Cast)
CREATE TABLE Actors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    bio TEXT
);

CREATE TABLE Directors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    bio TEXT
);

-- Bảng trung gian Phim - Đạo diễn
CREATE TABLE MovieDirectors (
    movie_id INT NOT NULL REFERENCES Movies(id) ON DELETE CASCADE,
    director_id INT NOT NULL REFERENCES Directors(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, director_id)
);

-- Bảng trung gian Phim - Diễn viên
CREATE TABLE MovieActors (
    movie_id INT NOT NULL REFERENCES Movies(id) ON DELETE CASCADE,
    actor_id INT NOT NULL REFERENCES Actors(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, actor_id)
);

-- 5. Bảng Rạp chiếu (Theatres)
CREATE TABLE Theatres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    preview_url VARCHAR(500),
    info TEXT,
    status VARCHAR(50) DEFAULT 'Active' -- 'Active', 'Maintenance', 'Closed'
);

-- 6. Bảng Phòng chiếu (Rooms)
CREATE TABLE Rooms (
    id SERIAL PRIMARY KEY,
    theatre_id INT NOT NULL REFERENCES Theatres(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- '2D', '3D', 'IMAX'
    capacity INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Active'
);

-- 7. Bảng Lịch chiếu (Showtimes)
CREATE TABLE Showtimes (
    id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL REFERENCES Movies(id) ON DELETE CASCADE,
    room_id INT NOT NULL REFERENCES Rooms(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    duration_minutes INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- 8. Bảng Giao dịch Bán vé (Bookings)
CREATE TABLE Bookings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(id), -- Nhân viên thực hiện giao dịch
    showtime_id INT NOT NULL REFERENCES Showtimes(id) ON DELETE CASCADE,
    booking_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL -- 'Tiền mặt', 'Thẻ ATM', 'Ví điện tử'
);

-- 9. Bảng Chi tiết Vé (Tickets)
CREATE TABLE Tickets (
    id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES Bookings(id) ON DELETE CASCADE,
    showtime_id INT NOT NULL REFERENCES Showtimes(id) ON DELETE CASCADE,
    seat_number VARCHAR(10) NOT NULL, -- Ví dụ: A1, B2
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Sold' -- 'Sold', 'Refunded'
);

-- ==============================================================================
-- INSERT DỮ LIỆU MẪU (DUMMY DATA)
-- ==============================================================================

-- 1. Tài khoản mặc định (Password chưa mã hóa vì ứng dụng Java đang kiểm tra text thô)
INSERT INTO Users (username, password, fullname, email, role) 
VALUES 
('admin', '$2a$12$R4XReaLCWuqGkfMrJRvZj.o5UzhjpgRH7EqoglvY9ta4iIOh65gdO', 'System Administrator', 'admin@cinemasys.com', 'Admin'),
('staff1', '123456', 'Nhân viên Bán Vé 01', 'staff1@cinemasys.com', 'Staff');

-- 2. Thể loại mẫu
INSERT INTO Genres (name) VALUES ('Hành Động'), ('Hài Hước'), ('Tình Cảm'), ('Viễn Tưởng'), ('Kinh Dị');

-- 3. Phim mẫu
INSERT INTO Movies (title, description, poster_url, trailer_url, duration, release_date, status)
VALUES 
('Avengers: Endgame', 'Trận chiến cuối cùng của các siêu anh hùng', 'https://via.placeholder.com/150', '', 181, '2019-04-26', 'Active'),
('Inception', 'Kẻ cắp giấc mơ', 'https://via.placeholder.com/150', '', 148, '2010-07-16', 'Active');

INSERT INTO MovieGenres (movie_id, genre_id) VALUES (1, 1), (1, 4), (2, 1), (2, 4);

-- 4. Rạp & Phòng mẫu
INSERT INTO Theatres (name, location, city, preview_url, info, status)
VALUES ('Cinema CGV Quận 1', 'Tầng 5, Vincom Center', 'Hồ Chí Minh', '', 'Rạp phim tiêu chuẩn quốc tế', 'Active');

INSERT INTO Rooms (theatre_id, name, type, capacity, status)
VALUES 
(1, 'Phòng 01', '2D', 50, 'Active'),
(1, 'Phòng IMAX', 'IMAX', 80, 'Active');

-- 5. Lịch chiếu mẫu
INSERT INTO Showtimes (movie_id, room_id, start_time, duration_minutes, price)
VALUES 
(1, 1, '2026-05-15 18:00:00', 181, 85000),
(2, 2, '2026-05-15 20:00:00', 148, 120000);
