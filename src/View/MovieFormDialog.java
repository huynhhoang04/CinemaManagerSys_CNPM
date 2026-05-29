package View;

import DAO.MovieDAO;
import DAO.CastDAO;
import Model.Movie;
import Model.Genre;
import Model.Actor;
import Model.Director;
import Util.PillButton;
import Util.UIUtils;

import javax.swing.*;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class MovieFormDialog extends JDialog {
    private JTextField txtTitle, txtDuration, txtPosterUrl, txtTrailerUrl;
    private JTextArea txtDescription;
    private JSpinner spinnerDate;
    private JComboBox<String> cbStatus;
    private JPanel genrePanel, actorPanel, directorPanel;
    private List<JCheckBox> genreCheckBoxes, actorCheckBoxes, directorCheckBoxes;
    private MovieDAO movieDAO;
    private Movie movie;
    private boolean isSucceeded = false;

    public MovieFormDialog(Frame parent, Movie movie) {
        super(parent, (movie == null ? "Thêm phim mới" : "Cập nhật phim"), true);
        UIUtils.applyBaseStyle(this);
        this.movie = movie;
        this.movieDAO = new MovieDAO();
        this.genreCheckBoxes = new ArrayList<>();
        this.actorCheckBoxes = new ArrayList<>();
        this.directorCheckBoxes = new ArrayList<>();

        setSize(500, 650);
        setLocationRelativeTo(parent);
        setLayout(new BorderLayout());

        JPanel formPanel = new JPanel(new GridBagLayout());
        formPanel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        // Title
        gbc.gridx = 0; gbc.gridy = 0;
        formPanel.add(new JLabel("Tiêu đề:"), gbc);
        txtTitle = new JTextField(25);
        if (movie != null) txtTitle.setText(movie.getTitle());
        gbc.gridx = 1;
        formPanel.add(txtTitle, gbc);

        // Duration
        gbc.gridx = 0; gbc.gridy = 1;
        formPanel.add(new JLabel("Thời lượng (phút):"), gbc);
        txtDuration = new JTextField();
        if (movie != null) txtDuration.setText(String.valueOf(movie.getDuration()));
        gbc.gridx = 1;
        formPanel.add(txtDuration, gbc);

        // Release Date
        gbc.gridx = 0; gbc.gridy = 2;
        formPanel.add(new JLabel("Ngày phát hành:"), gbc);
        spinnerDate = new JSpinner(new SpinnerDateModel());
        JSpinner.DateEditor dateEditor = new JSpinner.DateEditor(spinnerDate, "yyyy-MM-dd");
        spinnerDate.setEditor(dateEditor);
        if (movie != null) spinnerDate.setValue(movie.getReleaseDate());
        gbc.gridx = 1;
        formPanel.add(spinnerDate, gbc);

        // Status
        gbc.gridx = 0; gbc.gridy = 3;
        formPanel.add(new JLabel("Trạng thái:"), gbc);
        cbStatus = new JComboBox<>(new String[]{"Active", "Inactive"});
        if (movie != null) cbStatus.setSelectedItem(movie.getStatus());
        gbc.gridx = 1;
        formPanel.add(cbStatus, gbc);

        // Poster URL
        gbc.gridx = 0; gbc.gridy = 4;
        formPanel.add(new JLabel("Poster URL:"), gbc);
        txtPosterUrl = new JTextField();
        if (movie != null) txtPosterUrl.setText(movie.getPosterUrl());
        gbc.gridx = 1;
        formPanel.add(txtPosterUrl, gbc);

        // Trailer URL
        gbc.gridx = 0; gbc.gridy = 5;
        formPanel.add(new JLabel("Trailer URL:"), gbc);
        txtTrailerUrl = new JTextField();
        if (movie != null) txtTrailerUrl.setText(movie.getTrailerUrl());
        gbc.gridx = 1;
        formPanel.add(txtTrailerUrl, gbc);

        // Description
        gbc.gridx = 0; gbc.gridy = 6;
        formPanel.add(new JLabel("Mô tả:"), gbc);
        txtDescription = new JTextArea(4, 25);
        txtDescription.setLineWrap(true);
        if (movie != null) txtDescription.setText(movie.getDescription());
        gbc.gridx = 1;
        formPanel.add(new JScrollPane(txtDescription), gbc);

        // Genres
        gbc.gridx = 0; gbc.gridy = 7;
        formPanel.add(new JLabel("Thể loại:"), gbc);
        genrePanel = new JPanel(new GridLayout(0, 2));
        JScrollPane genreScroll = new JScrollPane(genrePanel);
        genreScroll.setPreferredSize(new Dimension(300, 100));
        gbc.gridx = 1;
        formPanel.add(genreScroll, gbc);

        // Actors
        gbc.gridx = 0; gbc.gridy = 8;
        formPanel.add(new JLabel("Diễn viên:"), gbc);
        actorPanel = new JPanel(new GridLayout(0, 2));
        JScrollPane actorScroll = new JScrollPane(actorPanel);
        actorScroll.setPreferredSize(new Dimension(300, 100));
        gbc.gridx = 1;
        formPanel.add(actorScroll, gbc);

        // Directors
        gbc.gridx = 0; gbc.gridy = 9;
        formPanel.add(new JLabel("Đạo diễn:"), gbc);
        directorPanel = new JPanel(new GridLayout(0, 2));
        JScrollPane directorScroll = new JScrollPane(directorPanel);
        directorScroll.setPreferredSize(new Dimension(300, 100));
        gbc.gridx = 1;
        formPanel.add(directorScroll, gbc);

        loadCollections();

        add(new JScrollPane(formPanel), BorderLayout.CENTER);

        // Buttons
        JPanel btnPanel = new JPanel();
        JButton btnSave = new PillButton("LƯU PHIM");
        JButton btnCancel = new PillButton("HỦY");
        btnPanel.add(btnSave);
        btnPanel.add(btnCancel);
        add(btnPanel, BorderLayout.SOUTH);

        btnSave.addActionListener(e -> handleSave());
        btnCancel.addActionListener(e -> dispose());
    }

    private void loadCollections() {
        List<Genre> allGenres = movieDAO.getAllGenres();
        List<Integer> selectedIds = (movie != null && movie.getGenres() != null) 
                                     ? movie.getGenres().stream().map(Genre::getId).collect(Collectors.toList())
                                     : new ArrayList<>();
        
        for (Genre g : allGenres) {
            JCheckBox cb = new JCheckBox(g.getName());
            cb.putClientProperty("id", g.getId());
            if (selectedIds.contains(g.getId())) cb.setSelected(true);
            genreCheckBoxes.add(cb);
            genrePanel.add(cb);
        }

        CastDAO castDAO = new CastDAO();
        
        List<Actor> allActors = castDAO.getAllActors();
        List<Integer> selectedActorIds = (movie != null && movie.getActors() != null) 
                                     ? movie.getActors().stream().map(Actor::getId).collect(Collectors.toList())
                                     : new ArrayList<>();
        for (Actor a : allActors) {
            JCheckBox cb = new JCheckBox(a.getName());
            cb.putClientProperty("id", a.getId());
            if (selectedActorIds.contains(a.getId())) cb.setSelected(true);
            actorCheckBoxes.add(cb);
            actorPanel.add(cb);
        }
        
        List<Director> allDirectors = castDAO.getAllDirectors();
        List<Integer> selectedDirectorIds = (movie != null && movie.getDirectors() != null) 
                                     ? movie.getDirectors().stream().map(Director::getId).collect(Collectors.toList())
                                     : new ArrayList<>();
        for (Director d : allDirectors) {
            JCheckBox cb = new JCheckBox(d.getName());
            cb.putClientProperty("id", d.getId());
            if (selectedDirectorIds.contains(d.getId())) cb.setSelected(true);
            directorCheckBoxes.add(cb);
            directorPanel.add(cb);
        }
    }

    private void handleSave() {
        try {
            String title = txtTitle.getText().trim();
            int duration = Integer.parseInt(txtDuration.getText().trim());
            java.util.Date releaseDate = (java.util.Date) spinnerDate.getValue();
            String status = (String) cbStatus.getSelectedItem();
            String poster = txtPosterUrl.getText().trim();
            String trailer = txtTrailerUrl.getText().trim();
            String desc = txtDescription.getText().trim();
            
            List<Integer> genreIds = new ArrayList<>();
            for (JCheckBox cb : genreCheckBoxes) {
                if (cb.isSelected()) genreIds.add((Integer) cb.getClientProperty("id"));
            }

            List<Integer> actorIds = new ArrayList<>();
            for (JCheckBox cb : actorCheckBoxes) {
                if (cb.isSelected()) actorIds.add((Integer) cb.getClientProperty("id"));
            }

            List<Integer> directorIds = new ArrayList<>();
            for (JCheckBox cb : directorCheckBoxes) {
                if (cb.isSelected()) directorIds.add((Integer) cb.getClientProperty("id"));
            }

            if (title.isEmpty()) {
                JOptionPane.showMessageDialog(this, "Tiêu đề không được để trống!");
                return;
            }

            if (movie == null) movie = new Movie();
            movie.setTitle(title);
            movie.setDuration(duration);
            movie.setReleaseDate(releaseDate);
            movie.setStatus(status);
            movie.setPosterUrl(poster);
            movie.setTrailerUrl(trailer);
            movie.setDescription(desc);

            boolean res;
            if (movie.getId() == 0) res = movieDAO.addMovie(movie, genreIds, actorIds, directorIds);
            else res = movieDAO.updateMovie(movie, genreIds, actorIds, directorIds);

            if (res) {
                isSucceeded = true;
                dispose();
            } else {
                JOptionPane.showMessageDialog(this, "Lỗi thao tác cơ sở dữ liệu!");
            }
        } catch (NumberFormatException e) {
            JOptionPane.showMessageDialog(this, "Thời lượng phải là số nguyên!");
        }
    }

    public boolean isSucceeded() { return isSucceeded; }
}
