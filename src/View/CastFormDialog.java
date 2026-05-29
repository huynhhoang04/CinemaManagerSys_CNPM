package View;

import DAO.CastDAO;
import Model.Actor;
import Model.Director;
import Util.PillButton;
import Util.UIUtils;

import javax.swing.*;
import java.awt.*;

public class CastFormDialog extends JDialog {
    private JTextField txtName, txtAvatar;
    private JTextArea txtBio;
    private JComboBox<String> cbType;
    private JButton btnSave, btnCancel;
    private CastDAO castDAO;
    private Object entity; // Can be Actor or Director
    private boolean isSucceeded = false;

    public CastFormDialog(Frame parent, Object entity, String type) {
        super(parent, (entity == null ? "Thêm " + type : "Cập nhật " + type), true);
        UIUtils.applyBaseStyle(this);
        this.entity = entity;
        this.castDAO = new CastDAO();

        setSize(400, 450);
        setLocationRelativeTo(parent);
        setLayout(new BorderLayout());

        JPanel formPanel = new JPanel(new GridBagLayout());
        formPanel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        // Type
        gbc.gridx = 0; gbc.gridy = 0;
        formPanel.add(new JLabel("Loại:"), gbc);
        cbType = new JComboBox<>(new String[]{"Actor", "Director"});
        cbType.setSelectedItem(type);
        cbType.setEnabled(false);
        gbc.gridx = 1;
        formPanel.add(cbType, gbc);

        // Name
        gbc.gridx = 0; gbc.gridy = 1;
        formPanel.add(new JLabel("Họ tên:"), gbc);
        txtName = new JTextField(20);
        gbc.gridx = 1;
        formPanel.add(txtName, gbc);

        // Avatar
        gbc.gridx = 0; gbc.gridy = 2;
        formPanel.add(new JLabel("Avatar URL:"), gbc);
        txtAvatar = new JTextField(20);
        gbc.gridx = 1;
        formPanel.add(txtAvatar, gbc);

        // Bio
        gbc.gridx = 0; gbc.gridy = 3;
        formPanel.add(new JLabel("Tiểu sử:"), gbc);
        txtBio = new JTextArea(5, 20);
        txtBio.setLineWrap(true);
        gbc.gridx = 1;
        formPanel.add(new JScrollPane(txtBio), gbc);

        if (entity != null) {
            if (entity instanceof Actor) {
                Actor a = (Actor) entity;
                txtName.setText(a.getName());
                txtAvatar.setText(a.getAvatar());
                txtBio.setText(a.getBio());
            } else {
                Director d = (Director) entity;
                txtName.setText(d.getName());
                txtAvatar.setText(d.getAvatar());
                txtBio.setText(d.getBio());
            }
        }

        add(formPanel, BorderLayout.CENTER);

        JPanel btnPanel = new JPanel();
        btnSave = new PillButton("LƯU DỮ LIỆU");
        btnCancel = new PillButton("HỦY");
        btnPanel.add(btnSave);
        btnPanel.add(btnCancel);
        add(btnPanel, BorderLayout.SOUTH);

        btnSave.addActionListener(e -> handleSave());
        btnCancel.addActionListener(e -> dispose());
    }

    private void handleSave() {
        String name = txtName.getText().trim();
        String avatar = txtAvatar.getText().trim();
        String bio = txtBio.getText().trim();
        String type = (String) cbType.getSelectedItem();

        if (name.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Họ tên không được để trống!");
            return;
        }

        boolean res = false;
        if (type.equals("Actor")) {
            Actor a = (entity == null) ? new Actor() : (Actor) entity;
            a.setName(name);
            a.setAvatar(avatar);
            a.setBio(bio);
            if (a.getId() == 0) res = castDAO.addActor(a);
            else res = castDAO.updateActor(a);
        } else {
            Director d = (entity == null) ? new Director() : (Director) entity;
            d.setName(name);
            d.setAvatar(avatar);
            d.setBio(bio);
            if (d.getId() == 0) res = castDAO.addDirector(d);
            else res = castDAO.updateDirector(d);
        }

        if (res) {
            isSucceeded = true;
            dispose();
        } else {
            JOptionPane.showMessageDialog(this, "Lỗi khi lưu dữ liệu!");
        }
    }

    public boolean isSucceeded() { return isSucceeded; }
}
