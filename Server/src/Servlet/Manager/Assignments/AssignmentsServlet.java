package Servlet.Manager.Assignments;

import Objects.*;
import Utils.Constants;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.stream.Collectors;

@WebServlet(name = "AssignmentsServlet",urlPatterns = "/assignments")
public class AssignmentsServlet extends HttpServlet {
    private Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        assignBoat(req,resp);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        deleteAssignment(req, resp);
    }

    private void deleteAssignment(HttpServletRequest req, HttpServletResponse resp) {
        SystemManagement systemManagement = (SystemManagement) getServletContext().getAttribute(Constants.SystemManagment);
        Response response = new Response();
        try(BufferedReader reader = req.getReader()){
            String jsonString = reader.lines().collect(Collectors.joining());
            DeleteAssignmentRequest request = gson.fromJson(jsonString, DeleteAssignmentRequest.class);
            systemManagement.removeAssignment(request.assignment,request.toDeleteRegistration);
            NotificationManager notificationManager = (NotificationManager) getServletContext().getAttribute(Constants.NotificationManager);
            request.assignment.getRegistration().getRowersListInBoat().forEach(member ->
                    notificationManager.addPrivateNotification
                            (member,NotificationMessages.getNewAssignmentHeader(request.assignment.getRegistration()),
                                    NotificationMessages.getAssignmentMessage(request.assignment.getRegistration(),request.assignment.getBoat())));

        } catch (IOException e) {
            e.printStackTrace();
        }
        finally {
            try(PrintWriter out = resp.getWriter()) {
                String responseString = gson.toJson(response);
                out.print(responseString);
                out.flush();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private void assignBoat(HttpServletRequest req, HttpServletResponse resp) {
        SystemManagement systemManagement = (SystemManagement) getServletContext().getAttribute(Constants.SystemManagment);
        Response response = new Response();
        try(BufferedReader reader = req.getReader()){
            String jsonString = reader.lines().collect(Collectors.joining());
            AssignBoatRequest request = gson.fromJson(jsonString, AssignBoatRequest.class);
            systemManagement.assignBoat(request.registration,request.boat);
            NotificationManager notificationManager = (NotificationManager) getServletContext().getAttribute(Constants.NotificationManager);
            request.registration.getRowersListInBoat().forEach(member ->
                    notificationManager.addPrivateNotification
                            (member,NotificationMessages.getNewAssignmentHeader(request.registration),
                                    NotificationMessages.getAssignmentMessage(request.registration,request.boat)));

        } catch (IOException e) {
            e.printStackTrace();
        }
        catch (InvalidAssignmentException e){
            response.errorCode = 2;
            response.errorDetails = "InvalidAssignmentException";
        }
        finally {
            try(PrintWriter out = resp.getWriter()) {
                String responseString = gson.toJson(response);
                out.print(responseString);
                out.flush();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }



    static class DeleteAssignmentRequest{
        Assignment assignment;
        boolean toDeleteRegistration;
    }
    static class AssignBoatRequest {
        Registration registration;
        Boat boat;
    }

    static class unionAssignmentRequest{
        Assignment assignment;
        Registration registration;
    }

    static class Response{
        int errorCode;
        String errorDetails;
        }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        unionAssinmentAndRegistration(req,resp);
    }

    private void unionAssinmentAndRegistration(HttpServletRequest req, HttpServletResponse resp) {
        SystemManagement systemManagement = (SystemManagement) getServletContext().getAttribute(Constants.SystemManagment);

        Response response = new Response();
        try(BufferedReader reader = req.getReader()){
            String jsonString = reader.lines().collect(Collectors.joining());
            unionAssignmentRequest request = gson.fromJson(jsonString, unionAssignmentRequest.class);

            systemManagement.unionRequestToAssignment(request.assignment, request.registration);
            NotificationManager notificationManager = (NotificationManager) getServletContext().getAttribute(Constants.NotificationManager);
            request.registration.getRowersListInBoat().forEach(member ->
                    notificationManager.addPrivateNotification
                            (member,NotificationMessages.getNewAssignmentHeader(request.registration),
                                    NotificationMessages.getAssignmentMessage(request.registration,request.assignment.getBoat())));

        }
        catch (JsonSyntaxException | IOException e) {
            e.printStackTrace();
        }

        finally {
            try(PrintWriter out = resp.getWriter()) {
                String responseString = gson.toJson(response);
                out.print(responseString);
                out.flush();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
