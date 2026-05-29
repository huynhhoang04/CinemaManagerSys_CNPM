package View;

import javax.swing.*;
import java.awt.*;
import Model.User;
import Util.NavigationManager;
import Util.PillButton;
import Util.UIUtils;

public class AdminDashboard extends JFrame {
    private User currentUser;

    public AdminDashboard(User user) {
        this.currentUser = user;
        setTitle("Bảng điều khiển Quản trị - Cinema Monolith");
        setSize(1000, 600);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());
        UIUtils.applyBaseStyle(this);

        add(NavigationManager.getInstance().createHeaderPanel("Bảng điều khiển Quản trị", false), BorderLayout.NORTH);

        JPanel btnPanel = new JPanel(new GridLayout(2, 4, 15, 15));
        btnPanel.setBackground(UIUtils.COLOR_BACKGROUND);
        btnPanel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        JButton btnUser = new PillButton("QUẢN LÝ NHÂN VIÊN",
                new Color(21, 101, 192), Color.WHITE,
                new Color(255, 152, 0), new Color(128, 0, 200));
        JButton btnMovie = new PillButton("QUẢN LÝ PHIM",
                new Color(0, 137, 123), Color.WHITE,
                new Color(255, 152, 0), new Color(128, 0, 200));
        JButton btnCast = new PillButton("QUẢN LÝ DIỄN VIÊN/ĐẠO DIỄN",
                new Color(123, 31, 162), Color.WHITE,
                new Color(255, 152, 0), new Color(128, 0, 200));
        JButton btnFacility = new PillButton("QUẢN LÝ RẠP/PHÒNG",
                new Color(46, 125, 50), Color.WHITE,
                new Color(255, 152, 0), new Color(128, 0, 200));
        JButton btnSchedule = new PillButton("QUẢN LÝ LỊCH CHIẾU",
                new Color(230, 81, 0), Color.WHITE,
                new Color(255, 152, 0), new Color(128, 0, 200));
        JButton btnPos = new PillButton("BÁN VÉ (POS TEST)",
                new Color(198, 40, 40), Color.WHITE,
                new Color(255, 152, 0), new Color(128, 0, 200));
        JButton btnRefund = new PillButton("HOÀN VÉ",
                new Color(173, 20, 87), Color.WHITE,
                new Color(255, 152, 0), new Color(128, 0, 200));

        JButton[] buttons = {btnUser, btnMovie, btnCast, btnFacility, btnSchedule, btnPos, btnRefund};
        for (JButton btn : buttons) {
            btn.setFont(new Font("Arial", Font.BOLD, 15));
            btnPanel.add(btn);
        }

        add(btnPanel, BorderLayout.CENTER);

        btnUser.addActionListener(e -> NavigationManager.getInstance().navigateTo(this, new UserManagementFrame(currentUser)));
        btnMovie.addActionListener(e -> NavigationManager.getInstance().navigateTo(this, new MovieManagementFrame()));
        btnCast.addActionListener(e -> NavigationManager.getInstance().navigateTo(this, new CastManagementFrame()));
        btnFacility.addActionListener(e -> NavigationManager.getInstance().navigateTo(this, new FacilityManagementFrame()));
        btnSchedule.addActionListener(e -> NavigationManager.getInstance().navigateTo(this, new ScheduleManagementFrame()));
        
        btnPos.addActionListener(e -> NavigationManager.getInstance().navigateTo(this, new TheatreSelectionFrame(currentUser)));

        btnRefund.addActionListener(e -> NavigationManager.getInstance().navigateTo(this, new RefundFrame()));
    }
}
