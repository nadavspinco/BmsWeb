package Servlet;

import Objects.Member;
import Objects.Registration;
import Objects.SystemManagement;
import Utils.Constants;
import Utils.ServletUtils;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet(name = "AssigmentHistoryServlet",urlPatterns = "/fetchAssignmentHistory")
public class AssigmentHistoryServlet extends HttpServlet {
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        getAssignmentHistory(req,resp);
    }

    private void getAssignmentHistory(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            HttpSession session = req.getSession();
            if (session == null) {
                return; //
            }// TODO MAYBE SOMTHING ELSE
            String memberID = (String) session.getAttribute(Constants.USERID);
            Response response = new Response();

            if (memberID == null || memberID.isEmpty()) {
                response.errorDetails = "need to login";
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                String jsonString = gson.toJson(response);
                out.println(jsonString);
                return;
            }
            Member member = systemManagement.getMemberByID(memberID);
            if(member == null){
                response.errorDetails = "member is not found";
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                String jsonString = gson.toJson(response);
                out.println(jsonString);
                return;
            }
            List<Registration>  registrationList =systemManagement.getRegiListConfirmedAccordingMember(member);
            response.registrationList = registrationList.toArray(new Registration[0]);
            String jsonString = gson.toJson(response,Response.class);
            System.out.println(jsonString);
            out.println(jsonString);
            out.flush();
    } catch (IOException e) {
            e.printStackTrace();
        }

    }
static class Response{
        boolean Succeeded;
        int errorCode;
    String errorDetails;
    Registration [] registrationList;

}

}
