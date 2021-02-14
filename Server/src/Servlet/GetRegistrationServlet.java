package Servlet;

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

@WebServlet(name = "GetRegistrationServlet" ,urlPatterns = "/registrationByDays")
public class GetRegistrationServlet extends HttpServlet {
    private Gson gson = new Gson();
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        getRegistrationByDays(req,resp);
    }

    private void getRegistrationByDays(HttpServletRequest req, HttpServletResponse resp) {
        Response response = new Response();
        try(BufferedReader bufferedReader = req.getReader()){
            String jsonString = bufferedReader.lines().collect(Collectors.joining());
            Request request = gson.fromJson(jsonString,Request.class);
            if(request.amountOfDays <=0){
                response.errorCode = 2;//TODO:
            }
            else {
               SystemManagement systemManagement= (SystemManagement) getServletContext().getAttribute(Constants.SystemManagment);
               response.registrations = systemManagement.getMainRegistrationByDays(request.amountOfDays);

            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        finally {
            try(PrintWriter out =resp.getWriter()) {
                String jsonStringResponse = gson.toJson(response);
                out.write(jsonStringResponse);
                out.flush();

            } catch (IOException e) {
                e.printStackTrace();
            }
        }

    }

    static class Request{
        int amountOfDays;
    }

    static class Response{
        int errorCode;
        String errorDetails;
        Registration[] registrations;
    }
}
