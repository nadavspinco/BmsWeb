package Objects;


import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.Objects;
@XmlRootElement
public class Notification extends Message {
    //this Class Represent notification on
    @XmlAttribute
    private boolean isPrivate;
    private Member member;
    private Notification(){ //For Xml
        super();
    }
    Notification(String header, String content,boolean isPrivate,Member member) {
        super(header,content);
        this.isPrivate = isPrivate;
        this.member= member;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Notification that = (Notification) o;
        return isPrivate() == that.isPrivate();
    }

    @Override
    public int hashCode() {
        return Objects.hash(isPrivate());
    }

    public boolean isPrivate(){
        return isPrivate;
    }


@XmlElement(name ="member")
    public Member getMember(){
        return member;
    }

    private void setMember(Member member){
        this.member = member;
    }

}
