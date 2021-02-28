package Servlet;
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
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.stream.Collectors;

@WebServlet(name = "ManageRegistrationServlet", urlPatterns = "/manageRegistration")
public class ManageRegistrationServlet extends HttpServlet {
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        showRegistration(req, resp);
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        removeRegistration(req, resp);
    }

    public void showRegistration(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());

            String memberID = SessionUtils.getUserId(req);
            if (memberID == null || memberID.isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(Constants.Error);
                return;
            }

            Member member = systemManagement.getMemberByID(memberID);
            Registration[] regiList;
            if (member.getIsManager())
                regiList = systemManagement.getMainRegistrationByDays(7);
            else
                regiList = systemManagement.getRegistrationByMember(member);

            String regiListJson = gson.toJson(Arrays.asList(regiList));

            resp.setStatus(HttpServletResponse.SC_OK);
            resp.setContentType("application/json");
            out.print(regiListJson);
        }
        catch (IOException e) {
            e.getStackTrace();
        }
    }

    public void removeRegistration(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());

            BufferedReader reader = req.getReader();
            String gsonString = reader.lines().collect(Collectors.joining());
            Registration registration = gson.fromJson(gsonString, Registration.class);

            String memberID = SessionUtils.getUserId(req);
            if (memberID == null || memberID.isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                return;
            }
            Member mainMember = systemManagement.getMemberByID(memberID);

            resp.setStatus(HttpServletResponse.SC_OK);
            systemManagement.removeRegistrationRequestByMember(registration);
            String redirectUrlPage = mainMember.getIsManager() ? Constants.ManagerPage : Constants.MemberPage;
            out.print(redirectUrlPage);
        }
        catch (IOException e) {
            e.getStackTrace();
        }
    }
}
