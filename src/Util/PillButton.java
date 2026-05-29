package Util;

import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.geom.RoundRectangle2D;

public class PillButton extends JButton {

    private static final int SHADOW_GAP = 6;
    private static final int ARC = 50;
    private static final int HPAD = 30;
    private static final int VPAD = 12;

    private boolean hovered = false;
    private Color bgNormal;
    private Color fgNormal;
    private Color bgHover;
    private Color fgHover;

    private static final Color BG_FLAT = new Color(33, 150, 243);
    private static final Color FG_FLAT = Color.WHITE;
    private static final Color HOVER_BG_FLAT = new Color(255, 152, 0);
    private static final Color HOVER_FG_FLAT = new Color(128, 0, 200);

    public PillButton(String text) {
        this(text, BG_FLAT, FG_FLAT, HOVER_BG_FLAT, HOVER_FG_FLAT);
    }

    public PillButton(String text, Color bg, Color fg, Color hoverBg, Color hoverFg) {
        super(text);
        this.bgNormal = bg;
        this.fgNormal = fg;
        this.bgHover = hoverBg;
        this.fgHover = hoverFg;
        setContentAreaFilled(false);
        setFocusPainted(false);
        setBorderPainted(false);
        setOpaque(false);
        setForeground(fg);
        setFont(new Font("Arial", Font.BOLD, 13));
        setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));

        addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                hovered = true;
                repaint();
            }

            @Override
            public void mouseExited(MouseEvent e) {
                hovered = false;
                repaint();
            }
        });
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int w = getWidth();
        int h = getHeight();
        int btnW = w - 2;
        int btnH = h - SHADOW_GAP;
        int arc = ARC;

        g2.setColor(new Color(0, 0, 0, 20));
        g2.fill(new RoundRectangle2D.Double(1, 4, btnW, btnH, arc, arc));
        g2.setColor(new Color(0, 0, 0, 35));
        g2.fill(new RoundRectangle2D.Double(1, 3, btnW, btnH, arc, arc));
        g2.setColor(new Color(0, 0, 0, 55));
        g2.fill(new RoundRectangle2D.Double(1, 2, btnW, btnH, arc, arc));

        g2.setColor(hovered ? bgHover : bgNormal);
        g2.fill(new RoundRectangle2D.Double(0, 0, btnW, btnH, arc, arc));

        g2.dispose();

        setForeground(hovered ? fgHover : fgNormal);
        super.paintComponent(g);
    }

    @Override
    public Dimension getPreferredSize() {
        FontMetrics fm = getFontMetrics(getFont());
        int textW = fm.stringWidth(getText());
        int textH = fm.getHeight();
        return new Dimension(textW + HPAD * 2, textH + VPAD * 2 + SHADOW_GAP);
    }

    @Override
    public boolean contains(int x, int y) {
        if (!super.contains(x, y)) return false;
        int w = getWidth();
        int r = ARC / 2;
        if (x < r) {
            double dx = r - x;
            double dy = getHeight() / 2.0 - y;
            return dx * dx + dy * dy <= r * r;
        } else if (x > w - r) {
            double dx = x - (w - r);
            double dy = getHeight() / 2.0 - y;
            return dx * dx + dy * dy <= r * r;
        }
        return true;
    }
}
