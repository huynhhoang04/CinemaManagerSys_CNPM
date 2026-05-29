package View;

import DAO.BookingDAO;
import DAO.MovieDAO;
import DAO.ScheduleDAO;
import Model.*;
import Util.NavigationManager;
import Util.PillButton;
import Util.SeatMapPanel;
import Util.TicketPrinter;
import Util.UIUtils;

import javax.swing.*;
import java.awt.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class POSFrame extends JFrame {
    private User user;
    private Theatre theatre;
    private MovieDAO movieDAO;
    private ScheduleDAO scheduleDAO;
    private BookingDAO bookingDAO;
    
    private JComboBox<MovieItem> cbMovie;
    private JComboBox<ShowtimeItem> cbShowtime;
    private JPanel seatContainer;
    private JLabel lblTotal;
    private JComboBox<String> cbPayment;
    private JButton btnCheckout;
    private JButton btnRefund;
    
    private List<String> currentSelectedSeats;
    private Showtime currentShowtime;
    private SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm");

    public POSFrame(User user, Theatre theatre) {
        this.user = user;
        this.theatre = theatre;
        this.movieDAO = new MovieDAO();
        this.scheduleDAO = new ScheduleDAO();
        this.bookingDAO = new BookingDAO();

        setTitle("POS Bán Vé - " + theatre.getName() + " | Nhân viên: " + user.getFullname());
        setSize(1000, 700);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        UIUtils.applyBaseStyle(this);

        JPanel topPanel = new JPanel(new BorderLayout());
        topPanel.add(NavigationManager.getInstance().createHeaderPanel("POS Bán Vé - " + theatre.getName(), true), BorderLayout.NORTH);

        JPanel topTools = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        JButton btnLogout = new PillButton("Đăng xuất");
        btnLogout.addActionListener(e -> {
            NavigationManager.getInstance().navigateTo(this, new LoginFrame());
        });
        topTools.add(btnLogout);
        topTools.setBackground(UIUtils.COLOR_BACKGROUND);
        topPanel.add(topTools, BorderLayout.SOUTH);
        
        add(topPanel, BorderLayout.NORTH);

        JPanel leftPanel = new JPanel(new GridBagLayout());
        leftPanel.setPreferredSize(new Dimension(300, 0));
        leftPanel.setBorder(BorderFactory.createTitledBorder("Thông tin Suất Chiếu"));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.gridx = 0; gbc.gridy = 0;

        leftPanel.add(new JLabel("Chọn Phim:"), gbc);
        cbMovie = new JComboBox<>();
        cbMovie.addItem(new MovieItem(null));
        for (Movie m : movieDAO.getAllMovies()) cbMovie.addItem(new MovieItem(m));
        gbc.gridy++; leftPanel.add(cbMovie, gbc);

        gbc.gridy++; leftPanel.add(new JLabel("Chọn Suất:"), gbc);
        cbShowtime = new JComboBox<>();
        gbc.gridy++; leftPanel.add(cbShowtime, gbc);

        gbc.gridy++; leftPanel.add(new JLabel("Thanh toán:"), gbc);
        cbPayment = new JComboBox<>(new String[]{"Tiền mặt", "Thẻ ATM", "Ví điện tử"});
        gbc.gridy++; leftPanel.add(cbPayment, gbc);
        
        gbc.gridy++;
        btnRefund = new PillButton("HOÀN VÉ");
        leftPanel.add(btnRefund, gbc);

        add(leftPanel, BorderLayout.WEST);

        seatContainer = new JPanel(new BorderLayout());
        seatContainer.setBorder(BorderFactory.createTitledBorder("Sơ đồ Ghế"));
        add(seatContainer, BorderLayout.CENTER);

        JPanel bottomPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        lblTotal = new JLabel("Tổng tiền: 0 VND");
        lblTotal.setFont(new Font("Arial", Font.BOLD, 18));
        btnCheckout = new PillButton("THANH TOÁN & IN VÉ");
        btnCheckout.setEnabled(false);
        bottomPanel.add(lblTotal);
        bottomPanel.add(btnCheckout);
        add(bottomPanel, BorderLayout.SOUTH);

        cbMovie.addActionListener(e -> loadShowtimes());
        cbShowtime.addActionListener(e -> loadSeatMap());
        btnCheckout.addActionListener(e -> handleCheckout());
        btnRefund.addActionListener(e -> NavigationManager.getInstance().navigateTo(this, new RefundFrame()));
    }

    private void loadShowtimes() {
        cbShowtime.removeAllItems();
        MovieItem mi = (MovieItem) cbMovie.getSelectedItem();
        if (mi != null && mi.movie != null) {
            DAO.FacilityDAO fDAO = new DAO.FacilityDAO();
            List<Room> rooms = fDAO.getRoomsByTheatreId(theatre.getId());
            for (Room r : rooms) {
                List<Showtime> sts = scheduleDAO.getFutureShowtimesByRoom(r.getId());
                for (Showtime s : sts) {
                    if (s.getMovieId() == mi.movie.getId()) {
                        cbShowtime.addItem(new ShowtimeItem(s));
                    }
                }
            }
        }
    }

    private void loadSeatMap() {
        seatContainer.removeAll();
        ShowtimeItem si = (ShowtimeItem) cbShowtime.getSelectedItem();
        currentSelectedSeats = null;
        updateTotal();

        if (si != null && si.showtime != null) {
            currentShowtime = si.showtime;
            List<String> sold = bookingDAO.getSoldSeats(currentShowtime.getId());
            SeatMapPanel smp = new SeatMapPanel(50, sold, seats -> {
                currentSelectedSeats = seats;
                updateTotal();
            });
            seatContainer.add(new JScrollPane(smp), BorderLayout.CENTER);
        }
        seatContainer.revalidate();
        seatContainer.repaint();
    }

    private void updateTotal() {
        if (currentSelectedSeats != null && currentShowtime != null) {
            double total = currentSelectedSeats.size() * currentShowtime.getPrice();
            lblTotal.setText("Tổng tiền: " + total + " VND");
            btnCheckout.setEnabled(currentSelectedSeats.size() > 0);
        } else {
            lblTotal.setText("Tổng tiền: 0 VND");
            btnCheckout.setEnabled(false);
        }
    }

    private void handleCheckout() {
        if (currentSelectedSeats == null || currentSelectedSeats.isEmpty()) return;
        double total = currentSelectedSeats.size() * currentShowtime.getPrice();
        
        Booking b = new Booking();
        b.setUserId(user.getId());
        b.setShowtimeId(currentShowtime.getId());
        b.setBookingTime(new Date());
        b.setTotal(total);
        b.setPaymentMethod((String) cbPayment.getSelectedItem());

        List<Ticket> generatedTickets = bookingDAO.createBooking(b, currentSelectedSeats, currentShowtime.getPrice());
        if (generatedTickets != null && !generatedTickets.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Thanh toán thành công! Đang in vé...");
            TicketPrinter.printTickets(
                currentShowtime.getMovieTitle(), 
                currentShowtime.getRoomName(), 
                sdf.format(currentShowtime.getStartTime()), 
                generatedTickets, 
                b.getPaymentMethod()
            );
            loadSeatMap();
        } else {
            JOptionPane.showMessageDialog(this, "Lỗi thanh toán. Có thể ghế đã bị người khác đặt.");
        }
    }

    class MovieItem {
        Movie movie;
        public MovieItem(Movie m) { this.movie = m; }
        @Override public String toString() { return movie == null ? "-- Chọn Phim --" : movie.getTitle(); }
    }

    class ShowtimeItem {
        Showtime showtime;
        public ShowtimeItem(Showtime s) { this.showtime = s; }
        @Override public String toString() { 
            return sdf.format(showtime.getStartTime()) + " - " + showtime.getRoomName(); 
        }
    }
}
