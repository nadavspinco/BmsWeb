package Servlet;

import Objects.EmailAlreadyExistException;
import Objects.Member;
import Objects.SystemManagement;
import Utils.Constants;
import Utils.ServletUtils;
import Utils.SessionUtils;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.stream.Collectors;

@WebServlet(name = "ChangeEmailServlet", urlPatterns = "/changeEmail")
public class ChangeEmailServlet extends HttpServlet {
    private Gson gson = new Gson();

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        changeEmailServlet(req, resp);
    }

    public void changeEmailServlet(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            HttpSession session = req.getSession();
            if (session == null) {
                out.print(Constants.Error);// TODO MAKE TO REDIRECT TO HOME PAGE
                return;
            }

            String memberID = SessionUtils.getUserId(req);
            if (memberID == null || memberID.isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(Constants.Error);
                return;
            }

            Member member = systemManagement.getMemberByID(memberID);
            if (member == null){
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(Constants.Error);
                return;
            }
            resp.setStatus(HttpServletResponse.SC_OK);
            BufferedReader reader = req.getReader();
            String gsonString = reader.lines().collect(Collectors.joining());
            String newEmail = gson.fromJson(gsonString, String.class);

            //check if email is already exist in the system
            if(systemManagement.isEmailAlreadyExist(newEmail)){
                out.print(Constants.Existed_Email);
                return;
            }

            systemManagement.changeEmail(member, newEmail);

            String redirectUrlPage = member.getIsManager() ? Constants.ManagerPage : Constants.MemberPage;
            out.print(redirectUrlPage);
        }
        catch (IOException | EmailAlreadyExistException e) {
            e.getStackTrace();
        }
    }
}
