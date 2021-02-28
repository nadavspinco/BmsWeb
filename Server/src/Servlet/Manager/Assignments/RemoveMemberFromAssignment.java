package Servlet.Manager.Assignments;

import Objects.Assignment;
import Objects.NotificationManager;
import Objects.NotificationMessages;
import Objects.SystemManagement;
import Utils.Constants;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.stream.Collectors;

@WebServlet(name = "RemoveMemberFromAssignment",urlPatterns = "/removeMemberFromAssignment")
public class RemoveMemberFromAssignment extends HttpServlet {
    private Gson gson = new Gson();
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        removeMemberFromAssignment(req, resp);
    }

    private void removeMemberFromAssignment(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SystemManagement systemManagement = (SystemManagement) getServletContext().getAttribute(Constants.SystemManagment);
        Response response = new Response();
        try (BufferedReader reader = req.getReader()) {
            String jsonString = reader.lines().collect(Collectors.joining());
            System.out.println(jsonString);
            Request request = gson.fromJson(jsonString, Request.class);
            systemManagement.removeMemberFromAssigment(request.assignment, request.member,request.toSplitRegistration );
            NotificationManager notificationManager = (NotificationManager) getServletContext().getAttribute(Constants.NotificationManager);
                    notificationManager.addPrivateNotification
                            (request.member, NotificationMessages.getDeleteAssignmentHeader(request.assignment),"you are no longer belong to this assignment");
        }
        finally {
            try(PrintWriter out =resp.getWriter()){
                String responseString = gson.toJson(response);
                out.write(responseString);
                out.flush();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

    }
    static class Response{
        int errorCode;
        String errorDetails;
    }
    static class Request{
        Assignment assignment;
        Objects.Member member;
        boolean toSplitRegistration;
    }
}
