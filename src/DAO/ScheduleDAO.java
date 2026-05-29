package DAO;

import Model.Showtime;
import Util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ScheduleDAO {

    public List<Showtime> getShowtimesByRoom(int roomId) {
        List<Showtime> showtimes = new ArrayList<>();
        String query = "SELECT s.*, m.title as movie_title, r.name as room_name " +
                       "FROM Showtimes s " +
                       "JOIN Movies m ON s.movie_id = m.id " +
                       "JOIN Rooms r ON s.room_id = r.id " +
                       "WHERE s.room_id = ? ORDER BY s.start_time ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setInt(1, roomId);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                Showtime s = new Showtime();
                s.setId(rs.getInt("id"));
                s.setMovieId(rs.getInt("movie_id"));
                s.setRoomId(rs.getInt("room_id"));
                s.setStartTime(rs.getTimestamp("start_time"));
                s.setDurationMinutes(rs.getInt("duration_minutes"));
                s.setPrice(rs.getDouble("price"));
                s.setMovieTitle(rs.getString("movie_title"));
                s.setRoomName(rs.getString("room_name"));
                showtimes.add(s);
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return showtimes;
    }

    public List<Showtime> getFutureShowtimesByRoom(int roomId) {
        List<Showtime> showtimes = new ArrayList<>();
        String query = "SELECT s.*, m.title as movie_title, r.name as room_name " +
                       "FROM Showtimes s " +
                       "JOIN Movies m ON s.movie_id = m.id " +
                       "JOIN Rooms r ON s.room_id = r.id " +
                       "WHERE s.room_id = ? AND s.start_time > CURRENT_TIMESTAMP ORDER BY s.start_time ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setInt(1, roomId);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                Showtime s = new Showtime();
                s.setId(rs.getInt("id"));
                s.setMovieId(rs.getInt("movie_id"));
                s.setRoomId(rs.getInt("room_id"));
                s.setStartTime(rs.getTimestamp("start_time"));
                s.setDurationMinutes(rs.getInt("duration_minutes"));
                s.setPrice(rs.getDouble("price"));
                s.setMovieTitle(rs.getString("movie_title"));
                s.setRoomName(rs.getString("room_name"));
                showtimes.add(s);
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return showtimes;
    }

    public Showtime getShowtimeById(int id) {
        String query = "SELECT s.*, m.title as movie_title, r.name as room_name " +
                       "FROM Showtimes s " +
                       "JOIN Movies m ON s.movie_id = m.id " +
                       "JOIN Rooms r ON s.room_id = r.id " +
                       "WHERE s.id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                Showtime s = new Showtime();
                s.setId(rs.getInt("id"));
                s.setMovieId(rs.getInt("movie_id"));
                s.setRoomId(rs.getInt("room_id"));
                s.setStartTime(rs.getTimestamp("start_time"));
                s.setDurationMinutes(rs.getInt("duration_minutes"));
                s.setPrice(rs.getDouble("price"));
                s.setMovieTitle(rs.getString("movie_title"));
                s.setRoomName(rs.getString("room_name"));
                return s;
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return null;
    }

    public boolean isConflict(int roomId, java.util.Date newStartTime, int durationMinutes, int ignoreShowtimeId) {
        String query = "SELECT start_time, duration_minutes FROM Showtimes WHERE room_id = ? AND id != ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setInt(1, roomId);
            pstmt.setInt(2, ignoreShowtimeId);
            ResultSet rs = pstmt.executeQuery();
            
            long newStartMillis = newStartTime.getTime();
            long newEndMillis = newStartMillis + (durationMinutes * 60000L);

            while (rs.next()) {
                Timestamp existStart = rs.getTimestamp("start_time");
                int existDuration = rs.getInt("duration_minutes");
                
                long existStartMillis = existStart.getTime();
                long existEndMillis = existStartMillis + (existDuration * 60000L);

                if (newStartMillis < existEndMillis && newEndMillis > existStartMillis) {
                    return true;
                }
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public boolean addShowtime(Showtime showtime) {
        if (isConflict(showtime.getRoomId(), showtime.getStartTime(), showtime.getDurationMinutes(), 0)) {
            return false;
        }

        String query = "INSERT INTO Showtimes (movie_id, room_id, start_time, duration_minutes, price) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setInt(1, showtime.getMovieId());
            pstmt.setInt(2, showtime.getRoomId());
            pstmt.setTimestamp(3, new java.sql.Timestamp(showtime.getStartTime().getTime()));
            pstmt.setInt(4, showtime.getDurationMinutes());
            pstmt.setDouble(5, showtime.getPrice());
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public boolean updateShowtime(Showtime showtime) {
        if (isConflict(showtime.getRoomId(), showtime.getStartTime(), showtime.getDurationMinutes(), showtime.getId())) {
            return false;
        }

        String query = "UPDATE Showtimes SET movie_id=?, room_id=?, start_time=?, duration_minutes=?, price=? WHERE id=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setInt(1, showtime.getMovieId());
            pstmt.setInt(2, showtime.getRoomId());
            pstmt.setTimestamp(3, new java.sql.Timestamp(showtime.getStartTime().getTime()));
            pstmt.setInt(4, showtime.getDurationMinutes());
            pstmt.setDouble(5, showtime.getPrice());
            pstmt.setInt(6, showtime.getId());
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public boolean deleteShowtime(int id) {
        String query = "DELETE FROM Showtimes WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setInt(1, id);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }
}
