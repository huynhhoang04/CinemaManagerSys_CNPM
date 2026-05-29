package DAO;

import Model.Theatre;
import Model.Room;
import Util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class FacilityDAO {
    
    public List<Theatre> getAllTheatres() {
        List<Theatre> theatres = new ArrayList<>();
        String query = "SELECT * FROM Theatres ORDER BY id DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query);
             ResultSet rs = pstmt.executeQuery()) {
            while (rs.next()) {
                Theatre t = new Theatre();
                t.setId(rs.getInt("id"));
                t.setName(rs.getString("name"));
                t.setLocation(rs.getString("location"));
                t.setCity(rs.getString("city"));
                t.setPreviewUrl(rs.getString("preview_url"));
                t.setInfo(rs.getString("info"));
                t.setStatus(rs.getString("status"));
                theatres.add(t);
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return theatres;
    }

    public boolean deleteTheatre(int id) {
        String query = "DELETE FROM Theatres WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setInt(1, id);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public List<Room> getRoomsByTheatreId(int theatreId) {
        List<Room> rooms = new ArrayList<>();
        String query = "SELECT * FROM Rooms WHERE theatre_id = ? ORDER BY name ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setInt(1, theatreId);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                Room r = new Room();
                r.setId(rs.getInt("id"));
                r.setTheatreId(rs.getInt("theatre_id"));
                r.setName(rs.getString("name"));
                r.setType(rs.getString("type"));
                r.setCapacity(rs.getInt("capacity"));
                r.setStatus(rs.getString("status"));
                rooms.add(r);
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return rooms;
    }

    public boolean saveTheatreWithRooms(Theatre theatre, List<Room> rooms, List<Integer> deletedRoomIds) {
        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);

            int theatreId = theatre.getId();
            if (theatreId == 0) {
                String tQuery = "INSERT INTO Theatres (name, location, city, preview_url, info, status) VALUES (?, ?, ?, ?, ?, ?)";
                PreparedStatement tPstmt = conn.prepareStatement(tQuery, Statement.RETURN_GENERATED_KEYS);
                tPstmt.setString(1, theatre.getName());
                tPstmt.setString(2, theatre.getLocation());
                tPstmt.setString(3, theatre.getCity());
                tPstmt.setString(4, theatre.getPreviewUrl());
                tPstmt.setString(5, theatre.getInfo());
                tPstmt.setString(6, theatre.getStatus());
                tPstmt.executeUpdate();
                ResultSet rs = tPstmt.getGeneratedKeys();
                if (rs.next()) theatreId = rs.getInt(1);
            } else {
                String tQuery = "UPDATE Theatres SET name=?, location=?, city=?, preview_url=?, info=?, status=? WHERE id=?";
                PreparedStatement tPstmt = conn.prepareStatement(tQuery);
                tPstmt.setString(1, theatre.getName());
                tPstmt.setString(2, theatre.getLocation());
                tPstmt.setString(3, theatre.getCity());
                tPstmt.setString(4, theatre.getPreviewUrl());
                tPstmt.setString(5, theatre.getInfo());
                tPstmt.setString(6, theatre.getStatus());
                tPstmt.setInt(7, theatreId);
                tPstmt.executeUpdate();
            }

            if (deletedRoomIds != null && !deletedRoomIds.isEmpty()) {
                String delQuery = "DELETE FROM Rooms WHERE id = ?";
                PreparedStatement delPstmt = conn.prepareStatement(delQuery);
                for (int rid : deletedRoomIds) {
                    delPstmt.setInt(1, rid);
                    delPstmt.addBatch();
                }
                delPstmt.executeBatch();
            }

            String insQuery = "INSERT INTO Rooms (theatre_id, name, type, capacity, status) VALUES (?, ?, ?, ?, ?)";
            String updQuery = "UPDATE Rooms SET name=?, type=?, capacity=?, status=? WHERE id=?";
            PreparedStatement insPstmt = conn.prepareStatement(insQuery);
            PreparedStatement updPstmt = conn.prepareStatement(updQuery);

            for (Room r : rooms) {
                if (r.getId() == 0) {
                    insPstmt.setInt(1, theatreId);
                    insPstmt.setString(2, r.getName());
                    insPstmt.setString(3, r.getType());
                    insPstmt.setInt(4, r.getCapacity());
                    insPstmt.setString(5, r.getStatus());
                    insPstmt.addBatch();
                } else {
                    updPstmt.setString(1, r.getName());
                    updPstmt.setString(2, r.getType());
                    updPstmt.setInt(3, r.getCapacity());
                    updPstmt.setString(4, r.getStatus());
                    updPstmt.setInt(5, r.getId());
                    updPstmt.addBatch();
                }
            }
            insPstmt.executeBatch();
            updPstmt.executeBatch();

            conn.commit();
            return true;
        } catch (SQLException e) {
            if (conn != null) try { conn.rollback(); } catch (SQLException ex) { ex.printStackTrace(); }
            e.printStackTrace();
        } finally {
            if (conn != null) try { conn.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
        return false;
    }
}
