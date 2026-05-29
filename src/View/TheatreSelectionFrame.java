package View;
import DAO.FacilityDAO;
import Model.Theatre;
import Model.User;
import Util.NavigationManager;
import Util.PillButton;
import Util.UIUtils;
import javax.swing.*;
import java.awt.*;
import java.util.List;

public class TheatreSelectionFrame extends JFrame {
    private FacilityDAO facilityDAO;
    private User currentUser;

    public TheatreSelectionFrame(User user) {
        this.currentUser = user;
        this.facilityDAO = new FacilityDAO();
        setTitle("Chọn Rạp Làm Việc - Xin chào " + user.getFullname());
        setSize(600, 400);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        UIUtils.applyBaseStyle(this);

        JPanel topPanel = new JPanel(new BorderLayout());
        topPanel.add(NavigationManager.getInstance().createHeaderPanel("Chọn Rạp Làm Việc", true), BorderLayout.NORTH);

        JPanel header = new JPanel();
        header.add(new JLabel("VUI LÒNG CHỌN RẠP ĐỂ BẮT ĐẦU CA LÀM VIỆC"));
        header.setBackground(UIUtils.COLOR_BACKGROUND);
        topPanel.add(header, BorderLayout.SOUTH);
        
        add(topPanel, BorderLayout.NORTH);

        JPanel panel = new JPanel(new GridLayout(0, 2, 10, 10));
        panel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));
        List<Theatre> theatres = facilityDAO.getAllTheatres();
        for (Theatre t : theatres) {
            JButton btn = new PillButton(t.getName() + " - " + t.getCity());
            btn.setFont(new Font("Arial", Font.BOLD, 14));
            btn.addActionListener(e -> {
                NavigationManager.getInstance().navigateTo(this, new POSFrame(currentUser, t));
            });
            panel.add(btn);
        }
        add(new JScrollPane(panel), BorderLayout.CENTER);
    }
}
