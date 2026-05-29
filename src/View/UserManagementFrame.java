package View;

import DAO.UserDAO;
import Model.User;
import Util.NavigationManager;
import Util.PillButton;
import Util.TableUtils;
import Util.UIUtils;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

public class UserManagementFrame extends JFrame {
    private JTable table;
    private DefaultTableModel tableModel;
    private UserDAO userDAO;
    private JButton btnAdd, btnEdit, btnDelete, btnPromote, btnRefresh;
    private User currentUser;

    public UserManagementFrame(User currentUser) {
        this.currentUser = currentUser;
        userDAO = new UserDAO();
        setTitle("Hệ thống Quản lý Cinema - Quản lý nhân viên");
        setSize(900, 600);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());
        UIUtils.applyBaseStyle(this);

        JPanel topPanel = new JPanel(new BorderLayout());
        topPanel.add(NavigationManager.getInstance().createHeaderPanel("Quản lý nhân viên", true), BorderLayout.NORTH);

        // Toolbar
        JPanel toolbar = new JPanel(new FlowLayout(FlowLayout.LEFT));
        toolbar.setBackground(UIUtils.COLOR_BACKGROUND);
        btnAdd = new PillButton("Thêm mới");
        btnEdit = new PillButton("Sửa");
        btnDelete = new PillButton("Xóa");
        btnPromote = new PillButton("Thăng cấp Admin");
        btnRefresh = new PillButton("Làm mới");
        
        JButton[] tools = {btnAdd, btnEdit, btnDelete, btnPromote, btnRefresh};
        for (JButton btn : tools) {
            toolbar.add(btn);
        }
        
        topPanel.add(toolbar, BorderLayout.SOUTH);
        add(topPanel, BorderLayout.NORTH);

        String[] columns = {"ID", "Username", "Họ tên", "Email", "Vai trò"};
        tableModel = TableUtils.createModel(columns);
        table = TableUtils.createTable(tableModel);
        add(TableUtils.createScrollPane(table), BorderLayout.CENTER);

        // Events
        btnRefresh.addActionListener(e -> loadData());
        btnAdd.addActionListener(e -> {
            UserFormDialog dialog = new UserFormDialog(this, null, currentUser);
            dialog.setVisible(true);
            if (dialog.isSucceeded()) loadData();
        });
        btnEdit.addActionListener(e -> {
            int row = table.getSelectedRow();
            if (row == -1) {
                JOptionPane.showMessageDialog(this, "Vui lòng chọn một người dùng!");
                return;
            }
            int id = (int) tableModel.getValueAt(row, 0);
            List<User> users = userDAO.getAllUsers();
            User selectedUser = users.stream().filter(u -> u.getId() == id).findFirst().orElse(null);
            
            UserFormDialog dialog = new UserFormDialog(this, selectedUser, currentUser);
            dialog.setVisible(true);
            if (dialog.isSucceeded()) loadData();
        });
        btnDelete.addActionListener(e -> {
            int row = table.getSelectedRow();
            if (row == -1) {
                JOptionPane.showMessageDialog(this, "Vui lòng chọn một người dùng để xóa!");
                return;
            }
            int id = (int) tableModel.getValueAt(row, 0);
            String role = (String) tableModel.getValueAt(row, 4);

            // Kiểm soát Logic Xóa
            if (id == currentUser.getId()) {
                JOptionPane.showMessageDialog(this, "Lỗi: Không thể xóa chính bản thân mình!", "Lỗi phân quyền", JOptionPane.ERROR_MESSAGE);
                return;
            }
            if ("Admin".equals(role)) {
                JOptionPane.showMessageDialog(this, "Lỗi: Admin không thể xóa một Admin khác!", "Lỗi phân quyền", JOptionPane.ERROR_MESSAGE);
                return;
            }

            if (JOptionPane.showConfirmDialog(this, "Bạn có chắc muốn xóa nhân viên này?") == JOptionPane.YES_OPTION) {
                if (userDAO.deleteUser(id)) loadData();
            }
        });
        btnPromote.addActionListener(e -> {
            int row = table.getSelectedRow();
            if (row == -1) {
                JOptionPane.showMessageDialog(this, "Vui lòng chọn một nhân viên (Staff) để thăng cấp!");
                return;
            }
            int id = (int) tableModel.getValueAt(row, 0);
            String role = (String) tableModel.getValueAt(row, 4);

            // Kiểm soát Logic Thăng cấp
            if ("Admin".equals(role)) {
                JOptionPane.showMessageDialog(this, "Người dùng này hiện đã là Admin!", "Thông báo", JOptionPane.INFORMATION_MESSAGE);
                return;
            }

            if (JOptionPane.showConfirmDialog(this, "Xác nhận thăng cấp nhân viên này lên Admin?") == JOptionPane.YES_OPTION) {
                if (userDAO.promoteToAdmin(id)) loadData();
            }
        });

        loadData();
    }

    private void loadData() {
        tableModel.setRowCount(0);
        List<User> users = userDAO.getAllUsers();
        for (User u : users) {
            tableModel.addRow(new Object[]{u.getId(), u.getUsername(), u.getFullname(), u.getEmail(), u.getRole()});
        }
    }
}
