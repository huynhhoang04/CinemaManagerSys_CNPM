package Model;

import java.util.Date;
import java.util.List;

public class Movie {
    private int id;
    private String title;
    private String description;
    private String posterUrl;
    private String trailerUrl;
    private int duration;
    private Date releaseDate;
    private String status; // Active, Inactive
    private List<Genre> genres;
    private List<Actor> actors;
    private List<Director> directors;

    public Movie() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }
    public String getTrailerUrl() { return trailerUrl; }
    public void setTrailerUrl(String trailerUrl) { this.trailerUrl = trailerUrl; }
    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }
    public Date getReleaseDate() { return releaseDate; }
    public void setReleaseDate(Date releaseDate) { this.releaseDate = releaseDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<Genre> getGenres() { return genres; }
    public void setGenres(List<Genre> genres) { this.genres = genres; }
    public List<Actor> getActors() { return actors; }
    public void setActors(List<Actor> actors) { this.actors = actors; }
    public List<Director> getDirectors() { return directors; }
    public void setDirectors(List<Director> directors) { this.directors = directors; }
}
