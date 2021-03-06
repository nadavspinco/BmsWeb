package Objects;

import Logic.Enum.ActivityTypeEnum;
import Enum.BoatTypeEnum;
import Enum.LevelEnum;
import Objects.Boat;
import Objects.Member;
import jaxb.*;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.GregorianCalendar;

public class XmlManagement {
    private SystemManagement systemManagement;

    public XmlManagement(SystemManagement systemManagement) {
        this.systemManagement = systemManagement;
    }

     public boolean checkBoatLAlreadyExist(jaxb.Boat importedBoat) {
        for (Boat myBoat : systemManagement.getBoatArry()) {
            if (myBoat.getSerialBoatNumber().equals(importedBoat.getId()) || myBoat.getBoatName().equals(importedBoat.getName()))
                return true; // the boat is already exist in the system.
        }
        return false;
    }

    public boolean checkMemberLAlreadyExist(jaxb.Member importedMember) {
        for (Member myMember : systemManagement.getMemberArry()) {
            if (myMember.getEmail().equals(importedMember.getEmail()) || myMember.getSerial().equals(importedMember.getId()))
                return true; // the member is already exist in the system.
        }
        return false;
    }

    public boolean checkMemberLEmailNameEmpty(jaxb.Member member) {
        if (member.getEmail().isEmpty() || member.getName().isEmpty())
            return true;
        return false;
    }

    public boolean checkActivitiesTimeAlreadyExist(Timeframe importedActivity) {
        for (WindowRegistration myWindow : systemManagement.getWindowRegistrations()) {
            if (myWindow.getStartTime().equals(LocalTime.parse(importedActivity.getStartTime())) &&
                    myWindow.getEndTime().equals(LocalTime.parse(importedActivity.getEndTime())) &&
                    importedActivity.getName().contains(ActivityTypeEnum.convertToString(myWindow.getActivityType())                    ))
                return true; // the imported window already exist
        }
        return false;
    }

    public void createMemberFromImport(jaxb.Member memberL) {
        Member newMember = new Member(memberL.getName(), memberL.getEmail(), memberL.getPassword(), memberL.getId());
        if (memberL.getComments() != null) {                                                 // Comments
            if (!memberL.getComments().isEmpty())
                newMember.setAdditionalDetails(memberL.getComments());
        }
        if (memberL.getPhone() != null){                                                    // phone
            if(!memberL.getPhone().isEmpty())
                newMember.setPhoneNumber(memberL.getPhone());
        }
        if (memberL.isHasPrivateBoat() != null && memberL.isHasPrivateBoat() == true) {                                           // private boat
            newMember.setHasPrivateBoat(true);
            newMember.setIdentifyPrivateBoat(memberL.getPrivateBoatId());
        }
        if (memberL.isManager() != null && memberL.isManager() == true)                                                  // is manager
            newMember.setIsManager(true);
        if (memberL.getAge() != null)
            newMember.setAge(memberL.getAge());                                          // age
        if (memberL.getLevel() != null)
            newMember.setLevel(LevelEnum.convertFromRowingLevel(memberL.getLevel()));   // level
        if (memberL.getJoined() != null) {
            LocalDateTime start = createLocalDateTimeFromXml(memberL.getJoined());
            newMember.setJoinDate(start);
        }
        if (memberL.getMembershipExpiration() != null) {
            LocalDateTime end = createLocalDateTimeFromXml(memberL.getMembershipExpiration());
            newMember.setEndDate(end);
        }
        systemManagement.addMember(newMember);
    }

    public LocalDateTime createLocalDateTimeFromXml(XMLGregorianCalendar time) {
        LocalDateTime newTime = time.toGregorianCalendar().toZonedDateTime().toLocalDateTime();
        newTime.minusSeconds(time.toGregorianCalendar().toZonedDateTime().getOffset().getTotalSeconds());
        return newTime;
    }

    public XMLGregorianCalendar createXmlTimeFromLocalDateTime(LocalDateTime time){
        try {
            ZonedDateTime zdt = ZonedDateTime.of(time, ZoneId.systemDefault());
            GregorianCalendar gc = GregorianCalendar.from(zdt);
            XMLGregorianCalendar xgc = DatatypeFactory.newInstance().newXMLGregorianCalendar(gc);
            return xgc;
        }
        catch (Exception e){
            e.getMessage();
        }
        return null;
    }

    public void createBoatFromImport(jaxb.Boat boatL) {
        BoatTypeEnum boatType = BoatTypeEnum.convertFromBoatTypeImported(boatL.getType());
        Boat newBoat = new Boat(boatL.getId(),boatL.getName(), boatType);
        if(boatL.isCostal() != null)
            newBoat.setCoastalBoat(boatL.isCostal());
        if(boatL.isHasCoxswain() != null)
            newBoat.setHasCoxswain(boatL.isHasCoxswain());
        if(boatL.isWide() != null)
            newBoat.setWide(boatL.isWide());
        if(boatL.isOutOfOrder() != null)
            newBoat.setAvailable(boatL.isOutOfOrder());
        if(boatL.isPrivate() != null)
            newBoat.setPrivate(boatL.isPrivate());

        systemManagement.addBoat(newBoat);
    }

    public void createWindowRegistration(Timeframe timeframe) {
        BoatTypeEnum boatType = null;
        if (timeframe.getBoatType() != null)
            boatType = BoatTypeEnum.convertFromBoatTypeImported(timeframe.getBoatType());
        LocalTime start = LocalTime.parse(timeframe.getStartTime());
        LocalTime end = LocalTime.parse(timeframe.getEndTime());

        ActivityTypeEnum activity;
        if (timeframe.getName().contains("Rowing"))
            activity = ActivityTypeEnum.convertFromString("Rowing");
        else
            activity = ActivityTypeEnum.convertFromString("Group practice");

        WindowRegistration window = new WindowRegistration(activity, boatType, start, end);
        systemManagement.addWindowRegistration(window);
    }

    public Members loadXmlMembers(String filePath) throws Exception {
        try {
            InputStream inputStream = new FileInputStream(new File(filePath));
            JAXBContext jxb = JAXBContext.newInstance(Members.class);
            Unmarshaller unmarshaller = jxb.createUnmarshaller();
            return (Members) unmarshaller.unmarshal(inputStream);
        }
        catch (JAXBException e) {
            throw new Exception("Load xml was failed",e);
        }
        catch (FileNotFoundException e) {
            throw new Exception("Filed not found",e);
        }
        catch (Exception e){
            throw new Exception("Load xml was failed",e);
        }
    }

    public Boats loadXmlBoats(String filePath) throws Exception {
        try {
            InputStream inputStream = new FileInputStream(new File(filePath));
            JAXBContext jxb = JAXBContext.newInstance(Boats.class);
            Unmarshaller unmarshaller = jxb.createUnmarshaller();
            return (Boats) unmarshaller.unmarshal(inputStream);
        }
        catch (JAXBException e) {
            throw new Exception("Load xml was failed",e);
        }
        catch (FileNotFoundException e) {
            throw new Exception("Filed not found",e);
        }
        catch (Exception e){
            throw new Exception("Load xml was failed",e);
        }
    }

    public Activities loadXmlActivities(String filePath) throws Exception {
        try {
            InputStream inputStream = new FileInputStream(new File(filePath));
            JAXBContext jxb = JAXBContext.newInstance(Activities.class);
            Unmarshaller unmarshaller = jxb.createUnmarshaller();
            return (Activities) unmarshaller.unmarshal(inputStream);
        }
        catch (JAXBException e) {
            throw new Exception("Load xml was failed",e);
        }
        catch (FileNotFoundException e) {
            throw new Exception("Filed not found",e);
        }
        catch (Exception e){
            throw new Exception("Load xml was failed",e);
        }
    }

    public jaxb.Member convertMemberToXml(Member member){
        jaxb.Member memberL = new jaxb.Member();
        memberL.setAge(member.getAge());
        memberL.setComments(member.getAdditionalDetails());
        memberL.setEmail(member.getEmail());
        memberL.setHasPrivateBoat(member.getHasPrivateBoat());
        memberL.setId(member.getSerial());
        memberL.setJoined(createXmlTimeFromLocalDateTime(member.getJoinDate()));
        memberL.setLevel(LevelEnum.convertToRowingLevel(member.getLevel()));
        memberL.setManager(member.getIsManager());
        memberL.setMembershipExpiration(createXmlTimeFromLocalDateTime(member.getEndDate()));
        memberL.setName(member.getNameMember());
        memberL.setPassword(Encryptor.decrypt(member.getPassword()));
        memberL.setPhone(member.getPhoneNumber());
        memberL.setPrivateBoatId(member.getIdentifyPrivateBoat());

        return memberL;
    }

    public jaxb.Boat convertBoatToXml(Boat boat){
        jaxb.Boat boatL = new jaxb.Boat();
        boatL.setCostal(boat.isCoastalBoat());
        boatL.setHasCoxswain(boat.isHasCoxswain());
        boatL.setId(boat.getSerialBoatNumber());
        boatL.setName(boat.getBoatName());
        boatL.setOutOfOrder(boat.isAvailable());
        boatL.setPrivate(boat.isPrivate());
        boatL.setWide(boat.isWide());
        boatL.setType(BoatTypeEnum.convertToBoatTypeGenerated(boat.getBoatType()));

        return boatL;
    }

    public Timeframe convertToTimeFrame(WindowRegistration window){
        Timeframe timeframe = new Timeframe();
        if(window.getBoatType() != null)
            timeframe.setBoatType(BoatTypeEnum.convertToBoatTypeGenerated(window.getBoatType()));
        timeframe.setName(ActivityTypeEnum.convertToString(window.getActivityType()));
        timeframe.setStartTime(window.getStartTime().toString());
        timeframe.setEndTime(window.getEndTime().toString());

        return timeframe;
    }

    public void exportMembers(Members members, String filePath){
            try {
                File file = new File(filePath);
                JAXBContext jaxbContext = JAXBContext.newInstance(Members.class);
                Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
                jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
                jaxbMarshaller.marshal(members, file);
            }
            catch (JAXBException e) {
                e.printStackTrace();
            }
    }

    public void exportBoats(Boats boats, String filePath){
        try {
            String a;
            File file = new File(filePath);
            JAXBContext jaxbContext = JAXBContext.newInstance(Boats.class);
            Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
            jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
            jaxbMarshaller.marshal(boats, file);
        }
        catch (JAXBException e) {
            e.printStackTrace();
        }
    }

    public void exportActivities(Activities activities, String filePath){
        try {
            File file = new File(filePath);
            JAXBContext jaxbContext = JAXBContext.newInstance(Activities.class);
            Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
            jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
            jaxbMarshaller.marshal(activities, file);
        }
        catch (JAXBException e) {
            e.printStackTrace();
        }
    }

    public static ChatManager importChatManagerDetails() throws Exception {
        try {
            InputStream inputStream = new FileInputStream(new File(getFileLocation()+"ChatManager.xml"));
            // file location by Liron
            JAXBContext jxb = JAXBContext.newInstance(ChatManager.class);
            Unmarshaller unmarshaller = jxb.createUnmarshaller();
            ChatManager chatManager = (ChatManager) unmarshaller.unmarshal(inputStream);
            return chatManager;
        }
        catch (JAXBException e) {
            throw new Exception("Load xml was failed",e);
        }
        catch (FileNotFoundException e) {
            throw new Exception("Filed not found",e);
        }
        catch (Exception e){
            e.printStackTrace();
            throw new Exception("Load xml was failed",e);
        }
    }

    public static void exportChatManagerDetails(ChatManager chatManager){
        try {
            File file = new File(getFileLocation()+"ChatManager.xml");
            // file location by Liron
            JAXBContext jaxbContext = JAXBContext.newInstance(ChatManager.class);
            Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
            jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
            jaxbMarshaller.marshal(chatManager, file);
        }
        catch (JAXBException e) {
            e.printStackTrace();
        }
    }


    public static SystemManagement importSystemManagementDetails() throws Exception {
        try {
            InputStream inputStream = new FileInputStream(new File(getFileLocation()+"SystemManagement.xml"));
            // file location by Liron
            JAXBContext jxb = JAXBContext.newInstance(SystemManagement.class);
            Unmarshaller unmarshaller = jxb.createUnmarshaller();
            SystemManagement importedSystemManagement = (SystemManagement) unmarshaller.unmarshal(inputStream);
            importedSystemManagement.fixReferencesAfterImportInnerDetails();
            return importedSystemManagement;
        }
        catch (JAXBException e) {
            throw new Exception("Load xml was failed",e);
        }
        catch (FileNotFoundException e) {
            throw new Exception("Filed not found",e);
        }
        catch (Exception e){
            e.printStackTrace();
            throw new Exception("Load xml was failed",e);
        }
    }

    public static NotificationManager importNotificationManagerDetails() throws Exception {
        try {
            InputStream inputStream = new FileInputStream(new File(getFileLocation()+"NotificationManager.xml"));
            // file location by Liron
            JAXBContext jxb = JAXBContext.newInstance(NotificationManager.class);
            Unmarshaller unmarshaller = jxb.createUnmarshaller();
            NotificationManager notificationManager = (NotificationManager) unmarshaller.unmarshal(inputStream);
            return notificationManager;
        }
        catch (JAXBException e) {
            throw new Exception("Load xml was failed",e);
        }
        catch (FileNotFoundException e) {
            throw new Exception("Filed not found",e);
        }
        catch (Exception e){
            e.printStackTrace();
            throw new Exception("Load xml was failed",e);
        }
    }

    public static void exportSystemManagementDetails(SystemManagement systemManagement){
        try {
            File file = new File(getFileLocation()+"SystemManagement.xml");
            // file location by Liron
            JAXBContext jaxbContext = JAXBContext.newInstance(SystemManagement.class);
            Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
            jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
            jaxbMarshaller.marshal(systemManagement, file);
        }
        catch (JAXBException e) {
            e.printStackTrace();
        }
    }

    public static void exportNotificationManagerDetails(NotificationManager notificationManager){
        try {
            File file = new File(getFileLocation()+"NotificationManager.xml");
            // file location by Liron
            JAXBContext jaxbContext = JAXBContext.newInstance(NotificationManager.class);
            Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
            jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
            jaxbMarshaller.marshal(notificationManager, file);
        }
        catch (JAXBException e) {
            e.printStackTrace();
        }
    }

    public boolean checkCoxswainValidInMemberL(jaxb.Boat boat){
        if(boat.isHasCoxswain() == null)
            return true;
        // check if the boat has coxswain (field == true) then the boatType have to include type with coxswain.
        boolean hasCoxswainInType = false;
        BoatTypeEnum boatTypeToCheck = BoatTypeEnum.convertFromBoatTypeImported(boat.getType());
        hasCoxswainInType = BoatTypeEnum.isHasCoxswain(boatTypeToCheck);

        return hasCoxswainInType == boat.isHasCoxswain();
    }

    public Boats loadBoatsFromXmlString(String stringDetails) throws Exception {
        try {
            byte[] bytes = stringDetails.getBytes(StandardCharsets.UTF_8);
            InputStream inputStream = new ByteArrayInputStream(bytes);
            JAXBContext jxb = JAXBContext.newInstance(Boats.class);
            Unmarshaller unmarshaller = jxb.createUnmarshaller();
            return (Boats) unmarshaller.unmarshal(inputStream);
        }
        catch (JAXBException e) {
            throw new Exception("Load xml was failed",e);
        }
        catch (Exception e){
            throw new Exception("Load xml was failed",e);
        }
    }

    public Members loadMembersFromXmlString(String stringDetails) throws Exception {
        try {
            byte[] bytes = stringDetails.getBytes(StandardCharsets.UTF_8);
            InputStream inputStream = new ByteArrayInputStream(bytes);
            JAXBContext jxb = JAXBContext.newInstance(Members.class);
            Unmarshaller unmarshaller = jxb.createUnmarshaller();
            return (Members) unmarshaller.unmarshal(inputStream);
        }
        catch (JAXBException e) {
            throw new Exception("Load xml was failed",e);
        }
        catch (Exception e){
            throw new Exception("Load xml was failed",e);
        }
    }

    public Activities loadActivitiesFromXmlString(String stringDetails) throws Exception {
        try {
            byte[] bytes = stringDetails.getBytes(StandardCharsets.UTF_8);
            InputStream inputStream = new ByteArrayInputStream(bytes);
            JAXBContext jxb = JAXBContext.newInstance(Activities.class);
            Unmarshaller unmarshaller = jxb.createUnmarshaller();
            return (Activities) unmarshaller.unmarshal(inputStream);
        }
        catch (JAXBException e) {
            throw new Exception("Load xml was failed",e);
        }

        catch (Exception e){
            throw new Exception("Load xml was failed",e);
        }
    }

    public static String getFileLocation(){
        if(isOperationSystemSWindows()){
            return "c:\\temp\\";
        }

        return System.getProperty("user.dir")+ "/webapps/";

    }

    public static boolean isOperationSystemSWindows(){
            return (System.getProperty("os.name").toLowerCase().indexOf("win") >= 0);
    }
}