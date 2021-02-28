package Objects;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import java.time.LocalDateTime;
import java.util.*;
@XmlRootElement
public class NotificationManager {
    //This class is the notification manager
    private List<Notification> generalNotifications = new LinkedList<Notification>();
    private Map<Member,List<Notification>> privateNotificationMap = new HashMap<Member,List<Notification>>();
    private LocalDateTime lastUpdatedGeneral = LocalDateTime.now();
    private Map<Member,LocalDateTime> lastUpdatedPrivate = new HashMap<Member,LocalDateTime>();

    private List<Notification> getGeneralNotifications(){
        return generalNotifications;
    }
    @XmlElement(name = "generalNotifications")
    private void setGeneralNotifications(List<Notification> generalNotifications){
        this.generalNotifications =generalNotifications;
    }

    private String getLastUpdatedGeneral()
    {
        return lastUpdatedGeneral.toString();
    }
    @XmlElement(name = "lastUpdatedGeneral")
    private void setLastUpdatedGeneral(String lastUpdatedGeneral)
    {
        this.lastUpdatedGeneral = LocalDateTime.parse(lastUpdatedGeneral);
    }


    private PrivateNotificationsAdapter getPrivateNotifications(){
        List<Notification> notificationListToReturn = new LinkedList<Notification>();
        for(List<Notification> notificationList: privateNotificationMap.values()){
            notificationList.forEach(notification -> notificationListToReturn.add(notification));
        }
        PrivateNotificationsAdapter privateNotificationsAdapter = new PrivateNotificationsAdapter();
        privateNotificationsAdapter.setRegistrationList(notificationListToReturn);
        return privateNotificationsAdapter;
    }

    @XmlElement(name = "PrivateNotifications")
    public void setPrivateNotifications(PrivateNotificationsAdapter PrivateNotifications){
       List<Notification> notificationList = PrivateNotifications.getRegistrationList();
       if(notificationList != null) {
           notificationList.forEach(notification -> addPrivateNotification(notification.getMember(), notification.getHeader(), notification.getContent()));
       }
    }


    public void addGeneralNotification(String header, String message ){
        //add notification for all members
        generalNotifications.add(new Notification(header,message,false,null));
        setLastUpdated();
    }
    public void deleteGeneralNotification(Notification notification){
        //delete general notification for all members
        generalNotifications.remove(notification);
        setLastUpdated();
    }

    public void addPrivateNotification(Member member, String header,String message){
        //add private  notification for a member
        addNotificationToMap(member,new Notification(header,message,true,member));
        setLastUpdatedPrivateMap(member);
    }

    private void addNotificationToMap(Member member, Notification notification) {
        //update notificationsMap
        List<Notification> memberNotifications;
        if(privateNotificationMap.containsKey(member)){
             memberNotifications = privateNotificationMap.get(member);
        }
        else {
            memberNotifications = new LinkedList<Notification>();
            privateNotificationMap.put(member,memberNotifications);
        }
        memberNotifications.add(notification);
    }

    public void deletePrivateNotification(Member member ,Notification notification){
        deleteNotificationFromMap(member,notification);
        setLastUpdatedPrivateMap(member);
    }

    private void deleteNotificationFromMap(Member member, Notification notification) {
        if(privateNotificationMap.containsKey(member)){
            List<Notification> memberNotifications = privateNotificationMap.get(member);
            if(memberNotifications!= null){
                memberNotifications.remove(notification);
            }
        }
    }

    private void setLastUpdated(){
        lastUpdatedGeneral = LocalDateTime.now();
        System.out.println("update local date time");
    }

    private void setLastUpdatedPrivateMap(Member member){
        //update the map so the browser will know this member notifications has changed
        lastUpdatedPrivate.put(member,LocalDateTime.now());
    }

    public boolean isUpdated(Member member,LocalDateTime lastFetchTime){
        //return is the member is already updated with the last notifications. private and general
        System.out.println(privateNotificationMap.size());
        if(lastFetchTime == null){
            return false;
        }
        if(lastUpdatedGeneral == null || lastUpdatedGeneral.isAfter(lastFetchTime)){
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
        //get All the notifications for a member
        List<Notification> notifications = new LinkedList<Notification>();
        if(privateNotificationMap.containsKey(member)){
            privateNotificationMap.get(member).forEach(notification -> notifications.add(notification));
        }
        generalNotifications.forEach(notification -> notifications.add(notification));
        Collections.sort(notifications, new Comparator<Notification>() {
            //Sort the notifications by dates 
            public int compare(Notification o1, Notification o2) {
                return (int) o2.getCreatedTime().compareTo(o1.getCreatedTime());
            }
        });
        return notifications.toArray(new Notification[0]);
    }
}
