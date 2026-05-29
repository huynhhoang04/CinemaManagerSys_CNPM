package Model;

import java.util.Date;

public class Showtime {
    private int id;
    private int movieId;
    private int roomId;
    private Date startTime;
    private int durationMinutes;
    private double price;
    
    // Additional fields for display purposes
    private String movieTitle;
    private String roomName;

    public Showtime() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getMovieId() { return movieId; }
    public void setMovieId(int movieId) { this.movieId = movieId; }
    public int getRoomId() { return roomId; }
    public void setRoomId(int roomId) { this.roomId = roomId; }
    public Date getStartTime() { return startTime; }
    public void setStartTime(Date startTime) { this.startTime = startTime; }
    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getMovieTitle() { return movieTitle; }
    public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }
    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }
}
