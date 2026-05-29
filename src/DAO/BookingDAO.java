package DAO;

import Model.Booking;
import Model.Ticket;
import Util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BookingDAO {
    public List<String> getSoldSeats(int showtimeId) {
        List<String> seats = new ArrayList<>();
        String query = "SELECT seat_number FROM Tickets WHERE showtime_id = ? AND status = 'Sold'";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setInt(1, showtimeId);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) seats.add(rs.getString("seat_number"));
        } catch (SQLException e) { e.printStackTrace(); }
        return seats;
    }

    public List<Ticket> createBooking(Booking booking, List<String> seats, double pricePerSeat) {
        Connection conn = null;
        List<Ticket> generatedTickets = new ArrayList<>();
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);
            
            String bQuery = "INSERT INTO Bookings (user_id, showtime_id, booking_time, total, payment_method) VALUES (?, ?, ?, ?, ?)";
            PreparedStatement bPstmt = conn.prepareStatement(bQuery, Statement.RETURN_GENERATED_KEYS);
            bPstmt.setInt(1, booking.getUserId());
            bPstmt.setInt(2, booking.getShowtimeId());
            bPstmt.setTimestamp(3, new Timestamp(booking.getBookingTime().getTime()));
            bPstmt.setDouble(4, booking.getTotal());
            bPstmt.setString(5, booking.getPaymentMethod());
            bPstmt.executeUpdate();
            
            ResultSet rs = bPstmt.getGeneratedKeys();
            int bookingId = 0;
            if (rs.next()) bookingId = rs.getInt(1);
            
            String tQuery = "INSERT INTO Tickets (booking_id, showtime_id, seat_number, price, status) VALUES (?, ?, ?, ?, 'Sold')";
            PreparedStatement tPstmt = conn.prepareStatement(tQuery, Statement.RETURN_GENERATED_KEYS);
            for (String seat : seats) {
                tPstmt.setInt(1, bookingId);
                tPstmt.setInt(2, booking.getShowtimeId());
                tPstmt.setString(3, seat);
                tPstmt.setDouble(4, pricePerSeat);
                tPstmt.executeUpdate();
                
                ResultSet trs = tPstmt.getGeneratedKeys();
                if (trs.next()) {
                    Ticket t = new Ticket();
                    t.setId(trs.getInt(1));
                    t.setBookingId(bookingId);
                    t.setShowtimeId(booking.getShowtimeId());
                    t.setSeatNumber(seat);
                    t.setPrice(pricePerSeat);
                    t.setStatus("Sold");
                    generatedTickets.add(t);
                }
            }
            
            conn.commit();
            return generatedTickets;
        } catch (SQLException e) {
            if (conn != null) try { conn.rollback(); } catch (SQLException ex) { ex.printStackTrace(); }
            e.printStackTrace();
        } finally {
            if (conn != null) try { conn.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
        return null;
    }
    
    public Ticket getTicketById(int ticketId) {
        String query = "SELECT * FROM Tickets WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setInt(1, ticketId);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                Ticket t = new Ticket();
                t.setId(rs.getInt("id"));
                t.setBookingId(rs.getInt("booking_id"));
                t.setShowtimeId(rs.getInt("showtime_id"));
                t.setSeatNumber(rs.getString("seat_number"));
                t.setPrice(rs.getDouble("price"));
                t.setStatus(rs.getString("status"));
                return t;
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return null;
    }
    
    public boolean refundTicket(int ticketId) {
        String query = "DELETE FROM Tickets WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setInt(1, ticketId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }
}
