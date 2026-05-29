package View;

import DAO.BookingDAO;
import DAO.ScheduleDAO;
import Model.Ticket;
import Model.Showtime;
import Util.NavigationManager;
import Util.PillButton;
import Util.UIUtils;

import javax.swing.*;
import java.awt.*;

public class RefundFrame extends JFrame {
    private JTextField txtTicketId;
    private JTextArea txtInfo;
    private JButton btnFind, btnRefund;
    private BookingDAO bookingDAO;
    private ScheduleDAO scheduleDAO;
    private Ticket currentTicket;
    private double currentRefundAmount = 0;
    
    public RefundFrame() {
        bookingDAO = new BookingDAO();
        scheduleDAO = new ScheduleDAO();
        setTitle("Hệ thống Hoàn Vé");
        setSize(450, 450);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        UIUtils.applyBaseStyle(this);

        JPanel topPanel = new JPanel(new BorderLayout());
        topPanel.add(NavigationManager.getInstance().createHeaderPanel("Hệ thống Hoàn Vé", true), BorderLayout.NORTH);

        JPanel top = new JPanel();
        top.add(new JLabel("Mã Vé (Ticket ID):"));
        txtTicketId = new JTextField(10);
        btnFind = new PillButton("TÌM");
        top.add(txtTicketId);
        top.add(btnFind);
        top.setBackground(UIUtils.COLOR_BACKGROUND);
        
        topPanel.add(top, BorderLayout.SOUTH);
        add(topPanel, BorderLayout.NORTH);

        txtInfo = new JTextArea();
        txtInfo.setEditable(false);
        txtInfo.setFont(new Font("Monospaced", Font.PLAIN, 14));
        add(new JScrollPane(txtInfo), BorderLayout.CENTER);

        btnRefund = new PillButton("XÁC NHẬN HOÀN VÉ");
        btnRefund.setEnabled(false);
        add(btnRefund, BorderLayout.SOUTH);

        btnFind.addActionListener(e -> findTicket());
        btnRefund.addActionListener(e -> handleRefund());
    }
    
    private void findTicket() {
        try {
            int id = Integer.parseInt(txtTicketId.getText().trim());
            currentTicket = bookingDAO.getTicketById(id);
            if (currentTicket != null) {
                Showtime st = scheduleDAO.getShowtimeById(currentTicket.getShowtimeId());
                
                txtInfo.setText("Thông tin vé:\n");
                txtInfo.append("- Mã vé: #" + currentTicket.getId() + "\n");
                txtInfo.append("- Ghế: " + currentTicket.getSeatNumber() + "\n");
                txtInfo.append("- Giá mua: " + currentTicket.getPrice() + " VND\n");
                txtInfo.append("- Trạng thái: " + currentTicket.getStatus() + "\n");
                if (st != null) {
                    txtInfo.append("- Suất chiếu: " + st.getMovieTitle() + " (" + st.getStartTime() + ")\n\n");
                }
                
                if (currentTicket.getStatus().equals("Sold") && st != null) {
                    long diffMs = st.getStartTime().getTime() - System.currentTimeMillis();
                    long diffHours = diffMs / (1000 * 60 * 60);
                    
                    double percent = 0;
                    String reason = "";
                    if (diffHours >= 72) {
                        percent = 0.9;
                        reason = "Hoàn trước 3 ngày (90%)";
                    } else if (diffHours >= 24) {
                        percent = 0.6;
                        reason = "Hoàn trước 1 ngày (60%)";
                    } else if (diffHours >= 6) {
                        percent = 0.3;
                        reason = "Hoàn trước 6 tiếng (30%)";
                    } else {
                        reason = diffHours > 0 ? "Còn dưới 6 tiếng (0%)" : "Suất chiếu đã bắt đầu (0%)";
                    }
                    
                    currentRefundAmount = currentTicket.getPrice() * percent;
                    
                    txtInfo.append("Chính sách hoàn tiền:\n" + reason + "\n");
                    txtInfo.append("=> Số tiền hoàn lại: " + currentRefundAmount + " VND\n");
                    
                    if (percent > 0) {
                        btnRefund.setEnabled(true);
                    } else {
                        btnRefund.setEnabled(false);
                    }
                } else {
                    txtInfo.append("=> Vé này không hợp lệ hoặc đã hoàn.");
                    btnRefund.setEnabled(false);
                }
            } else {
                txtInfo.setText("Không tìm thấy vé!");
                btnRefund.setEnabled(false);
            }
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Mã vé phải là số nguyên!");
        }
    }
    
    private void handleRefund() {
        if (currentTicket != null) {
            if (bookingDAO.refundTicket(currentTicket.getId())) {
                JOptionPane.showMessageDialog(this, "Hoàn vé thành công! Số tiền trả lại khách: " + currentRefundAmount + " VND");
                txtInfo.setText("");
                txtTicketId.setText("");
                btnRefund.setEnabled(false);
                currentTicket = null;
            } else {
                JOptionPane.showMessageDialog(this, "Lỗi khi hoàn vé!");
            }
        }
    }
}
