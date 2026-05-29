package View;

import DAO.FacilityDAO;
import DAO.MovieDAO;
import DAO.ScheduleDAO;
import Model.Movie;
import Model.Room;
import Model.Showtime;
import Model.Theatre;
import Util.PillButton;
import Util.UIUtils;

import javax.swing.*;
import java.awt.*;
import java.util.Date;
import java.util.List;

public class ShowtimeFormDialog extends JDialog {
    private JComboBox<MovieItem> cbMovie;
    private JComboBox<TheatreItem> cbTheatre;
    private JComboBox<RoomItem> cbRoom;
    private JSpinner spinnerTime;
    private JTextField txtPrice;
    private JButton btnSave, btnCancel;

    private ScheduleDAO scheduleDAO;
    private MovieDAO movieDAO;
    private FacilityDAO facilityDAO;
    private Showtime showtime;
    private boolean isSucceeded = false;
    private int currentRoomIdFilter;

    public ShowtimeFormDialog(Frame parent, Showtime showtime, int currentRoomIdFilter) {
        super(parent, (showtime == null ? "Thêm Suất chiếu mới" : "Cập nhật Suất chiếu"), true);
        UIUtils.applyBaseStyle(this);
        this.showtime = showtime;
        this.currentRoomIdFilter = currentRoomIdFilter;
        this.scheduleDAO = new ScheduleDAO();
        this.movieDAO = new MovieDAO();
        this.facilityDAO = new FacilityDAO();

        setSize(450, 350);
        setLocationRelativeTo(parent);
        setLayout(new BorderLayout());

        JPanel formPanel = new JPanel(new GridBagLayout());
        formPanel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        List<Movie> movies = movieDAO.getAllMovies();
        List<Theatre> theatres = facilityDAO.getAllTheatres();

        gbc.gridx = 0; gbc.gridy = 0;
        formPanel.add(new JLabel("Phim:"), gbc);
        cbMovie = new JComboBox<>();
        for (Movie m : movies) cbMovie.addItem(new MovieItem(m));
        gbc.gridx = 1;
        formPanel.add(cbMovie, gbc);

        gbc.gridx = 0; gbc.gridy = 1;
        formPanel.add(new JLabel("Rạp:"), gbc);
        cbTheatre = new JComboBox<>();
        cbTheatre.addItem(new TheatreItem(new Theatre())); 
        for (Theatre t : theatres) cbTheatre.addItem(new TheatreItem(t));
        gbc.gridx = 1;
        formPanel.add(cbTheatre, gbc);

        gbc.gridx = 0; gbc.gridy = 2;
        formPanel.add(new JLabel("Phòng chiếu:"), gbc);
        cbRoom = new JComboBox<>();
        gbc.gridx = 1;
        formPanel.add(cbRoom, gbc);

        gbc.gridx = 0; gbc.gridy = 3;
        formPanel.add(new JLabel("Thời gian bắt đầu:"), gbc);
        spinnerTime = new JSpinner(new SpinnerDateModel());
        JSpinner.DateEditor timeEditor = new JSpinner.DateEditor(spinnerTime, "yyyy-MM-dd HH:mm");
        spinnerTime.setEditor(timeEditor);
        gbc.gridx = 1;
        formPanel.add(spinnerTime, gbc);

        gbc.gridx = 0; gbc.gridy = 4;
        formPanel.add(new JLabel("Giá vé (VND):"), gbc);
        txtPrice = new JTextField("50000");
        gbc.gridx = 1;
        formPanel.add(txtPrice, gbc);

        add(formPanel, BorderLayout.CENTER);

        JPanel btnPanel = new JPanel();
        btnSave = new PillButton("LƯU SUẤT CHIẾU");
        btnCancel = new PillButton("HỦY");
        btnPanel.add(btnSave);
        btnPanel.add(btnCancel);
        add(btnPanel, BorderLayout.SOUTH);

        cbTheatre.addActionListener(e -> {
            TheatreItem ti = (TheatreItem) cbTheatre.getSelectedItem();
            cbRoom.removeAllItems();
            if (ti != null && ti.theatre.getId() != 0) {
                List<Room> rooms = facilityDAO.getRoomsByTheatreId(ti.theatre.getId());
                for (Room r : rooms) cbRoom.addItem(new RoomItem(r));
            }
        });

        if (showtime != null) {
            for (int i = 0; i < cbMovie.getItemCount(); i++) {
                if (cbMovie.getItemAt(i).movie.getId() == showtime.getMovieId()) {
                    cbMovie.setSelectedIndex(i); break;
                }
            }
            spinnerTime.setValue(showtime.getStartTime());
            txtPrice.setText(String.valueOf((int)showtime.getPrice()));
            
            // To pre-select theatre, we need to know the room's theatre ID. We can skip it 
            // for simplicity since updating forces staff to re-confirm Theatre -> Room.
        }

        btnSave.addActionListener(e -> handleSave());
        btnCancel.addActionListener(e -> dispose());
    }

    private void handleSave() {
        MovieItem mi = (MovieItem) cbMovie.getSelectedItem();
        RoomItem ri = (RoomItem) cbRoom.getSelectedItem();
        
        if (mi == null || ri == null) {
            JOptionPane.showMessageDialog(this, "Vui lòng chọn Phim và Phòng chiếu!");
            return;
        }

        try {
            double price = Double.parseDouble(txtPrice.getText().trim());
            Date startTime = (Date) spinnerTime.getValue();
            int duration = mi.movie.getDuration() > 0 ? mi.movie.getDuration() : 120; // Default 120p

            if (showtime == null) showtime = new Showtime();
            showtime.setMovieId(mi.movie.getId());
            showtime.setRoomId(ri.room.getId());
            showtime.setStartTime(startTime);
            showtime.setDurationMinutes(duration);
            showtime.setPrice(price);

            boolean res;
            if (showtime.getId() == 0) {
                res = scheduleDAO.addShowtime(showtime);
            } else {
                res = scheduleDAO.updateShowtime(showtime);
            }

            if (res) {
                isSucceeded = true;
                dispose();
            } else {
                JOptionPane.showMessageDialog(this, "Trùng lịch chiếu! Vui lòng chọn khung giờ khác.", "Lỗi Conflict", JOptionPane.ERROR_MESSAGE);
            }
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Giá vé không hợp lệ!");
        }
    }

    public boolean isSucceeded() { return isSucceeded; }

    class MovieItem {
        Movie movie;
        public MovieItem(Movie m) { this.movie = m; }
        @Override public String toString() { return movie.getTitle(); }
    }

    class TheatreItem {
        Theatre theatre;
        public TheatreItem(Theatre t) { this.theatre = t; }
        @Override public String toString() { return theatre.getId() == 0 ? "-- Chọn Rạp --" : theatre.getName(); }
    }

    class RoomItem {
        Room room;
        public RoomItem(Room r) { this.room = r; }
        @Override public String toString() { return room.getName() + " (" + room.getType() + ")"; }
    }
}
