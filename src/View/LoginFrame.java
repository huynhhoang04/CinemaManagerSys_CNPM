package View;

import DAO.UserDAO;
import Model.User;
import Util.NavigationManager;
import Util.PillButton;
import Util.UIUtils;

import javax.swing.*;
import java.awt.*;

public class LoginFrame extends JFrame {
    private JTextField txtUsername;
    private JPasswordField txtPassword;
    private JButton btnLogin;
    private UserDAO userDAO;

    public LoginFrame() {
        userDAO = new UserDAO();

        setTitle("Cinema Management System - Login");
        setSize(400, 300);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());
        UIUtils.applyBaseStyle(this);

        JPanel headerPanel = new JPanel();
        headerPanel.setBackground(Color.WHITE);
        JLabel lblTitle = new JLabel("Cinema Management");
        lblTitle.setForeground(new Color(0, 76, 153));
        lblTitle.setFont(UIUtils.FONT_TITLE);
        headerPanel.add(lblTitle);
        add(headerPanel, BorderLayout.NORTH);

        JPanel formPanel = new JPanel();
        formPanel.setLayout(new GridBagLayout());
        formPanel.setBackground(UIUtils.COLOR_BACKGROUND);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        gbc.gridx = 0; gbc.gridy = 0;
        formPanel.add(new JLabel("Tên đăng nhập:"), gbc);
        txtUsername = new JTextField(15);
        gbc.gridx = 1;
        formPanel.add(txtUsername, gbc);

        gbc.gridx = 0; gbc.gridy = 1;
        formPanel.add(new JLabel("Mật khẩu:"), gbc);
        txtPassword = new JPasswordField(15);
        gbc.gridx = 1;
        formPanel.add(txtPassword, gbc);

        btnLogin = new PillButton("ĐĂNG NHẬP");
        gbc.gridx = 0; gbc.gridy = 2; gbc.gridwidth = 2;
        formPanel.add(btnLogin, gbc);

        add(formPanel, BorderLayout.CENTER);

        btnLogin.addActionListener(e -> handleLogin());
    }

    private void handleLogin() {
        String username = txtUsername.getText().trim();
        String password = new String(txtPassword.getPassword()).trim();

        if (username.isEmpty() || password.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Vui lòng nhập đầy đủ!");
            return;
        }

        User user = userDAO.login(username, password);
        if (user != null) {
            JOptionPane.showMessageDialog(this, "Chào mừng " + user.getFullname());
            this.dispose();
            if (user.getRole().equals("Admin")) {
                NavigationManager.getInstance().start(new AdminDashboard(user));
            } else {
                NavigationManager.getInstance().start(new TheatreSelectionFrame(user));
            }
        } else {
            JOptionPane.showMessageDialog(this, "Sai tài khoản hoặc mật khẩu!");
        }
    }
}
