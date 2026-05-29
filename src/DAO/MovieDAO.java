package DAO;

import Model.Movie;
import Model.Genre;
import Model.Actor;
import Model.Director;
import Util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MovieDAO {
    
    public List<Genre> getAllGenres() {
        List<Genre> genres = new ArrayList<>();
        String query = "SELECT * FROM Genres ORDER BY name ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query);
             ResultSet rs = pstmt.executeQuery()) {
            while (rs.next()) {
                genres.add(new Genre(rs.getInt("id"), rs.getString("name")));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return genres;
    }

    public List<Movie> getAllMovies() {
        List<Movie> movies = new ArrayList<>();
        String query = "SELECT * FROM Movies ORDER BY id DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query);
             ResultSet rs = pstmt.executeQuery()) {
            while (rs.next()) {
                Movie m = new Movie();
                m.setId(rs.getInt("id"));
                m.setTitle(rs.getString("title"));
                m.setDescription(rs.getString("description"));
                m.setPosterUrl(rs.getString("poster_url"));
                m.setTrailerUrl(rs.getString("trailer_url"));
                m.setDuration(rs.getInt("duration"));
                m.setReleaseDate(rs.getDate("release_date"));
                m.setStatus(rs.getString("status"));
                m.setGenres(getGenresByMovieId(m.getId()));
                m.setActors(getActorsByMovieId(m.getId()));
                m.setDirectors(getDirectorsByMovieId(m.getId()));
                movies.add(m);
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return movies;
    }

    public List<Movie> getActiveMovies() {
        List<Movie> movies = new ArrayList<>();
        String query = "SELECT * FROM Movies WHERE status = 'Active' ORDER BY id DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query);
             ResultSet rs = pstmt.executeQuery()) {
            while (rs.next()) {
                Movie m = new Movie();
                m.setId(rs.getInt("id"));
                m.setTitle(rs.getString("title"));
                m.setDescription(rs.getString("description"));
                m.setPosterUrl(rs.getString("poster_url"));
                m.setTrailerUrl(rs.getString("trailer_url"));
                m.setDuration(rs.getInt("duration"));
                m.setReleaseDate(rs.getDate("release_date"));
                m.setStatus(rs.getString("status"));
                m.setGenres(getGenresByMovieId(m.getId()));
                m.setActors(getActorsByMovieId(m.getId()));
                m.setDirectors(getDirectorsByMovieId(m.getId()));
                movies.add(m);
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return movies;
    }

    private List<Genre> getGenresByMovieId(int movieId) {
        List<Genre> genres = new ArrayList<>();
        String query = "SELECT g.* FROM Genres g JOIN MovieGenres mg ON g.id = mg.genre_id WHERE mg.movie_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setInt(1, movieId);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                genres.add(new Genre(rs.getInt("id"), rs.getString("name")));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return genres;
    }

    private List<Actor> getActorsByMovieId(int movieId) {
        List<Actor> actors = new ArrayList<>();
        String query = "SELECT a.* FROM Actors a JOIN MovieActors ma ON a.id = ma.actor_id WHERE ma.movie_id = ?";
        try (Connection conn = DBConnection.getConnection(); PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setInt(1, movieId);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) actors.add(new Actor(rs.getInt("id"), rs.getString("name"), rs.getString("avatar"), rs.getString("bio")));
        } catch (SQLException e) { e.printStackTrace(); }
        return actors;
    }

    private List<Director> getDirectorsByMovieId(int movieId) {
        List<Director> directors = new ArrayList<>();
        String query = "SELECT d.* FROM Directors d JOIN MovieDirectors md ON d.id = md.director_id WHERE md.movie_id = ?";
        try (Connection conn = DBConnection.getConnection(); PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setInt(1, movieId);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) directors.add(new Director(rs.getInt("id"), rs.getString("name"), rs.getString("avatar"), rs.getString("bio")));
        } catch (SQLException e) { e.printStackTrace(); }
        return directors;
    }

    public boolean addMovie(Movie movie, List<Integer> genreIds, List<Integer> actorIds, List<Integer> directorIds) {
        String query = "INSERT INTO Movies (title, description, poster_url, trailer_url, duration, release_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);
            
            PreparedStatement pstmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, movie.getTitle());
            pstmt.setString(2, movie.getDescription());
            pstmt.setString(3, movie.getPosterUrl());
            pstmt.setString(4, movie.getTrailerUrl());
            pstmt.setInt(5, movie.getDuration());
            pstmt.setDate(6, new java.sql.Date(movie.getReleaseDate().getTime()));
            pstmt.setString(7, movie.getStatus());
            
            int affectedRows = pstmt.executeUpdate();
            if (affectedRows == 0) throw new SQLException("Failed to add movie.");
            
            ResultSet generatedKeys = pstmt.getGeneratedKeys();
            if (generatedKeys.next()) {
                int movieId = generatedKeys.getInt(1);
                // Insert Genres
                String mgQuery = "INSERT INTO MovieGenres (movie_id, genre_id) VALUES (?, ?)";
                PreparedStatement mgPstmt = conn.prepareStatement(mgQuery);
                for (int gid : genreIds) {
                    mgPstmt.setInt(1, movieId);
                    mgPstmt.setInt(2, gid);
                    mgPstmt.addBatch();
                }
                mgPstmt.executeBatch();
                
                // Insert Actors
                String maQuery = "INSERT INTO MovieActors (movie_id, actor_id) VALUES (?, ?)";
                PreparedStatement maPstmt = conn.prepareStatement(maQuery);
                for (int aid : actorIds) {
                    maPstmt.setInt(1, movieId);
                    maPstmt.setInt(2, aid);
                    maPstmt.addBatch();
                }
                maPstmt.executeBatch();
                
                // Insert Directors
                String mdQuery = "INSERT INTO MovieDirectors (movie_id, director_id) VALUES (?, ?)";
                PreparedStatement mdPstmt = conn.prepareStatement(mdQuery);
                for (int did : directorIds) {
                    mdPstmt.setInt(1, movieId);
                    mdPstmt.setInt(2, did);
                    mdPstmt.addBatch();
                }
                mdPstmt.executeBatch();
            }
            
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

    public boolean updateMovie(Movie movie, List<Integer> genreIds, List<Integer> actorIds, List<Integer> directorIds) {
        String query = "UPDATE Movies SET title=?, description=?, poster_url=?, trailer_url=?, duration=?, release_date=?, status=? WHERE id=?";
        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);
            
            PreparedStatement pstmt = conn.prepareStatement(query);
            pstmt.setString(1, movie.getTitle());
            pstmt.setString(2, movie.getDescription());
            pstmt.setString(3, movie.getPosterUrl());
            pstmt.setString(4, movie.getTrailerUrl());
            pstmt.setInt(5, movie.getDuration());
            pstmt.setDate(6, new java.sql.Date(movie.getReleaseDate().getTime()));
            pstmt.setString(7, movie.getStatus());
            pstmt.setInt(8, movie.getId());
            pstmt.executeUpdate();
            
            // Sync Genres: Delete old, Insert new
            String delQuery = "DELETE FROM MovieGenres WHERE movie_id = ?";
            PreparedStatement delPstmt = conn.prepareStatement(delQuery);
            delPstmt.setInt(1, movie.getId());
            delPstmt.executeUpdate();
            
            String insQuery = "INSERT INTO MovieGenres (movie_id, genre_id) VALUES (?, ?)";
            PreparedStatement insPstmt = conn.prepareStatement(insQuery);
            for (int gid : genreIds) {
                insPstmt.setInt(1, movie.getId());
                insPstmt.setInt(2, gid);
                insPstmt.addBatch();
            }
            insPstmt.executeBatch();
            
            // Sync Actors
            String delActorsQuery = "DELETE FROM MovieActors WHERE movie_id = ?";
            PreparedStatement delActorsPstmt = conn.prepareStatement(delActorsQuery);
            delActorsPstmt.setInt(1, movie.getId());
            delActorsPstmt.executeUpdate();
            
            String insActorsQuery = "INSERT INTO MovieActors (movie_id, actor_id) VALUES (?, ?)";
            PreparedStatement insActorsPstmt = conn.prepareStatement(insActorsQuery);
            for (int aid : actorIds) {
                insActorsPstmt.setInt(1, movie.getId());
                insActorsPstmt.setInt(2, aid);
                insActorsPstmt.addBatch();
            }
            insActorsPstmt.executeBatch();

            // Sync Directors
            String delDirsQuery = "DELETE FROM MovieDirectors WHERE movie_id = ?";
            PreparedStatement delDirsPstmt = conn.prepareStatement(delDirsQuery);
            delDirsPstmt.setInt(1, movie.getId());
            delDirsPstmt.executeUpdate();
            
            String insDirsQuery = "INSERT INTO MovieDirectors (movie_id, director_id) VALUES (?, ?)";
            PreparedStatement insDirsPstmt = conn.prepareStatement(insDirsQuery);
            for (int did : directorIds) {
                insDirsPstmt.setInt(1, movie.getId());
                insDirsPstmt.setInt(2, did);
                insDirsPstmt.addBatch();
            }
            insDirsPstmt.executeBatch();
            
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

    public boolean deleteMovie(int id) {
        // Check if there are showtimes for this movie
        String checkQuery = "SELECT COUNT(*) FROM Showtimes WHERE movie_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(checkQuery)) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next() && rs.getInt(1) > 0) {
                return false; // Cannot delete movie that has showtimes
            }
        } catch (SQLException e) { e.printStackTrace(); }

        String query = "DELETE FROM Movies WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setInt(1, id);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }
}
