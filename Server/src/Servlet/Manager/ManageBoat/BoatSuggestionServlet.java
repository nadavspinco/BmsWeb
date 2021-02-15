package Servlet.Manager.ManageBoat;

import Objects.Boat;
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

@WebServlet (name = "BoatSuggestionServlet", urlPatterns = "/boatSuggestion")
public class BoatSuggestionServlet extends HttpServlet {
    private Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("BoatSuggestionServlet");
        getBoatSuggestion(req,resp);
    }

    private void getBoatSuggestion(HttpServletRequest req, HttpServletResponse resp) {
        SystemManagement systemManagement = (SystemManagement) getServletContext().getAttribute(Constants.SystemManagment);
        Response response = new Response();
        try(BufferedReader reader = req.getReader()){
            String jsonString = reader.lines().collect(Collectors.joining());
            System.out.println(jsonString);
            Request request = gson.fromJson(jsonString,Request.class);
            if(request != null)
            {
                System.out.println("not null");
                Boat []  boats=systemManagement.getArrayOfValidBoats(request.registration);
                System.out.println("after getArrayOfValidBoats");
                response.boats = boats;
                System.out.println("after getArrayOfValidBoats");
            }
            else {
                System.out.println("gson gave us null");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        try(PrintWriter out =resp.getWriter()){
            String stringResponse = gson.toJson(response);
            out.write(stringResponse);
            out.flush();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    static class Request{
        Registration registration;
    }

    static class Response{
        int errorCode;
        String errorDetails;
        Boat [] boats;
    }

}
