package Servlet;


import Objects.Member;
import Objects.SystemManagement;
import Utils.Constants;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.stream.Collectors;

import Utils.ServletUtils;
import com.google.gson.Gson;

@WebServlet(name = "LoginServlet", urlPatterns = "/login")
public class LoginServlet extends HttpServlet {
 private Gson gson = new Gson();
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp){
       processLoginRequest(req, resp);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.sendRedirect("index.html");
    }

    private void checkLoggedIn(HttpServletRequest request, HttpServletResponse response) {
        try (PrintWriter out = response.getWriter()){
           SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());

        }catch (IOException e){
            e.getStackTrace();
        }
    }

    private void processLoginRequest(HttpServletRequest request, HttpServletResponse response){
        try(PrintWriter out = response.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
           System.out.println(systemManagement);
            BufferedReader reader = request.getReader();
            String gsonString = reader.lines().collect(Collectors.joining());
            LoginArgs loginArgs = gson.fromJson(gsonString, LoginArgs.class);
            String email = loginArgs.email;
            String password = loginArgs.pass;
            Member loggedInMember = systemManagement.loginMember(email, password);


            if (loggedInMember != null){
                response.setStatus(HttpServletResponse.SC_OK);
                request.getSession(true).setAttribute(Constants.USERID, loggedInMember.getSerial());
                String redirectUrlPage = loggedInMember.getIsManager() ? Constants.MANAGERPAGE : Constants.MEMBERPAGE;
                out.print(redirectUrlPage);
            }
            else {  // logged in dined
                response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
                out.print("Incorrect email or password, try again");
            }
        }
        catch (IOException e){
            e.getStackTrace();
        }
    }

    static class LoginArgs{
        private String email;
        private String pass;
    }
}
