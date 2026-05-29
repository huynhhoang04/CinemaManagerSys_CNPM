package Model;

public class Room {
    private int id;
    private int theatreId;
    private String name;
    private String type;
    private int capacity;
    private String status;

    public Room() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getTheatreId() { return theatreId; }
    public void setTheatreId(int theatreId) { this.theatreId = theatreId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
