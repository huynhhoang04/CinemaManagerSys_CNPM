package Util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;
import java.io.FileInputStream;
import java.io.IOException;

public class DBConnection {
    public static Connection getConnection() {
        Connection connection = null;
        try (FileInputStream fis = new FileInputStream("config.properties")) {
            Properties prop = new Properties();
            prop.load(fis);
            
            String url = prop.getProperty("db.url");
            String user = prop.getProperty("db.username");
            String pass = prop.getProperty("db.password");
            
            // Load driver (optional in newer JDBC, but good for backward compatibility)
            Class.forName("org.postgresql.Driver");
            connection = DriverManager.getConnection(url, user, pass);
        } catch (IOException | SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            System.err.println("Lỗi kết nối cơ sở dữ liệu. Vui lòng kiểm tra config.properties và PostgreSQL.");
        }
        return connection;
    }
}