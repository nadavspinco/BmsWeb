package Servlet.Manager.Assignments;

import Objects.*;
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

@WebServlet(name = "AssignmentsServlet",urlPatterns = "/assignments")
public class AssignmentsServlet extends HttpServlet {
    private Gson gson = new Gson();
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        assignBoat(req,resp);

    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("on AssignmentsServlet delete");
        deleteAssignment(req, resp);
    }

    private void deleteAssignment(HttpServletRequest req, HttpServletResponse resp) {
        SystemManagement systemManagement = (SystemManagement) getServletContext().getAttribute(Constants.SystemManagment);
        Response response = new Response();
        try(BufferedReader reader = req.getReader()){
            String jsonString = reader.lines().collect(Collectors.joining());
            DeleteAssignmentRequest request = gson.fromJson(jsonString, DeleteAssignmentRequest.class);
            System.out.println("after gson - delete option");
            systemManagement.removeAssignment(request.assignment,request.toDeleteRegistration);

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

        } catch (IOException e) {
            e.printStackTrace();
        }
        catch (InvalidAssignmentException e){
            response.errorCode = 2;//TODO: constans
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

    static class Response{
        int errorCode;
        String errorDetails;
        }


}
