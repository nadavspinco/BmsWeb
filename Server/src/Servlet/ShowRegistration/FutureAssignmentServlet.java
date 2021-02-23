package Servlet.ShowRegistration;
import Objects.Member;
import Objects.Registration;
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
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet(name = "FutureAssignmentServlet", urlPatterns = "/futureAssignment")
public class FutureAssignmentServlet extends HttpServlet {
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        showFutureAssignment(req, resp);
    }

    public void showFutureAssignment(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());

            String memberID = SessionUtils.getUserId(req);
            if (memberID == null || memberID.isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(Constants.Error);
                return;
            }

            Member member = systemManagement.getMemberByID(memberID);
            List<Registration> regiList = systemManagement.getFutureRegistrationOfMember(member);
            String regiListJson = gson.toJson(regiList);

            resp.setStatus(HttpServletResponse.SC_OK);
            resp.setContentType("application/json");
            out.print(regiListJson);
        }
        catch (IOException e) {
            e.getStackTrace();
        }
    }
}
