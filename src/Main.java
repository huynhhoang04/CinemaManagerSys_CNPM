import View.LoginFrame;

import javax.swing.SwingUtilities;
import javax.swing.UIManager;

public class Main {
    public static void main(String[] args) {
        try {
            // Set System L&F
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e) {
            e.printStackTrace();
        }

        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                Util.UIUtils.initGlobalStyles();
                View.LoginFrame loginFrame = new View.LoginFrame();
                Util.NavigationManager.getInstance().start(loginFrame);
            }
        });
    }
}
