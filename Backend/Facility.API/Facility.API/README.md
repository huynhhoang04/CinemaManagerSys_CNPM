# Facility API – Cinema Manager System

Microservice quản lý cơ sở vật chất (cụm rạp & phòng chiếu) cho hệ thống quản lý rạp chiếu phim.

## 📋 API Endpoints

### Theatre Controller (`/api/theatre`)

| Method | Endpoint             | Auth   | Payload              | Response      | Mô tả                                          |
|--------|----------------------|--------|----------------------|---------------|-------------------------------------------------|
| GET    | `/api/theatre`       | Public | None                 | Danh sách Rạp | Lấy danh sách toàn bộ cụm rạp để người dùng chọn |
| GET    | `/api/theatre/{id}`  | Public | None                 | Chi tiết Rạp  | Xem chi tiết thông tin, vị trí của rạp           |
| POST   | `/api/theatre`       | Admin  | Tên, Vị trí, Tọa độ | 201 Created   | Thêm chi nhánh rạp mới                          |
| PUT    | `/api/theatre/{id}`  | Admin  | Tên, Vị trí, Tọa độ | 200 OK        | Sửa thông tin rạp                               |

### Room Controller (`/api/room`)

| Method | Endpoint                    | Auth   | Payload                                | Response         | Mô tả                          |
|--------|-----------------------------|--------|----------------------------------------|------------------|---------------------------------|
| GET    | `/api/room/theatre/{id}`    | Public | None                                   | Danh sách phòng  | Lấy danh sách phòng theo rạp    |
| GET    | `/api/room/{id}`            | Public | None                                   | Chi tiết phòng   | Xem chi tiết phòng chiếu        |
| POST   | `/api/room`                 | Admin  | TheatreId, RoomName, RoomType, Capacity | 201 Created      | Thêm phòng chiếu mới           |
| PUT    | `/api/room/{id}`            | Admin  | TheatreId, RoomName, RoomType, Capacity | 200 OK           | Cập nhật thông tin phòng chiếu  |

## 🛠 Tech Stack

- **Framework**: ASP.NET Core (.NET 10)
- **ORM**: Entity Framework Core
- **Database**: PostgreSQL
- **Authentication**: JWT Bearer Token
- **API Documentation**: Swagger / OpenAPI

## 🏗 Project Structure

```
Facility.API/
├── Controllers/
│   ├── TheatreController.cs    # CRUD endpoints cho Theatre
│   └── RoomController.cs       # CRUD endpoints cho Room
├── Models/
│   ├── Theatre.cs              # Entity Theatre
│   └── Room.cs                 # Entity Room
├── DTOs/
│   ├── Requests/
│   │   ├── TheatreRequestDto.cs
│   │   └── RoomRequestDto.cs
│   └── Responses/
│       ├── TheatreResponseDto.cs
│       └── RoomResponseDto.cs
├── Services/
│   ├── ITheatreService.cs
│   ├── TheatreService.cs
│   ├── IRoomService.cs
│   └── RoomService.cs
├── Repositories/
│   ├── ITheatreRepository.cs
│   ├── TheatreRepository.cs
│   ├── IRoomRepository.cs
│   └── RoomRepository.cs
├── Data/
│   └── FacilityDbContext.cs    # EF Core DbContext + Seed Data
├── Migrations/                 # EF Core Migrations
├── Program.cs                  # App configuration & DI
├── appsettings.json            # Configuration
├── Dockerfile                  # Docker support
└── Facility.API.http           # HTTP test requests
```

## 🚀 Cách chạy

### Yêu cầu
- .NET 10 SDK
- PostgreSQL (hoặc Docker)

### 1. Chạy PostgreSQL (Docker)
```bash
docker run -d \
  --name facility-db \
  -e POSTGRES_PASSWORD=Admin@123 \
  -e POSTGRES_DB=facility_db \
  -p 5434:5432 \
  postgres:16
```

### 2. Chạy API
```bash
cd Backend/Facility.API
dotnet restore
dotnet run
```

API sẽ chạy tại: `http://localhost:5004`
Swagger UI: `http://localhost:5004/swagger`

### 3. Chạy bằng Docker
```bash
docker build -t facility-api .
docker run -p 5004:5004 facility-api
```

## 📊 Database Schema

### Bảng `theatres`
| Column         | Type         | Mô tả              |
|----------------|--------------|---------------------|
| theatre_id     | int (PK)     | Mã rạp              |
| theatre_name   | varchar(150) | Tên rạp              |
| location       | varchar(255) | Địa chỉ              |
| coordinates    | varchar(100) | Tọa độ GPS           |
| preview_url    | varchar(500) | Ảnh đại diện         |
| info           | text         | Mô tả                |
| theatre_status | varchar(50)  | Trạng thái           |
| city           | varchar(100) | Thành phố            |

### Bảng `rooms`
| Column      | Type        | Mô tả              |
|-------------|-------------|---------------------|
| room_id     | int (PK)    | Mã phòng             |
| theatre_id  | int (FK)    | Mã rạp (FK → theatres) |
| room_name   | varchar(100)| Tên phòng            |
| room_type   | varchar(50) | Loại phòng           |
| capacity    | int         | Sức chứa             |
| room_status | varchar(50) | Trạng thái           |

## 🔑 Authentication

API sử dụng JWT Bearer Token. Các endpoint `POST` và `PUT` yêu cầu role `Admin`.

```
Authorization: Bearer <jwt-token>
```

## 👥 Thành viên
- Cinema Manager System – CNPM Project
