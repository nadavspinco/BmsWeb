package Servlet;

import Objects.*;

import Enum.BoatTypeEnum;
import Utils.Constants;
import Utils.ServletUtils;
import Utils.SessionUtils;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@WebServlet(name = "ValidateMembersServlet", urlPatterns = "/validateMembers")
public class ValidateMembersServlet extends HttpServlet {
    private Gson gson = new Gson();
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        validateMembers(req,resp);
    }

    private void validateMembers(HttpServletRequest req, HttpServletResponse resp) {
        Response response = new Response();
        HttpSession session = req.getSession();
        if (session == null) {
            return;
        }

        String memberID = SessionUtils.getUserId(req);
        if (memberID == null || memberID.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        SystemManagement systemManagement = ServletUtils.getSystemManagment(req.getServletContext());
        Member member = systemManagement.getMemberByID(memberID);
        try(BufferedReader reader = req.getReader()) {
            String objString = reader.lines().collect(Collectors.joining());
           RegistrationInput RegistrationInput = gson.fromJson(objString, RegistrationInput.class);
            if (RegistrationInput != null) {
                LocalDate localDate = LocalDate.parse(RegistrationInput.date);
                List<Member> memberList = new LinkedList<Member>();
                memberList.add(member);
                RegistrationInput.members.forEach(member1 -> memberList.add(member1));
                Set<BoatTypeEnum> boatTypeEnumSet = new HashSet<BoatTypeEnum>();
                RegistrationInput.boatTypes.forEach(boatTypeEnum -> boatTypeEnumSet.add(boatTypeEnum));
                WindowRegistration windowRegistration;
                if (RegistrationInput.fromWindowRegistration == false) {
                    windowRegistration = new WindowRegistration(LocalTime.parse(RegistrationInput.startTime), LocalTime.parse(RegistrationInput.endTime));
                } else {
                    windowRegistration = RegistrationInput.windowRegistration;
                }
                StringBuilder stringBuilder = new StringBuilder();

                Registration registrationToVailidate = new Registration(member, memberList, windowRegistration, localDate, boatTypeEnumSet);
                registrationToVailidate.getRowersListInBoat().forEach(member1 -> {
                    if (systemManagement.isRegistrationAllowedForMember(registrationToVailidate, member1) == false) {
                        response.errorCode = Constants.InvalidRegistrationForMembers;
                        stringBuilder.append("rower is not allowed for this registration " + member1.getNameMember());
                        stringBuilder.append("\n");
                    }
                });
                response.errorDetails = stringBuilder.toString();

            }


        } catch (JsonSyntaxException | IOException e){}
        finally {
            try (PrintWriter out = resp.getWriter()){
                String responseString = gson.toJson(response);
                out.write(responseString);
                out.flush();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

    }

    static class RegistrationInput {
        String date;
        WindowRegistration windowRegistration;
        LinkedList<Member> members;
        LinkedList<BoatTypeEnum> boatTypes;
        boolean fromWindowRegistration;
        String startTime;
        String endTime;
    }

    static class Response{
        int errorCode;
        String errorDetails;
    }
}
