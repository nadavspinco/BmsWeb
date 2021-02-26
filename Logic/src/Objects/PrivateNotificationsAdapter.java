package Objects;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlRootElement(name="PrivateNotifications")
@XmlAccessorType(XmlAccessType.FIELD)
public class PrivateNotificationsAdapter {
    public List<Notification> getRegistrationList() {
        return notificationList;
    }

    public void setRegistrationList(List<Notification> notificationList) {
        this.notificationList = notificationList;
    }

    private List<Notification> notificationList;

}
