package Model;

public class Actor {
    private int id;
    private String name;
    private String avatar;
    private String bio;

    public Actor() {}
    public Actor(int id, String name, String avatar, String bio) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.bio = bio;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    @Override
    public String toString() { return name; }
}
