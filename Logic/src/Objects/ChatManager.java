package Objects;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

@XmlRootElement
public class ChatManager {
    //bonus:
    //Chat Manager for the chat in our app.
    private List<ChatMessage> messages = new LinkedList<ChatMessage>();
    private LocalDateTime lastUpdate = LocalDateTime.now();
    public void addMessage(String header,String content,Member member){
        messages.add(new ChatMessage(header,content,member));
        lastUpdate = LocalDateTime.now();
    }
    @XmlElement(name = "Messages")
    public ChatMessage [] getMessages(){
       return messages.toArray(new ChatMessage[0]);
    }

    private void setMessages(ChatMessage [] messages){
        for(ChatMessage message : messages){
            this.messages.add(message);
        }
    }

    public boolean isUpdated(LocalDateTime localDateTime){
        if(localDateTime == null)
            return false;
        return !lastUpdate.isAfter(localDateTime);
    }

    public LocalDateTime getLastUpdate(){
        return this.lastUpdate;
    }
    @XmlElement(name = "LastUpdateString")
    private String  getLastUpdateString() {return lastUpdate.toString();}

    private void setLastUpdateString(String lastUpdateString){
        this.lastUpdate = LocalDateTime.parse(lastUpdateString);
    }


}
