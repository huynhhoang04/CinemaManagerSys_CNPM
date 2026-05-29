package View;

import DAO.MovieDAO;
import Model.Movie;
import Model.Genre;
import Util.NavigationManager;
import Util.PillButton;
import Util.TableUtils;
import Util.UIUtils;

import javax.swing.*;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.imageio.ImageIO;

public class MovieManagementFrame extends JFrame {
    private JTable table;
    private DefaultTableModel tableModel;
    private MovieDAO movieDAO;
    private JButton btnAdd, btnEdit, btnDelete, btnRefresh;

    public MovieManagementFrame() {
        movieDAO = new MovieDAO();
        setTitle("Quản lý Phim - Cinema System");
        setSize(1000, 650);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        UIUtils.applyBaseStyle(this);

        JPanel topPanel = new JPanel(new BorderLayout());
        topPanel.add(NavigationManager.getInstance().createHeaderPanel("Quản lý Phim", true), BorderLayout.NORTH);

        // Toolbar
        JPanel toolbar = new JPanel(new FlowLayout(FlowLayout.LEFT));
        btnAdd = new PillButton("Thêm Phim mới");
        btnEdit = new PillButton("Sửa thông tin");
        btnDelete = new PillButton("Xóa Phim");
        btnRefresh = new PillButton("Làm mới");

        toolbar.add(btnAdd);
        toolbar.add(btnEdit);
        toolbar.add(btnDelete);
        toolbar.add(btnRefresh);
        
        toolbar.setBackground(UIUtils.COLOR_BACKGROUND);
        topPanel.add(toolbar, BorderLayout.SOUTH);

        add(topPanel, BorderLayout.NORTH);

        String[] columns = {"ID", "Poster", "Tiêu đề", "Thể loại", "Thời lượng", "Ngày chiếu", "Trạng thái"};
        tableModel = TableUtils.createModel(columns);
        table = TableUtils.createTable(tableModel);
        table.setRowHeight(80);
        table.getColumnModel().getColumn(1).setPreferredWidth(80);
        table.getColumnModel().getColumn(1).setMaxWidth(120);
        table.getColumnModel().getColumn(1).setMinWidth(60);
        table.getColumnModel().getColumn(1).setCellRenderer(new ImageRenderer());
        add(TableUtils.createScrollPane(table), BorderLayout.CENTER);

        // Events
        btnRefresh.addActionListener(e -> loadData());
        btnAdd.addActionListener(e -> {
            MovieFormDialog dialog = new MovieFormDialog(this, null);
            dialog.setVisible(true);
            if (dialog.isSucceeded()) loadData();
        });
        btnEdit.addActionListener(e -> {
            int row = table.getSelectedRow();
            if (row == -1) {
                JOptionPane.showMessageDialog(this, "Vui lòng chọn phim cần sửa!");
                return;
            }
            int id = (int) tableModel.getValueAt(row, 0);
            Movie selected = movieDAO.getAllMovies().stream().filter(m -> m.getId() == id).findFirst().orElse(null);
            MovieFormDialog dialog = new MovieFormDialog(this, selected);
            dialog.setVisible(true);
            if (dialog.isSucceeded()) loadData();
        });
        btnDelete.addActionListener(e -> {
            int row = table.getSelectedRow();
            if (row == -1) return;
            int id = (int) tableModel.getValueAt(row, 0);
            if (JOptionPane.showConfirmDialog(this, "Bạn có chắc chắn muốn xóa phim này?") == JOptionPane.YES_OPTION) {
                if (movieDAO.deleteMovie(id)) loadData();
                else JOptionPane.showMessageDialog(this, "Không thể xóa phim (có thể đang có suất chiếu).");
            }
        });

        loadData();
    }

    private void loadData() {
        tableModel.setRowCount(0);
        List<Movie> movies = movieDAO.getAllMovies();
        for (Movie m : movies) {
            String genres = m.getGenres().stream().map(Genre::getName).collect(Collectors.joining(", "));
            ImageIcon poster = getPosterIcon(m.getPosterUrl());
            tableModel.addRow(new Object[]{
                m.getId(), poster, m.getTitle(), genres, m.getDuration() + " phút", m.getReleaseDate(), m.getStatus()
            });
        }
    }

    private static final Map<String, ImageIcon> posterCache = new HashMap<>();
    private static final ImageIcon PLACEHOLDER = createPlaceholder();

    private static ImageIcon getPosterIcon(String src) {
        if (src == null || src.isEmpty()) return PLACEHOLDER;
        if (posterCache.containsKey(src)) return posterCache.get(src);

        try {
            BufferedImage img;
            if (src.startsWith("http://") || src.startsWith("https://")) {
                HttpURLConnection conn = (HttpURLConnection) new URL(src).openConnection();
                conn.setRequestProperty("User-Agent", "Mozilla/5.0");
                conn.setConnectTimeout(5000);
                conn.setReadTimeout(5000);
                InputStream is = conn.getInputStream();
                img = ImageIO.read(is);
                is.close();
                conn.disconnect();
            } else {
                img = ImageIO.read(new File(src));
            }
            if (img != null) {
                Image scaled = img.getScaledInstance(50, 70, Image.SCALE_SMOOTH);
                ImageIcon icon = new ImageIcon(scaled);
                posterCache.put(src, icon);
                return icon;
            }
        } catch (Exception ignored) {}

        posterCache.put(src, PLACEHOLDER);
        return PLACEHOLDER;
    }

    private static ImageIcon createPlaceholder() {
        BufferedImage img = new BufferedImage(50, 70, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = img.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g.setColor(new Color(240, 240, 240));
        g.fillRoundRect(0, 0, 49, 69, 6, 6);
        g.setColor(new Color(180, 180, 180));
        g.setFont(new Font("Arial", Font.PLAIN, 9));
        FontMetrics fm = g.getFontMetrics();
        String t = "N/A";
        g.drawString(t, (50 - fm.stringWidth(t)) / 2, 40);
        g.dispose();
        return new ImageIcon(img);
    }

    static class ImageRenderer extends DefaultTableCellRenderer {
        @Override
        public Component getTableCellRendererComponent(JTable table, Object value,
                boolean isSelected, boolean hasFocus, int row, int column) {
            if (value instanceof ImageIcon) {
                setIcon((ImageIcon) value);
                setText("");
            } else {
                setIcon(null);
                setText("N/A");
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
