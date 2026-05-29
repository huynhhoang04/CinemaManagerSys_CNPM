package Util;
import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.geom.RoundRectangle2D;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

public class SeatMapPanel extends JPanel {
    private List<String> soldSeats;
    private List<String> selectedSeats;
    private Consumer<List<String>> onSeatSelectionChanged;
    private static final Color COLOR_AVAILABLE = new Color(220, 235, 255);
    private static final Color COLOR_AVAILABLE_BORDER = new Color(100, 150, 220);
    private static final Color COLOR_SOLD = new Color(200, 200, 200);
    private static final Color COLOR_SOLD_BORDER = new Color(170, 170, 170);
    private static final Color COLOR_SELECTED = new Color(76, 175, 80);
    private static final Color COLOR_SELECTED_BORDER = new Color(56, 142, 60);

    public SeatMapPanel(int capacity, List<String> soldSeats, Consumer<List<String>> onSeatSelectionChanged) {
        this.soldSeats = soldSeats;
        this.selectedSeats = new ArrayList<>();
        this.onSeatSelectionChanged = onSeatSelectionChanged;

        int cols = 10;
        int rows = (int) Math.ceil((double) capacity / cols);
        setLayout(new GridLayout(rows, cols, 8, 8));
        setBackground(Color.WHITE);

        for (int r = 0; r < rows; r++) {
            char rowChar = (char) ('A' + r);
            for (int c = 1; c <= cols; c++) {
                int seatIndex = r * cols + c;
                if (seatIndex > capacity) break;

                String seatName = rowChar + String.valueOf(c);
                boolean isSold = soldSeats.contains(seatName);

                SeatPanel seat = new SeatPanel(seatName, isSold);
                if (!isSold) {
                    seat.setCursor(new Cursor(Cursor.HAND_CURSOR));
                    seat.addMouseListener(new MouseAdapter() {
                        @Override
                        public void mouseClicked(MouseEvent e) {
                            if (selectedSeats.contains(seatName)) {
                                selectedSeats.remove(seatName);
                                seat.setState(SeatState.AVAILABLE);
                            } else {
                                selectedSeats.add(seatName);
                                seat.setState(SeatState.SELECTED);
                            }
                            if (onSeatSelectionChanged != null) {
                                onSeatSelectionChanged.accept(selectedSeats);
                            }
                        }
                    });
                }
                add(seat);
            }
        }
    }

    enum SeatState { AVAILABLE, SOLD, SELECTED }

    static class SeatPanel extends JPanel {
        private final String label;
        private SeatState state;

        SeatPanel(String label, boolean isSold) {
            this.label = label;
            this.state = isSold ? SeatState.SOLD : SeatState.AVAILABLE;
            setPreferredSize(new Dimension(50, 50));
            setOpaque(false);
        }

        void setState(SeatState s) {
            this.state = s;
            repaint();
        }

        @Override
        protected void paintComponent(Graphics g) {
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            int w = getWidth(), h = getHeight();
            Color fill, border;
            switch (state) {
                case SOLD:      fill = COLOR_SOLD;      border = COLOR_SOLD_BORDER;      break;
                case SELECTED:  fill = COLOR_SELECTED;   border = COLOR_SELECTED_BORDER;  break;
                default:        fill = COLOR_AVAILABLE;  border = COLOR_AVAILABLE_BORDER; break;
            }

            g2.setColor(fill);
            g2.fill(new RoundRectangle2D.Double(10, 1, w - 20, 15, 8, 8));
            g2.fill(new RoundRectangle2D.Double(6, 14, w - 12, 18, 6, 6));
            g2.fill(new RoundRectangle2D.Double(3, 8, 7, 24, 4, 4));
            g2.fill(new RoundRectangle2D.Double(w - 10, 8, 7, 24, 4, 4));

            g2.setColor(border);
            g2.setStroke(new BasicStroke(1.2f));
            g2.draw(new RoundRectangle2D.Double(10, 1, w - 20, 15, 8, 8));
            g2.draw(new RoundRectangle2D.Double(6, 14, w - 12, 18, 6, 6));
            g2.draw(new RoundRectangle2D.Double(3, 8, 7, 24, 4, 4));
            g2.draw(new RoundRectangle2D.Double(w - 10, 8, 7, 24, 4, 4));

            g2.setColor(state == SeatState.SOLD ? Color.DARK_GRAY : new Color(50, 50, 50));
            g2.setFont(new Font("Arial", Font.BOLD, 9));
            FontMetrics fm = g2.getFontMetrics();
            g2.drawString(label, (w - fm.stringWidth(label)) / 2, h - 2);

            g2.dispose();
        }
    }
}
