package Servlet;

import Objects.Member;

import Objects.SystemManagement;
import com.google.gson.Gson;

import Utils.Constants;
import Utils.ServletUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "ChangePhoneServlet", urlPatterns = "/changePhone")
public class ChangePhoneServlet extends HttpServlet {
    private Gson gson = new Gson();

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ChangePhoneServlet(req, resp);
    }

    public void ChangePhoneServlet(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            HttpSession session = req.getSession();
            if (session == null) {
                return; //
            }// TODO MAYBE SOMTHING ELSE
            String memberID = (String) session.getAttribute(Constants.USERID);
            ChangePhoneServletResponse servletResponse = new ChangePhoneServletResponse();
            if (memberID == null || memberID.isEmpty()) {
                servletResponse.errorDetails = "need to login";
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                String jsonString = gson.toJson(servletResponse);
                out.println(servletResponse);
                return;
            }
            Member member = systemManagement.getMemberByID(memberID);

            if (member == null){
                servletResponse.errorDetails = "member is deleted";
                String jsonString = gson.toJson(servletResponse);
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.println(servletResponse);
                return;
            }//TODO MAYBE SOMTHING ELSE

            resp.setStatus(HttpServletResponse.SC_OK);
            String phoneNum = (String) ServletUtils.readJsonObj(req.getReader(),String.class);
            System.out.println("before" +member.getPhoneNumber());
            systemManagement.changePhoneNumber(member, phoneNum);
            System.out.println("after" +member.getPhoneNumber());
            out.println(servletResponse);
        } catch (IOException e) {
            e.getStackTrace();
        }
    }
        static class ChangePhoneServletResponse {
           private String errorDetails;
        }
}
