package Util;

import java.io.File;
import java.io.FileWriter;
import java.util.List;
import Model.Ticket;

public class TicketPrinter {
    public static void printTickets(String movieTitle, String roomName, String startTime, List<Ticket> tickets, String paymentMethod) {
        try {
            File dir = new File("Tickets");
            if (!dir.exists()) dir.mkdirs();
            
            for (Ticket t : tickets) {
                String filename = "Tickets/Ticket_" + t.getSeatNumber() + "_" + System.currentTimeMillis() + ".txt";
                try (FileWriter fw = new FileWriter(filename)) {
                    fw.write("=== CINEMA TICKET ===\n");
                    fw.write("Mã vé (Ticket ID): #" + t.getId() + "\n");
                    fw.write("Phim: " + movieTitle + "\n");
                    fw.write("Phòng: " + roomName + "\n");
                    fw.write("Thời gian: " + startTime + "\n");
                    fw.write("Ghế: " + t.getSeatNumber() + "\n");
                    fw.write("Thanh toán: " + paymentMethod + "\n");
                    fw.write("Giá vé: " + t.getPrice() + " VND\n");
                    fw.write("=====================\n");
                }
                Thread.sleep(10);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
