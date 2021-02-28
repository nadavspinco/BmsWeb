package Objects;

public class NotificationMessages {

    public static String getNewAssignmentHeader(Registration registration){
        return "new Assignment on " +registration.getActivityDate().toLocalDate();
    }


    public static String getAssignmentMessage(Registration registration, Boat boat){
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("rowers:\n");
        registration.getRowersListInBoat().forEach(member -> {
            stringBuilder.append(member.getNameMember());
            stringBuilder.append("\n");
        });
        stringBuilder.append(boat.getBoatName());
        stringBuilder.append(" ");
        stringBuilder.append(boat.getBoatType());
        stringBuilder.append("\n");
        return stringBuilder.toString();
    }
    
    public static String getDeleteAssignmentHeader(Assignment assignment){
        return "deleted Assignment on "+assignment.getRegistration().getActivityDate().toLocalDate();
    }

}
