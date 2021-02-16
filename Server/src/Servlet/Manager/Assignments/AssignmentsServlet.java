package Servlet.Manager.Assignments;

import Objects.Boat;
import Objects.InvalidAssignmentException;
import Objects.Registration;
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

@WebServlet(name = "AssignmentsServlet",urlPatterns = "/assignBoat")
public class AssignmentsServlet extends HttpServlet {
    private Gson gson = new Gson();
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        assignBoat(req,resp);

    }

    private void assignBoat(HttpServletRequest req, HttpServletResponse resp) {
        SystemManagement systemManagement = (SystemManagement) getServletContext().getAttribute(Constants.SystemManagment);
        Response response = new Response();
        try(BufferedReader reader = req.getReader()){
            String jsonString = reader.lines().collect(Collectors.joining());
            Request request = gson.fromJson(jsonString,Request.class);
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
    static class Request{
        Registration registration;
        Boat boat;
    }

    static class Response{
        int errorCode;
        String errorDetails;
        }


}