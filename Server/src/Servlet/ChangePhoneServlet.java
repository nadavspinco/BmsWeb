package Servlet;

import Objects.Member;

import Objects.SystemManagement;
import Utils.SessionUtils;
import com.google.gson.Gson;

import Utils.Constants;
import Utils.ServletUtils;

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

@WebServlet(name = "ChangePhoneServlet", urlPatterns = "/changePhone")
public class ChangePhoneServlet extends HttpServlet {
    private Gson gson = new Gson();

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        changePhoneServlet(req, resp);
    }

    public void changePhoneServlet(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            HttpSession session = req.getSession();
            if (session == null) {
                out.print(Constants.Error);
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
            String phoneNum = gson.fromJson(gsonString, String.class);
            systemManagement.changePhoneNumber(member, phoneNum);
            String redirectUrlPage = member.getIsManager() ? Constants.ManagerPage : Constants.MemberPage;
            out.print(redirectUrlPage);
        }
        catch (IOException e) {
            e.getStackTrace();
        }
    }
}
