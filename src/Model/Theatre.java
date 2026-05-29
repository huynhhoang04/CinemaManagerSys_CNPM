package Model;

public class Theatre {
    private int id;
    private String name;
    private String location;
    private String city;
    private String previewUrl;
    private String info;
    private String status;

    public Theatre() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getPreviewUrl() { return previewUrl; }
    public void setPreviewUrl(String previewUrl) { this.previewUrl = previewUrl; }
    public String getInfo() { return info; }
    public void setInfo(String info) { this.info = info; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    @Override
    public String toString() { return name; }
}
