package View;

import DAO.FacilityDAO;
import Model.Theatre;
import Util.NavigationManager;
import Util.PillButton;
import Util.TableUtils;
import Util.UIUtils;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

public class FacilityManagementFrame extends JFrame {
    private JTable table;
    private DefaultTableModel model;
    private FacilityDAO facilityDAO;

    public FacilityManagementFrame() {
        facilityDAO = new FacilityDAO();
        setTitle("Quản lý Cơ sở vật chất - Rạp & Phòng");
        setSize(1000, 600);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        UIUtils.applyBaseStyle(this);

        JPanel topPanel = new JPanel(new BorderLayout());
        topPanel.add(NavigationManager.getInstance().createHeaderPanel("Quản lý Cơ sở vật chất", true), BorderLayout.NORTH);

        JPanel toolbar = new JPanel(new FlowLayout(FlowLayout.LEFT));
        JButton btnAdd = new PillButton("Thêm Rạp mới");
        JButton btnEdit = new PillButton("Sửa / Quản lý Phòng");
        JButton btnDelete = new PillButton("Xóa Rạp");
        JButton btnRefresh = new PillButton("Làm mới");

        toolbar.add(btnAdd);
        toolbar.add(btnEdit);
        toolbar.add(btnDelete);
        toolbar.add(btnRefresh);
        toolbar.setBackground(UIUtils.COLOR_BACKGROUND);
        topPanel.add(toolbar, BorderLayout.SOUTH);
        
        add(topPanel, BorderLayout.NORTH);

        String[] cols = {"ID", "Tên Rạp", "Thành phố", "Địa chỉ", "Trạng thái"};
        model = TableUtils.createModel(cols);
        table = TableUtils.createTable(model);
        add(TableUtils.createScrollPane(table), BorderLayout.CENTER);

        btnAdd.addActionListener(e -> {
            TheatreFormDialog dialog = new TheatreFormDialog(this, null);
            dialog.setVisible(true);
            if (dialog.isSucceeded()) loadData();
        });

        btnEdit.addActionListener(e -> {
            int row = table.getSelectedRow();
            if (row == -1) return;
            int id = (int) model.getValueAt(row, 0);
            Theatre selected = facilityDAO.getAllTheatres().stream().filter(t -> t.getId() == id).findFirst().orElse(null);
            TheatreFormDialog dialog = new TheatreFormDialog(this, selected);
            dialog.setVisible(true);
            if (dialog.isSucceeded()) loadData();
        });

        btnDelete.addActionListener(e -> {
            int row = table.getSelectedRow();
            if (row == -1) return;
            int id = (int) model.getValueAt(row, 0);
            if (JOptionPane.showConfirmDialog(this, "Cảnh báo: Xóa Rạp sẽ xóa toàn bộ Phòng chiếu bên trong. Xác nhận?") == JOptionPane.YES_OPTION) {
                if (facilityDAO.deleteTheatre(id)) loadData();
                else JOptionPane.showMessageDialog(this, "Không thể xóa rạp (có thể đang có lịch chiếu).");
            }
        });

        btnRefresh.addActionListener(e -> loadData());
        loadData();
    }

    private void loadData() {
        model.setRowCount(0);
        List<Theatre> list = facilityDAO.getAllTheatres();
        for (Theatre t : list) {
            model.addRow(new Object[]{t.getId(), t.getName(), t.getCity(), t.getLocation(), t.getStatus()});
        }
    }
}
