package Util;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.JTableHeader;
import java.awt.*;

public class TableUtils {

    private static final int MARGIN_SIDES = 30;
    private static final int ROW_HEIGHT = 35;
    private static final Color GRID_COLOR = new Color(220, 220, 220);
    private static final Color SELECTION_BG = new Color(200, 220, 240);
    private static final Color BORDER_COLOR = new Color(210, 210, 210);

    public static DefaultTableModel createModel(String[] columns) {
        return new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };
    }

    public static JTable createTable(DefaultTableModel model) {
        JTable table = new JTable(model);
        table.setRowHeight(ROW_HEIGHT);
        table.setFont(new Font("Arial", Font.PLAIN, 13));
        table.setForeground(Color.BLACK);
        table.setBackground(Color.WHITE);
        table.setSelectionBackground(SELECTION_BG);
        table.setSelectionForeground(Color.BLACK);
        table.setGridColor(GRID_COLOR);
        table.setShowGrid(true);
        table.setIntercellSpacing(new Dimension(1, 1));
        table.setFillsViewportHeight(true);

        JTableHeader header = table.getTableHeader();
        header.setFont(new Font("Arial", Font.BOLD, 13));
        header.setBackground(Color.WHITE);
        header.setForeground(Color.BLACK);
        header.setPreferredSize(new Dimension(header.getPreferredSize().width, 40));

        return table;
    }

    public static JScrollPane createScrollPane(JTable table) {
        JScrollPane sp = new JScrollPane(table);
        sp.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createEmptyBorder(10, MARGIN_SIDES, 10, MARGIN_SIDES),
                BorderFactory.createLineBorder(BORDER_COLOR)
        ));
        sp.getViewport().setBackground(Color.WHITE);
        return sp;
    }
}
