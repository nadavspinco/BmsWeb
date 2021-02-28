package Servlet;

import Objects.SystemManagement;
import Objects.WindowRegistration;
import Objects.Member;
import Objects.Registration;
import Objects.InvalidRegistrationException;
import Utils.Constants;
import Utils.ServletUtils;

import Utils.SessionUtils;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import Enum.BoatTypeEnum;


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
import java.util.*;
import java.util.stream.Collectors;

@WebServlet(name = "AddRegistrationServlet",urlPatterns = "/addRegistration")
public class AddRegistrationServlet extends HttpServlet {
private Gson gson = new Gson();
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        addRegistration(req,resp);

    }

    private void addRegistration(HttpServletRequest req, HttpServletResponse resp) {
        Response response = new Response();
        HttpSession session = req.getSession();
        if (session == null) {
            // TODO MAKE TO REDIRECT TO HOME PAGE
            return;
        }

        String memberID = SessionUtils.getUserId(req);
        if (memberID == null || memberID.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            // TODO MAKE TO REDIRECT TO HOME PAGE
            return;
        }
        SystemManagement systemManagement = ServletUtils.getSystemManagment(req.getServletContext());
        Member member = systemManagement.getMemberByID(memberID);
        try(BufferedReader reader = req.getReader()){
            String objString = reader.lines().collect(Collectors.joining());
            System.out.println(objString);
            RegistrationInput RegistrationInput = gson.fromJson(objString, RegistrationInput.class);
            System.out.println(objString);
            //  LocalDate localDate  = LocalDate.parse(date);


            // System.out.println("loacal date: " + localDate);
            if(RegistrationInput != null){
                System.out.println("gson worked!");
                LocalDate localDate  = LocalDate.parse(RegistrationInput.date);
                List<Member> memberList = new LinkedList<Member>();
                memberList.add(member);
                RegistrationInput.members.forEach(member1 -> memberList.add(member1));

                Set<BoatTypeEnum > boatTypeEnumSet = new HashSet<BoatTypeEnum>();
                RegistrationInput.boatTypes.forEach(boatTypeEnum -> boatTypeEnumSet.add(boatTypeEnum));
                int maxCapacity = BoatTypeEnum.biggestBoatSize(boatTypeEnumSet);
                if (maxCapacity < memberList.size()){
                    response.errorCode = Constants.InvalidCapacityRegistration;
                    return;
                }

                WindowRegistration windowRegistration;
                if(RegistrationInput.fromWindowRegistration == false){
                     windowRegistration = new WindowRegistration(LocalTime.parse(RegistrationInput.startTime),LocalTime.parse(RegistrationInput.endTime));
                }
                else {
                    windowRegistration = RegistrationInput.windowRegistration;
                }

                Registration registrationToAdd = new Registration(member,memberList, windowRegistration,localDate,boatTypeEnumSet);
                systemManagement.addRegistration(registrationToAdd,true);

            }
            else {
                System.out.println("bad");
            }
        }
        catch (JsonSyntaxException e)
        {
            System.out.println("failed gson");
        }
        catch (InvalidRegistrationException e){
            //TODO:
            System.out.println("InvalidRegistrationException ");
            response.errorCode = Constants.InvalidRegistration;

        } catch (IOException e) {
            e.printStackTrace();
        }
        finally {
            try (PrintWriter out = resp.getWriter()){
                String responseString = gson.toJson(response);
                System.out.println(responseString);
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
        LinkedList<Member>  members;
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
