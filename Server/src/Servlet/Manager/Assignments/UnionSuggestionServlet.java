package Servlet.Manager.Assignments;

import Objects.Assignment;
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

@WebServlet(name = "UnionSuggestionServlet",urlPatterns = "/unionSuggestion")
public class UnionSuggestionServlet extends HttpServlet {
    private Gson gson =  new Gson();
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        getUnionSuggestion(req,resp);
    }

    private void getUnionSuggestion(HttpServletRequest req, HttpServletResponse resp) {
        SystemManagement systemManagement = (SystemManagement) getServletContext().getAttribute(Constants.SystemManagment);
        Response response = new Response();
        try (BufferedReader reader = req.getReader()){
            String requestString =  reader.lines().collect(Collectors.joining());
            Request request = gson.fromJson(requestString,Request.class);
            response.registrations = systemManagement.getValidRegistrationToUnion(request.assignment);

        } catch (IOException e) {
            e.printStackTrace();
        }
        finally {
            try(PrintWriter out = resp.getWriter()){
                String responseString = gson.toJson(response);
                out.write(responseString);
                out.flush();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

    }
    static class Request{
        Assignment assignment;
    }

static class Response{
        int errorCode;
    String errorDetails;
    Registration[] registrations;
}
}
