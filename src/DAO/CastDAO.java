package DAO;

import Model.Actor;
import Model.Director;
import Util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CastDAO {
    // --- ACTORS ---
    public List<Actor> getAllActors() {
        List<Actor> actors = new ArrayList<>();
        String query = "SELECT * FROM Actors ORDER BY name ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query);
             ResultSet rs = pstmt.executeQuery()) {
            while (rs.next()) {
                actors.add(new Actor(rs.getInt("id"), rs.getString("name"), rs.getString("avatar"), rs.getString("bio")));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return actors;
    }

    public boolean addActor(Actor actor) {
        String query = "INSERT INTO Actors (name, avatar, bio) VALUES (?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setString(1, actor.getName());
            pstmt.setString(2, actor.getAvatar());
            pstmt.setString(3, actor.getBio());
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public boolean updateActor(Actor actor) {
        String query = "UPDATE Actors SET name=?, avatar=?, bio=? WHERE id=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setString(1, actor.getName());
            pstmt.setString(2, actor.getAvatar());
            pstmt.setString(3, actor.getBio());
            pstmt.setInt(4, actor.getId());
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public boolean deleteActor(int id) {
        String query = "DELETE FROM Actors WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setInt(1, id);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    // --- DIRECTORS ---
    public List<Director> getAllDirectors() {
        List<Director> directors = new ArrayList<>();
        String query = "SELECT * FROM Directors ORDER BY name ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query);
             ResultSet rs = pstmt.executeQuery()) {
            while (rs.next()) {
                directors.add(new Director(rs.getInt("id"), rs.getString("name"), rs.getString("avatar"), rs.getString("bio")));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return directors;
    }

    public boolean addDirector(Director director) {
        String query = "INSERT INTO Directors (name, avatar, bio) VALUES (?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setString(1, director.getName());
            pstmt.setString(2, director.getAvatar());
            pstmt.setString(3, director.getBio());
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public boolean updateDirector(Director director) {
        String query = "UPDATE Directors SET name=?, avatar=?, bio=? WHERE id=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setString(1, director.getName());
            pstmt.setString(2, director.getAvatar());
            pstmt.setString(3, director.getBio());
            pstmt.setInt(4, director.getId());
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public boolean deleteDirector(int id) {
        String query = "DELETE FROM Directors WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setInt(1, id);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }
}
