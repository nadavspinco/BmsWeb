package Objects;

import java.time.LocalDateTime;
import java.util.Objects;

public class Message {
    private String header;
    private String content;
    private LocalDateTime createdTime = LocalDateTime.now();

    public Message(String header, String content) {
        this.header = header;
        this.content = content;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Message message = (Message) o;
        return Objects.equals(getHeader(), message.getHeader()) &&
                Objects.equals(getContent(), message.getContent()) &&
                Objects.equals(getCreatedTime(), message.getCreatedTime());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getHeader(), getContent(), getCreatedTime());
    }

    public String getHeader() {
        return header;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedTime(){
        return createdTime;
    }
}
