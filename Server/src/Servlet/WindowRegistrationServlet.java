package Servlet;

import Objects.SystemManagement;
import Objects.WindowRegistration;
import Utils.ServletUtils;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "WindowRegistrationServlet",urlPatterns = "/windowRegistration")
public class WindowRegistrationServlet extends HttpServlet {
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        getAllWindowWindowRegistration(req,resp);
    }

    private void  getAllWindowWindowRegistration(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try(PrintWriter out = resp.getWriter()){
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            WindowRegistration [] windowRegistrations = systemManagement.getWindowRegistrations();
            Response response = new Response();
            response.windowRegistrations =windowRegistrations;
            String responseString = gson.toJson(response,Response.class);
            System.out.println(responseString);
            out.write(responseString);
        }
    }
    static class Response {
        int errorCode;
        String errorDetails;
        WindowRegistration [] windowRegistrations;
    }
}
