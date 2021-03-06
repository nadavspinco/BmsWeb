package Objects;

import Enum.BoatTypeEnum;
import Enum.LevelEnum;
import Objects.*;
import jaxb.Activities;
import jaxb.Boats;
import jaxb.Members;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface EngineInterface {

    public List<WindowRegistration> getWindowRegistrationList();

    public List<Boat> getBoatList();

    boolean isBoatIsPrivate(String boatId);

    boolean isRegistrationAllowedForMember(Registration registration, Member member);

    boolean isRegistrationAllowed(Registration registration);

    Assignment[] getAssignmentForward(int numOfDays);

    void removeMemberFromAssigment(Assignment assignment, Member member, boolean toSplit);

    Registration[] getValidRegistrationToUnion(Assignment assignment);

    void unionRequestToAssignment(Assignment assignment, Registration registration);

    void removeAssignment(Assignment assignment, boolean toDeleteRegistration);

    Boat[] getArrayOfValidBoats(Registration registration);

    void assignBoat(Registration registration, Boat boat) throws InvalidAssignmentException;

    boolean isAssigmentIsValidForMember(Registration registration, Member member);

    boolean isLegalAssigment(Registration registration, Boat boat);

    Registration[] getMainRegistrationByDays(int numOfDays);

    List<Registration> getRegistrationBySpecificDay(LocalDate date);

    List<Registration> getConfirmedRegistrationBySpecificDay(LocalDate date);

    void addRegistration(Registration registration, boolean assignPrivateBoutIfExists) throws InvalidRegistrationException;

    Assignment[] getAssignmentByDate(LocalDate date);

    Boat getBoatById(String boatId);

    WindowRegistration[] getWindowRegistrations();

    Boat[] getBoatArry();

    Member[] getMemberArry();

    void deleteWindowRegistration(WindowRegistration windowRegistration);

    String createBoatCode(Boat boat);

    void removeMember(Member member);

    void removeBoat(Boat boat);

    boolean isWindowRegistrationEmpty();

    boolean isEmailAlreadyExist(String email);

   // boolean isMemberAlreadyLoggedIn(String emailInput);

 //   void logout(Member member);

    void addWindowRegistration(WindowRegistration windowRegistration);

    Member loginMember(String emailInput, String passwordInput);

    boolean isBoatExistBySerial(String boatSerial);

    boolean isMemberExistBySerial(String serial);

    void addBoat(String boatNameInput, BoatTypeEnum boatTypeInput, boolean isCoastalInput, boolean isWideInput, String serial);

    void addBoat(Boat boat);

    void addMember(Member member);

    void addMember(String name, String phone, String email, String password, int age,
                   String additionalDetails, LevelEnum lvl, boolean isManager, String ID);

    void changePhoneNumber(Member member, String newPhone);

    void changeName(Member member, String newName);

    void changePassword(Member member, String newPassword);

    void changeEmail(Member member, String newEmail) throws EmailAlreadyExistException;

    void updateMemberAge(Member member, int age);

    void updateMemberEndDate(Member member, int numberOfYears);

    void updateMemberLevel(Member member, LevelEnum level);

    void cancelMembersPrivateBoat(Member member);

    void updateBoatName(Boat boat, String name);

    void updateIsWide(Boat boat);

    void updateIsCoastal(Boat boat);

    void fixBoat(Boat boat);

    List<Member> getMemberList();

    void disAbleBoat(Boat boat);

    void removeRegistrationRequestByMember(Registration registration);

    void addRowerToRegiRequest(Member member, Registration regiRequest);

    void removeRowerSpecificFromRegiRequest(Member member, Registration regiRequest, boolean toSplitRegistration);

    void addBoatTypeToRegiRequest(BoatTypeEnum boatType, Registration regiRequest);

    void removeBoatTypeFromRegiRequest(BoatTypeEnum boatType, Registration regiRequest);

    List<Registration> getHistoryRegistrationOfMember(Member member);

    List<Registration> getFutureRegistrationOfMember(Member member);

    boolean isRowerAllowToBeAddedToRegistration(LocalDate date, Member member, LocalTime startTime, LocalTime endTime);

    void addPrivateBoat(Member member, String serialNumBoat);

    List<Registration> getRegiListConfirmedAccordingMember(Member member);

    Members generateMembersToXml();

    Boats generateBoatsToXml();

    Activities generateActivitiesToXml();

    void cleanAllMembersBecauseImport();

    void cleanAllBoatsBecauseImport();

    void cleanAllWindowRegistarionBecauseImport();

    Registration[] getRegistrationByMember(Member member);

    String[] convertBoatsFromXml(String boatDetailsString);

    String[] convertMembersFromXml(String memberDetailsString);

    String[] convertWindowsFromXml(String activitiesDetailsString);

    String exportMembersToString();

    String exportBoatsToString();

    String exportActivitiesToString();

    List<Member> memberPartnersSuggestion(Member mainRower);

    boolean isMemberHasPrivateBoat(Member member);
}