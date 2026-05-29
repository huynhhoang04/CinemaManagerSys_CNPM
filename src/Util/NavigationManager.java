package Util;

import View.LoginFrame;
import javax.swing.*;
import java.awt.*;
import java.util.Stack;

public class NavigationManager {
    private static NavigationManager instance;
    private Stack<JFrame> history;
    private JFrame currentFrame;

    private NavigationManager() {
        history = new Stack<>();
    }

    public static NavigationManager getInstance() {
        if (instance == null) {
            instance = new NavigationManager();
        }
        return instance;
    }

    public void navigateTo(JFrame current, JFrame next) {
        if (current != null) {
            history.push(current);
            current.setVisible(false);
        }
        this.currentFrame = next;
        next.setVisible(true);
    }

    public void goBack() {
        if (!history.isEmpty()) {
            if (currentFrame != null) {
                currentFrame.dispose();
            }
            currentFrame = history.pop();
            currentFrame.setVisible(true);
        }
    }

    public void logout() {
        if (currentFrame != null) {
            currentFrame.dispose();
        }
        while(!history.isEmpty()) {
            history.pop().dispose();
        }
        history.clear();
        currentFrame = new LoginFrame();
        currentFrame.setVisible(true);
    }
    
    public void start(JFrame initial) {
        this.currentFrame = initial;
        initial.setVisible(true);
    }
    
    public JPanel createHeaderPanel(String titleStr, boolean showBack) {
        JPanel headerPanel = new JPanel(new BorderLayout());
        headerPanel.setBackground(Color.WHITE);
        headerPanel.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createMatteBorder(0, 0, 1, 0, new Color(220, 220, 220)),
                BorderFactory.createEmptyBorder(10, 10, 10, 10)
        ));

        JLabel lblTitle = new JLabel(titleStr);
        lblTitle.setForeground(new Color(0, 76, 153));
        lblTitle.setFont(UIUtils.FONT_TITLE);
        headerPanel.add(lblTitle, BorderLayout.WEST);

        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        btnPanel.setOpaque(false);

        if (showBack) {
            JButton btnBack = new PillButton("Quay lại");
            btnBack.addActionListener(e -> goBack());
            btnPanel.add(btnBack);
        }

        JButton btnLogout = new PillButton("Đăng xuất");
        btnLogout.addActionListener(e -> logout());
        btnPanel.add(btnLogout);

        headerPanel.add(btnPanel, BorderLayout.EAST);

        return headerPanel;
    }
}