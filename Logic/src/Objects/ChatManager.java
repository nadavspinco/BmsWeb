package Objects;

import javax.xml.bind.annotation.XmlRootElement;
import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

@XmlRootElement
public class ChatManager {
    private List<ChatMessage> messages = new LinkedList<ChatMessage>();
    private LocalDateTime lastUpdate = LocalDateTime.now();
    public void addMessage(String header,String content,Member member){
        messages.add(new ChatMessage(header,content,member));
        lastUpdate = LocalDateTime.now();
    }
    public ChatMessage [] getMessages(){
       return messages.toArray(new ChatMessage[0]);
    }

    public boolean isUpdated(LocalDateTime localDateTime){
        if(localDateTime == null)
            return false;
        return !lastUpdate.isAfter(localDateTime);
    }

    public LocalDateTime getLastUpdate(){
        return this.lastUpdate;
    }
}
