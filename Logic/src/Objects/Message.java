package Objects;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;
import java.time.LocalDateTime;
import java.util.Objects;
@XmlRootElement
public class Message {
    private String header;
    private String content;
    private LocalDateTime createdTime = LocalDateTime.now();

    protected Message(){} //default ctor for xml


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
    @XmlAttribute
    public String getHeader() {
        return header;
    }

    private void  setHeader(String header){
        this.header = header;
    }
    @XmlAttribute
    public String getContent() {
        return content;
    }

    private void setContent(String content){
        this.content = content;
    }

    public LocalDateTime getCreatedTime(){
        return createdTime;
    }
    @XmlAttribute
    private String getCreatedTimeString(){
       return createdTime.toString();
    }

    private void setCreatedTimeString(String createdTimeString){
        this.createdTime = LocalDateTime.parse(createdTimeString);
    }
}
