package Util;

import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

public class UIUtils {
    public static final Color COLOR_PRIMARY = new Color(33, 150, 243); // Xanh nước biển
    public static final Color COLOR_PRIMARY_HOVER = new Color(30, 136, 229);
    public static final Color COLOR_BACKGROUND = Color.WHITE;
    public static final Color COLOR_TEXT = Color.BLACK;
    public static final Font FONT_TITLE = new Font("Arial", Font.BOLD, 20);
    public static final Font FONT_NORMAL = new Font("Arial", Font.PLAIN, 14);

    public static void initGlobalStyles() {
        UIManager.put("Label.foreground", COLOR_TEXT);
        UIManager.put("Panel.background", COLOR_BACKGROUND);
        UIManager.put("CheckBox.background", COLOR_BACKGROUND);
        UIManager.put("CheckBox.foreground", COLOR_TEXT);
        UIManager.put("RadioButton.background", COLOR_BACKGROUND);
        UIManager.put("RadioButton.foreground", COLOR_TEXT);
        UIManager.put("OptionPane.background", COLOR_BACKGROUND);
        UIManager.put("OptionPane.messageForeground", COLOR_TEXT);
    }

    public static void styleButton(JButton btn) {
        btn.setBackground(COLOR_PRIMARY);
        btn.setForeground(Color.WHITE);
        btn.setFont(new Font("Arial", Font.BOLD, 14));
        btn.setFocusPainted(false);
        // Force background color rendering in System L&F (Windows)
        btn.setContentAreaFilled(false);
        btn.setOpaque(true);
        btn.setBorder(BorderFactory.createEmptyBorder(8, 15, 8, 15));
        
        // Add hover effect since we removed default content area filling
        btn.addMouseListener(new MouseAdapter() {
            public void mouseEntered(MouseEvent evt) {
                btn.setBackground(COLOR_PRIMARY_HOVER);
            }
            public void mouseExited(MouseEvent evt) {
                btn.setBackground(COLOR_PRIMARY);
            }
        });
    }

    public static void applyBaseStyle(Window window) {
        if (window instanceof JFrame) {
            ((JFrame) window).getContentPane().setBackground(COLOR_BACKGROUND);
        } else if (window instanceof JDialog) {
            ((JDialog) window).getContentPane().setBackground(COLOR_BACKGROUND);
        }
    }
}