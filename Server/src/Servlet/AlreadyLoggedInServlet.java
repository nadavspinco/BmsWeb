package Servlet;

import Objects.Member;
import Objects.SystemManagement;
import Utils.Constants;
import Utils.ServletUtils;
import Utils.SessionUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "AlreadyLoggedInServlet", urlPatterns = "/alreadyLoggedIn")
public class AlreadyLoggedInServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        checkIfAlreadyLoggedIn(req,resp);
    }

    private void checkIfAlreadyLoggedIn(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String toReturnString = "";
        HttpSession session = req.getSession();
        if (session == null) {
            writeResponse(resp,toReturnString);
            return;
        }
        String memberID = SessionUtils.getUserId(req);
        if (memberID == null || memberID.isEmpty()) {
            writeResponse(resp,toReturnString);
            return;
        }
        SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
        Member member = systemManagement.getMemberByID(memberID);
        if(member != null){
            if(member.getIsManager()){
               resp.sendRedirect(Constants.Manager_Page);
                System.out.println("redirect to Manager_Page");
            }
            else {
                resp.sendRedirect(Constants.Member_Page);
                System.out.println("redirect to Member_Page");
            }
        }

        writeResponse(resp,toReturnString);
    }

    private void writeResponse(HttpServletResponse resp,String responseString){
        try(PrintWriter out = resp.getWriter()) {
            out.print(responseString);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
