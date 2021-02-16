package Servlet.Manager.Assignments;

import Objects.Assignment;
import Objects.SystemManagement;
import Utils.Constants;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.LocalTime;

@WebServlet(name="AssignmentsByDates",urlPatterns = "/assignmentByDate")
public class AssignmentsByDates extends HttpServlet {
    private Gson gson = new Gson();
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        getRegistrationByDate(req,resp);
    }

    private void getRegistrationByDate(HttpServletRequest req, HttpServletResponse resp) {
        String dateString =req.getParameter("date");
        SystemManagement systemManagement = (SystemManagement) getServletContext().getAttribute(Constants.SystemManagment);
        LocalDate date = LocalDate.parse(dateString);
        Response response = new Response();
        response.assignments = systemManagement.getAssignmentByDate(date);
        String responseString = gson.toJson(response);
        try(PrintWriter out = resp.getWriter()){
            out.print(responseString);
            out.flush();
            System.out.println(responseString);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    static class Response{
        int errorCode;
        String errorDetails;
        Assignment [] assignments;
    }
}
