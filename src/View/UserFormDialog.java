package View;

import DAO.UserDAO;
import Model.User;
import Util.PillButton;
import Util.UIUtils;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class UserFormDialog extends JDialog {
    private JTextField txtUsername, txtFullname, txtEmail;
    private JPasswordField txtPassword;
    private JComboBox<String> cbRole;
    private JButton btnSave, btnCancel;
    private UserDAO userDAO;
    private User user; // If null, it's 'Add' mode
    private User currentUser;
    private boolean isSucceeded = false;

    public UserFormDialog(Frame parent, User user, User currentUser) {
        super(parent, (user == null ? "Thêm nhân viên mới" : "Cập nhật nhân viên"), true);
        UIUtils.applyBaseStyle(this);
        this.user = user;
        this.currentUser = currentUser;
        this.userDAO = new UserDAO();

        setSize(400, 450);
        setLocationRelativeTo(parent);
        setLayout(new BorderLayout());

        JPanel formPanel = new JPanel(new GridBagLayout());
        formPanel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        // Username
        gbc.gridx = 0; gbc.gridy = 0;
        formPanel.add(new JLabel("Tên đăng nhập:"), gbc);
        txtUsername = new JTextField(20);
        if (user != null) {
            txtUsername.setText(user.getUsername());
            txtUsername.setEnabled(false);
        }
        gbc.gridx = 1;
        formPanel.add(txtUsername, gbc);

        // Password
        gbc.gridx = 0; gbc.gridy = 1;
        formPanel.add(new JLabel("Mật khẩu:"), gbc);
        txtPassword = new JPasswordField(20);
        if (user != null) {
            txtPassword.setEnabled(false);
            txtPassword.setText("********");
        }
        gbc.gridx = 1;
        formPanel.add(txtPassword, gbc);

        // Fullname
        gbc.gridx = 0; gbc.gridy = 2;
        formPanel.add(new JLabel("Họ tên:"), gbc);
        txtFullname = new JTextField(20);
        if (user != null) txtFullname.setText(user.getFullname());
        gbc.gridx = 1;
        formPanel.add(txtFullname, gbc);

        // Email
        gbc.gridx = 0; gbc.gridy = 3;
        formPanel.add(new JLabel("Email:"), gbc);
        txtEmail = new JTextField(20);
        if (user != null) txtEmail.setText(user.getEmail());
        gbc.gridx = 1;
        formPanel.add(txtEmail, gbc);

        // Role
        gbc.gridx = 0; gbc.gridy = 4;
        formPanel.add(new JLabel("Vai trò:"), gbc);
        cbRole = new JComboBox<>(new String[]{"Staff", "Admin"});
        if (user != null) {
            cbRole.setSelectedItem(user.getRole());
            
            // Logic: Không cho phép thay đổi Role của Admin (ngăn tự hạ cấp hoặc hạ cấp Admin khác)
            if ("Admin".equals(user.getRole())) {
                cbRole.setEnabled(false);
                cbRole.setToolTipText("Không thể hạ cấp quyền của Admin xuống Staff.");
            }
        }
        gbc.gridx = 1;
        formPanel.add(cbRole, gbc);

        add(formPanel, BorderLayout.CENTER);

        // Buttons
        JPanel btnPanel = new JPanel();
        btnSave = new PillButton("LƯU");
        btnCancel = new PillButton("HỦY");
        btnPanel.add(btnSave);
        btnPanel.add(btnCancel);
        add(btnPanel, BorderLayout.SOUTH);

        btnSave.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                handleSave();
            }
        });

        btnCancel.addActionListener(e -> dispose());
    }

    private void handleSave() {
        String username = txtUsername.getText().trim();
        String password = new String(txtPassword.getPassword()).trim();
        String fullname = txtFullname.getText().trim();
        String email = txtEmail.getText().trim();
        String role = (String) cbRole.getSelectedItem();

        if (fullname.isEmpty() || email.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Vui lòng nhập đầy đủ Họ tên và Email!");
            return;
        }

        if (user == null) { // Add mode
            if (username.isEmpty() || password.isEmpty()) {
                JOptionPane.showMessageDialog(this, "Vui lòng nhập Username và Password!");
                return;
            }
            
            // Hash mật khẩu bằng jBcrypt
            String hashedPassword = org.mindrot.jbcrypt.BCrypt.hashpw(password, org.mindrot.jbcrypt.BCrypt.gensalt());
            
            User newUser = new User(0, username, hashedPassword, fullname, email, role);
            if (userDAO.addUser(newUser)) {
                isSucceeded = true;
                dispose();
            } else {
                JOptionPane.showMessageDialog(this, "Lỗi khi thêm người dùng!");
            }
        } else { // Edit mode
            user.setFullname(fullname);
            user.setEmail(email);
            user.setRole(role);
            if (userDAO.updateUser(user)) {
                isSucceeded = true;
                dispose();
            } else {
                JOptionPane.showMessageDialog(this, "Lỗi khi cập nhật!");
            }
        }
    }

    public boolean isSucceeded() { return isSucceeded; }
}
