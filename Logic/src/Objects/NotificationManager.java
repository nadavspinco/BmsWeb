package Objects;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

public class NotificationManager {
    private List<Notification> generalNotifications = new LinkedList<Notification>();
    private Map<Member,List<Notification>> privateNotification = new HashMap<Member,List<Notification>>();
    private LocalDateTime lastUpdatedGeneral;
    private Map<Member,LocalDateTime> lastUpdatedPrivate = new HashMap<Member,LocalDateTime>();

    public void addGeneralNotification(String header, String message ){
        generalNotifications.add(new Notification(header,message,false));
        setLastUpdated();
    }
    public void deleteGeneralNotification(Notification notification){
        generalNotifications.remove(notification);
        setLastUpdated();
    }

    public void addPrivateNotification(Member member, String header,String message){
        addNotificationToMap(member,new Notification(header,message,true));
        setLastUpdatedPrivateMap(member);
    }

    private void addNotificationToMap(Member member, Notification notification) {
        List<Notification> memberNotifications;
        if(privateNotification.containsKey(member)){
             memberNotifications = privateNotification.get(member);
        }
        else {
            memberNotifications = new LinkedList<Notification>();
            privateNotification.put(member,memberNotifications);
        }
        memberNotifications.add(notification);
    }

    public void deletePrivateNotification(Member member ,Notification notification){
        deleteNotificationFromMap(member,notification);
        setLastUpdatedPrivateMap(member);
    }

    private void deleteNotificationFromMap(Member member, Notification notification) {
        if(privateNotification.containsKey(member)){
            List<Notification> memberNotifications = privateNotification.get(member);
            if(memberNotifications!= null){
                memberNotifications.remove(notification);
            }
        }
    }

    private void setLastUpdated(){
        lastUpdatedGeneral = LocalDateTime.now();
    }

    private void setLastUpdatedPrivateMap(Member member){
        lastUpdatedPrivate.put(member,LocalDateTime.now());
    }

    public boolean isUpdated(Member member,LocalDateTime lastFetchTime){
        if(lastFetchTime == null){
            return false;
        }
        if(lastUpdatedGeneral == null || lastFetchTime.isAfter(lastFetchTime)){
            return false;
        }

        if(lastUpdatedPrivate.containsKey(member)){
            if(lastUpdatedPrivate.get(member).isAfter(lastFetchTime)){
                return false;
            }
        }
        return true;
    }

    public Notification [] getNotifications(Member member){
        List<Notification> notifications = new LinkedList<Notification>();
        if(privateNotification.containsKey(member)){
            privateNotification.get(member).forEach(notification -> notifications.add(notification));
        }
        generalNotifications.forEach(notification -> notifications.add(notification));
        Collections.sort(notifications, new Comparator<Notification>() {
            public int compare(Notification o1, Notification o2) {
                return (int) o2.getCreatedTime().compareTo(o1.getCreatedTime());
            }
        });
        return notifications.toArray(new Notification[0]);
    }
}
