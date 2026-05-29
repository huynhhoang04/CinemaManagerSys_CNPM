package View;

import DAO.FacilityDAO;
import Model.Theatre;
import Model.Room;
import Util.PillButton;
import Util.UIUtils;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;

public class TheatreFormDialog extends JDialog {
    private JTextField txtName, txtCity, txtLocation, txtPreviewUrl;
    private JTextArea txtInfo;
    private JComboBox<String> cbStatus;
    private JTable tableRooms;
    private DefaultTableModel modelRooms;
    private FacilityDAO facilityDAO;
    private Theatre theatre;
    private List<Integer> deletedRoomIds;
    private boolean isSucceeded = false;

    public TheatreFormDialog(Frame parent, Theatre theatre) {
        super(parent, (theatre == null ? "Thêm Rạp mới" : "Cập nhật Rạp & Phòng"), true);
        UIUtils.applyBaseStyle(this);
        this.theatre = theatre;
        this.facilityDAO = new FacilityDAO();
        this.deletedRoomIds = new ArrayList<>();

        setSize(700, 700);
        setLocationRelativeTo(parent);
        setLayout(new BorderLayout());

        JPanel topPanel = new JPanel(new GridBagLayout());
        topPanel.setBorder(BorderFactory.createTitledBorder("1. Thông tin Rạp"));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        gbc.gridx = 0; gbc.gridy = 0;
        topPanel.add(new JLabel("Tên Rạp:"), gbc);
        txtName = new JTextField(20);
        gbc.gridx = 1;
        topPanel.add(txtName, gbc);

        gbc.gridx = 0; gbc.gridy = 1;
        topPanel.add(new JLabel("Thành phố:"), gbc);
        txtCity = new JTextField(20);
        gbc.gridx = 1;
        topPanel.add(txtCity, gbc);

        gbc.gridx = 0; gbc.gridy = 2;
        topPanel.add(new JLabel("Địa chỉ:"), gbc);
        txtLocation = new JTextField(20);
        gbc.gridx = 1;
        topPanel.add(txtLocation, gbc);

        gbc.gridx = 0; gbc.gridy = 3;
        topPanel.add(new JLabel("Trạng thái:"), gbc);
        cbStatus = new JComboBox<>(new String[]{"Active", "Maintenance", "Closed"});
        gbc.gridx = 1;
        topPanel.add(cbStatus, gbc);

        gbc.gridx = 0; gbc.gridy = 4;
        topPanel.add(new JLabel("Preview URL:"), gbc);
        txtPreviewUrl = new JTextField();
        gbc.gridx = 1;
        topPanel.add(txtPreviewUrl, gbc);

        gbc.gridx = 0; gbc.gridy = 5;
        topPanel.add(new JLabel("Thông tin:"), gbc);
        txtInfo = new JTextArea(3, 20);
        gbc.gridx = 1;
        topPanel.add(new JScrollPane(txtInfo), gbc);

        add(topPanel, BorderLayout.NORTH);

        JPanel centerPanel = new JPanel(new BorderLayout());
        centerPanel.setBorder(BorderFactory.createTitledBorder("2. Danh sách Phòng chiếu"));

        JPanel roomToolbar = new JPanel(new FlowLayout(FlowLayout.LEFT));
        JButton btnAddRoom = new PillButton("Thêm Phòng");
        JButton btnDelRoom = new PillButton("Xóa Phòng");
        roomToolbar.add(btnAddRoom);
        roomToolbar.add(btnDelRoom);
        centerPanel.add(roomToolbar, BorderLayout.NORTH);

        String[] cols = {"ID", "Tên Phòng", "Loại", "Sức chứa", "Trạng thái"};
        modelRooms = new DefaultTableModel(cols, 0) {
            @Override
            public boolean isCellEditable(int row, int column) { return column != 0; }
        };
        tableRooms = new JTable(modelRooms);
        centerPanel.add(new JScrollPane(tableRooms), BorderLayout.CENTER);

        add(centerPanel, BorderLayout.CENTER);

        JPanel btnPanel = new JPanel();
        JButton btnSave = new PillButton("LƯU TOÀN BỘ");
        JButton btnCancel = new PillButton("HỦY");
        btnPanel.add(btnSave);
        btnPanel.add(btnCancel);
        add(btnPanel, BorderLayout.SOUTH);

        if (theatre != null) {
            txtName.setText(theatre.getName());
            txtCity.setText(theatre.getCity());
            txtLocation.setText(theatre.getLocation());
            cbStatus.setSelectedItem(theatre.getStatus());
            txtPreviewUrl.setText(theatre.getPreviewUrl());
            txtInfo.setText(theatre.getInfo());
            
            for (Room r : facilityDAO.getRoomsByTheatreId(theatre.getId())) {
                modelRooms.addRow(new Object[]{r.getId(), r.getName(), r.getType(), r.getCapacity(), r.getStatus()});
            }
        }

        btnAddRoom.addActionListener(e -> modelRooms.addRow(new Object[]{0, "Phòng mới", "2D", 100, "Active"}));
        btnDelRoom.addActionListener(e -> {
            int row = tableRooms.getSelectedRow();
            if (row != -1) {
                int id = (int) modelRooms.getValueAt(row, 0);
                if (id != 0) deletedRoomIds.add(id);
                modelRooms.removeRow(row);
            }
        });
        btnSave.addActionListener(e -> handleSave());
        btnCancel.addActionListener(e -> dispose());
    }

    private void handleSave() {
        String name = txtName.getText().trim();
        if (name.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Tên rạp không được để trống!");
            return;
        }

        if (theatre == null) theatre = new Theatre();
        theatre.setName(name);
        theatre.setCity(txtCity.getText().trim());
        theatre.setLocation(txtLocation.getText().trim());
        theatre.setStatus((String) cbStatus.getSelectedItem());
        theatre.setPreviewUrl(txtPreviewUrl.getText().trim());
        theatre.setInfo(txtInfo.getText().trim());

        List<Room> rooms = new ArrayList<>();
        for (int i = 0; i < modelRooms.getRowCount(); i++) {
            Room r = new Room();
            r.setId((int) modelRooms.getValueAt(i, 0));
            r.setName((String) modelRooms.getValueAt(i, 1));
            r.setType((String) modelRooms.getValueAt(i, 2));
            r.setCapacity(Integer.parseInt(modelRooms.getValueAt(i, 3).toString()));
            r.setStatus((String) modelRooms.getValueAt(i, 4));
            rooms.add(r);
        }

        if (facilityDAO.saveTheatreWithRooms(theatre, rooms, deletedRoomIds)) {
            isSucceeded = true;
            dispose();
        } else {
            JOptionPane.showMessageDialog(this, "Lỗi khi lưu dữ liệu hệ thống!");
        }
    }

    public boolean isSucceeded() { return isSucceeded; }
}
