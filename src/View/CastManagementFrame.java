package View;

import DAO.CastDAO;
import Model.Actor;
import Model.Director;
import Util.NavigationManager;
import Util.PillButton;
import Util.TableUtils;
import Util.UIUtils;

import javax.swing.*;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.geom.Ellipse2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import javax.imageio.ImageIO;

public class CastManagementFrame extends JFrame {
    private JTable tableActor, tableDirector;
    private DefaultTableModel modelActor, modelDirector;
    private CastDAO castDAO;
    private JTabbedPane tabbedPane;

    public CastManagementFrame() {
        castDAO = new CastDAO();
        setTitle("Quản lý Diễn viên & Đạo diễn");
        setSize(900, 600);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        UIUtils.applyBaseStyle(this);

        JPanel topPanel = new JPanel(new BorderLayout());
        topPanel.add(NavigationManager.getInstance().createHeaderPanel("Quản lý Diễn viên & Đạo diễn", true), BorderLayout.NORTH);
        add(topPanel, BorderLayout.NORTH);

        tabbedPane = new JTabbedPane();

        JPanel actorPanel = createTabPanel("Actor");
        tabbedPane.addTab("Diễn viên", actorPanel);

        JPanel directorPanel = createTabPanel("Director");
        tabbedPane.addTab("Đạo diễn", directorPanel);

        add(tabbedPane, BorderLayout.CENTER);
        loadData();
    }

    private JPanel createTabPanel(String type) {
        JPanel panel = new JPanel(new BorderLayout());
        
        JPanel toolbar = new JPanel(new FlowLayout(FlowLayout.LEFT));
        JButton btnAdd = new PillButton("Thêm " + type);
        JButton btnEdit = new PillButton("Sửa");
        JButton btnDelete = new PillButton("Xóa");
        JButton btnRefresh = new PillButton("Làm mới");

        toolbar.add(btnAdd);
        toolbar.add(btnEdit);
        toolbar.add(btnDelete);
        toolbar.add(btnRefresh);
        toolbar.setBackground(UIUtils.COLOR_BACKGROUND);
        panel.add(toolbar, BorderLayout.NORTH);

        String[] cols = {"ID", "Avatar", "Họ tên", "Tiểu sử"};
        DefaultTableModel model = TableUtils.createModel(cols);
        JTable table = TableUtils.createTable(model);
        table.setRowHeight(70);
        table.getColumnModel().getColumn(1).setPreferredWidth(70);
        table.getColumnModel().getColumn(1).setMaxWidth(90);
        table.getColumnModel().getColumn(1).setMinWidth(50);
        table.getColumnModel().getColumn(1).setCellRenderer(new CircleRenderer());
        panel.add(TableUtils.createScrollPane(table), BorderLayout.CENTER);

        if (type.equals("Actor")) {
            this.modelActor = model;
            this.tableActor = table;
        } else {
            this.modelDirector = model;
            this.tableDirector = table;
        }

        btnAdd.addActionListener(e -> {
            CastFormDialog dialog = new CastFormDialog(this, null, type);
            dialog.setVisible(true);
            if (dialog.isSucceeded()) loadData();
        });

        btnEdit.addActionListener(e -> {
            int row = table.getSelectedRow();
            if (row == -1) return;
            int id = (int) model.getValueAt(row, 0);
            Object entity = type.equals("Actor") 
                ? castDAO.getAllActors().stream().filter(a -> a.getId() == id).findFirst().orElse(null)
                : castDAO.getAllDirectors().stream().filter(d -> d.getId() == id).findFirst().orElse(null);
            
            CastFormDialog dialog = new CastFormDialog(this, entity, type);
            dialog.setVisible(true);
            if (dialog.isSucceeded()) loadData();
        });

        btnDelete.addActionListener(e -> {
            int row = table.getSelectedRow();
            if (row == -1) return;
            int id = (int) model.getValueAt(row, 0);
            if (JOptionPane.showConfirmDialog(this, "Xác nhận xóa?") == JOptionPane.YES_OPTION) {
                boolean res = type.equals("Actor") ? castDAO.deleteActor(id) : castDAO.deleteDirector(id);
                if (res) loadData();
            }
        });

        btnRefresh.addActionListener(e -> loadData());

        return panel;
    }

    private void loadData() {
        modelActor.setRowCount(0);
        for (Actor a : castDAO.getAllActors()) {
            ImageIcon avatar = getCircleAvatar(a.getAvatar());
            modelActor.addRow(new Object[]{a.getId(), avatar, a.getName(), a.getBio()});
        }

        modelDirector.setRowCount(0);
        for (Director d : castDAO.getAllDirectors()) {
            ImageIcon avatar = getCircleAvatar(d.getAvatar());
            modelDirector.addRow(new Object[]{d.getId(), avatar, d.getName(), d.getBio()});
        }
    }

    private static final Map<String, ImageIcon> avatarCache = new HashMap<>();
    private static final int AVATAR_SIZE = 50;

    private static ImageIcon getCircleAvatar(String src) {
        if (src == null || src.isEmpty()) return createCirclePlaceholder();
        if (avatarCache.containsKey(src)) return avatarCache.get(src);

        try {
            BufferedImage raw;
            if (src.startsWith("http://") || src.startsWith("https://")) {
                HttpURLConnection conn = (HttpURLConnection) new URL(src).openConnection();
                conn.setRequestProperty("User-Agent", "Mozilla/5.0");
                conn.setConnectTimeout(5000);
                conn.setReadTimeout(5000);
                InputStream is = conn.getInputStream();
                raw = ImageIO.read(is);
                is.close();
                conn.disconnect();
            } else {
                raw = ImageIO.read(new File(src));
            }
            if (raw != null) {
                ImageIcon icon = new ImageIcon(makeCircle(raw));
                avatarCache.put(src, icon);
                return icon;
            }
        } catch (Exception ignored) {}

        ImageIcon placeholder = createCirclePlaceholder();
        avatarCache.put(src, placeholder);
        return placeholder;
    }

    private static Image makeCircle(BufferedImage src) {
        int size = AVATAR_SIZE;
        BufferedImage circle = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2 = circle.createGraphics();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setClip(new Ellipse2D.Float(0, 0, size, size));
        g2.drawImage(src, 0, 0, size, size, null);
        g2.setClip(null);
        g2.setColor(new Color(200, 200, 200));
        g2.setStroke(new BasicStroke(2f));
        g2.drawOval(1, 1, size - 2, size - 2);
        g2.dispose();
        return circle;
    }

    private static ImageIcon createCirclePlaceholder() {
        BufferedImage img = new BufferedImage(AVATAR_SIZE, AVATAR_SIZE, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2 = img.createGraphics();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setColor(new Color(230, 230, 230));
        g2.fill(new Ellipse2D.Float(0, 0, AVATAR_SIZE, AVATAR_SIZE));
        g2.setColor(new Color(180, 180, 180));
        g2.setFont(new Font("Arial", Font.BOLD, 18));
        FontMetrics fm = g2.getFontMetrics();
        String t = "?";
        g2.drawString(t, (AVATAR_SIZE - fm.stringWidth(t)) / 2, (AVATAR_SIZE + fm.getAscent() - fm.getDescent()) / 2);
        g2.dispose();
        return new ImageIcon(img);
    }

    static class CircleRenderer extends DefaultTableCellRenderer {
        @Override
        public Component getTableCellRendererComponent(JTable table, Object value,
                boolean isSelected, boolean hasFocus, int row, int column) {
            if (value instanceof ImageIcon) {
                setIcon((ImageIcon) value);
                setText("");
            } else {
                setIcon(null);
                setText("?");
            }
            setHorizontalAlignment(SwingConstants.CENTER);
            if (isSelected) {
                setBackground(table.getSelectionBackground());
            } else {
                setBackground(table.getBackground());
            }
            return this;
        }
    }
}
