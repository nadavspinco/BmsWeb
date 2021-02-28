package Objects;


import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
@XmlRootElement
public class ChatMessage extends Message {
    //Chat Message in the Chat
    private Member member;
   public ChatMessage(String header, String content, Member member){
       super(header,content);
       this.member = member;
    }
    private ChatMessage(){ //For Xml
    }
    @XmlElement(name ="member")
    public Member getMember(){
        return member;
    }

    private void setMember(Member member){
        this.member = member;
    }
}
