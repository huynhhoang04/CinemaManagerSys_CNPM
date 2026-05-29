package View;

import DAO.FacilityDAO;
import DAO.ScheduleDAO;
import Model.Room;
import Model.Showtime;
import Model.Theatre;
import Util.NavigationManager;
import Util.PillButton;
import Util.TableUtils;
import Util.UIUtils;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.text.SimpleDateFormat;
import java.util.List;

public class ScheduleManagementFrame extends JFrame {
    private JComboBox<TheatreItem> cbFilterTheatre;
    private JComboBox<RoomItem> cbFilterRoom;
    private JTable table;
    private DefaultTableModel model;
    private ScheduleDAO scheduleDAO;
    private FacilityDAO facilityDAO;
    private JButton btnAdd, btnEdit, btnDelete;
    private SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm");

    public ScheduleManagementFrame() {
        scheduleDAO = new ScheduleDAO();
        facilityDAO = new FacilityDAO();

        setTitle("Quản lý Lịch chiếu (Showtimes)");
        setSize(900, 600);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        UIUtils.applyBaseStyle(this);

        JPanel topPanel = new JPanel(new BorderLayout());
        topPanel.add(NavigationManager.getInstance().createHeaderPanel("Quản lý Lịch chiếu", true), BorderLayout.NORTH);

        // --- Filter Panel ---
        JPanel filterPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 15, 10));
        filterPanel.setBorder(BorderFactory.createTitledBorder("Bộ lọc"));
        
        cbFilterTheatre = new JComboBox<>();
        cbFilterTheatre.addItem(new TheatreItem(new Theatre())); // Empty
        for (Theatre t : facilityDAO.getAllTheatres()) cbFilterTheatre.addItem(new TheatreItem(t));
        
        cbFilterRoom = new JComboBox<>();
        cbFilterRoom.addItem(new RoomItem(new Room()));

        filterPanel.add(new JLabel("Rạp:"));
        filterPanel.add(cbFilterTheatre);
        filterPanel.add(new JLabel("Phòng:"));
        filterPanel.add(cbFilterRoom);
        filterPanel.setBackground(UIUtils.COLOR_BACKGROUND);

        topPanel.add(filterPanel, BorderLayout.SOUTH);
        add(topPanel, BorderLayout.NORTH);

        String[] cols = {"ID", "Phim", "Thời gian", "Thời lượng", "Giá vé"};
        model = TableUtils.createModel(cols);
        table = TableUtils.createTable(model);
        add(TableUtils.createScrollPane(table), BorderLayout.CENTER);

        // --- Toolbar ---
        JPanel toolbar = new JPanel(new FlowLayout(FlowLayout.LEFT));
        btnAdd = new PillButton("Thêm Suất chiếu");
        btnEdit = new PillButton("Sửa");
        btnDelete = new PillButton("Xóa");
        
        toolbar.add(btnAdd);
        toolbar.add(btnEdit);
        toolbar.add(btnDelete);
        toolbar.setBackground(UIUtils.COLOR_BACKGROUND);
        add(toolbar, BorderLayout.SOUTH);

        // --- Events ---
        cbFilterTheatre.addActionListener(e -> {
            TheatreItem ti = (TheatreItem) cbFilterTheatre.getSelectedItem();
            cbFilterRoom.removeAllItems();
            cbFilterRoom.addItem(new RoomItem(new Room()));
            if (ti != null && ti.theatre.getId() != 0) {
                for (Room r : facilityDAO.getRoomsByTheatreId(ti.theatre.getId())) {
                    cbFilterRoom.addItem(new RoomItem(r));
                }
            }
            loadData();
        });

        cbFilterRoom.addActionListener(e -> loadData());

        btnAdd.addActionListener(e -> {
            RoomItem ri = (RoomItem) cbFilterRoom.getSelectedItem();
            int roomId = (ri != null && ri.room.getId() != 0) ? ri.room.getId() : 0;
            ShowtimeFormDialog dialog = new ShowtimeFormDialog(this, null, roomId);
            dialog.setVisible(true);
            if (dialog.isSucceeded()) loadData();
        });

        btnEdit.addActionListener(e -> {
            int row = table.getSelectedRow();
            if (row == -1) {
                JOptionPane.showMessageDialog(this, "Chọn một suất chiếu để sửa!");
                return;
            }
            int id = (int) model.getValueAt(row, 0);
            RoomItem ri = (RoomItem) cbFilterRoom.getSelectedItem();
            if (ri == null || ri.room.getId() == 0) return;

            Showtime selected = scheduleDAO.getShowtimesByRoom(ri.room.getId()).stream()
                    .filter(s -> s.getId() == id).findFirst().orElse(null);
            
            ShowtimeFormDialog dialog = new ShowtimeFormDialog(this, selected, ri.room.getId());
            dialog.setVisible(true);
            if (dialog.isSucceeded()) loadData();
        });

        btnDelete.addActionListener(e -> {
            int row = table.getSelectedRow();
            if (row == -1) return;
            int id = (int) model.getValueAt(row, 0);
            if (JOptionPane.showConfirmDialog(this, "Xác nhận xóa suất chiếu?") == JOptionPane.YES_OPTION) {
                if (scheduleDAO.deleteShowtime(id)) loadData();
                else JOptionPane.showMessageDialog(this, "Lỗi! Có thể đã có vé được đặt.");
            }
        });
    }

    private void loadData() {
        model.setRowCount(0);
        RoomItem ri = (RoomItem) cbFilterRoom.getSelectedItem();
        if (ri != null && ri.room.getId() != 0) {
            List<Showtime> list = scheduleDAO.getShowtimesByRoom(ri.room.getId());
            for (Showtime s : list) {
                model.addRow(new Object[]{
                    s.getId(), s.getMovieTitle(), sdf.format(s.getStartTime()), s.getDurationMinutes() + " phút", s.getPrice()
                });
            }
        }
    }

    class TheatreItem {
        Theatre theatre;
        public TheatreItem(Theatre t) { this.theatre = t; }
        @Override public String toString() { return theatre.getId() == 0 ? "-- Chọn Rạp --" : theatre.getName(); }
    }

    class RoomItem {
        Room room;
        public RoomItem(Room r) { this.room = r; }
        @Override public String toString() { return room.getId() == 0 ? "-- Chọn Phòng --" : room.getName(); }
    }
}
