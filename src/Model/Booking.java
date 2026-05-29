package Model;
import java.util.Date;
public class Booking {
    private int id;
    private int userId;
    private int showtimeId;
    private Date bookingTime;
    private double total;
    private String paymentMethod;

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    public int getShowtimeId() { return showtimeId; }
    public void setShowtimeId(int showtimeId) { this.showtimeId = showtimeId; }
    public Date getBookingTime() { return bookingTime; }
    public void setBookingTime(Date bookingTime) { this.bookingTime = bookingTime; }
    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
