package Servlet.EditRegistration;
import Objects.Member;
import Objects.Registration;
import Objects.SystemManagement;
import Utils.Constants;
import Utils.ServletUtils;
import Utils.SessionUtils;
import com.google.gson.Gson;
import Enum.BoatTypeEnum;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.stream.Collectors;

@WebServlet(name = "AddRemoveRower", urlPatterns = "/editRegistration")
public class AddRemoveRowerServlet extends HttpServlet {
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        getRowers(req, resp);
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        addRower(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        removeRower(req, resp);
    }

    private void removeRower(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());

            BufferedReader reader = req.getReader();
            String gsonString = reader.lines().collect(Collectors.joining());
            RegiAndRowerArgs regiAndRowerArgs = gson.fromJson(gsonString, RegiAndRowerArgs.class);
            Registration regi = regiAndRowerArgs.registration;
            Member member = regiAndRowerArgs.rower;
            int min = BoatTypeEnum.smallestBoatSize(regi.getBoatTypesSet());

            String memberID = SessionUtils.getUserId(req);
            if (memberID == null || memberID.isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                return;
            }
            Member mainMember = systemManagement.getMemberByID(memberID);

            boolean validRower = false;
            String urlToRedirect = null;
            if (!regi.getRowersListInBoat().contains(member)) // choosen a rower who is not part of the registration
                urlToRedirect = Constants.Error;
            else if (regi.getRowersListInBoat().size() > 1){
                systemManagement.removeRowerSpecificFromRegiRequest(member,regi,false);
                validRower = true;
            }
            else
                urlToRedirect = Constants.ErrorCapacity;

            if (validRower)
                urlToRedirect = mainMember.getIsManager() ? Constants.ManagerPage : Constants.MemberPage;

            resp.setStatus(HttpServletResponse.SC_OK);
            resp.setContentType("application/json");
            out.print(urlToRedirect);
        }
        catch (IOException e) {
            e.getStackTrace();
        }
    }

    public void getRowers(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());

            List<Member> memberList = systemManagement.getMemberList();
            String memberListJson = gson.toJson(memberList);

            resp.setStatus(HttpServletResponse.SC_OK);
            resp.setContentType("application/json");
            out.print(memberListJson);
        }
        catch (IOException e) {
            e.getStackTrace();
        }
    }

    public void addRower(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());

            BufferedReader reader = req.getReader();
            String gsonString = reader.lines().collect(Collectors.joining());
            RegiAndRowerArgs regiAndRowerArgs = gson.fromJson(gsonString, RegiAndRowerArgs.class);
            Registration regi = regiAndRowerArgs.registration;
            Member member = regiAndRowerArgs.rower;
            int max = BoatTypeEnum.biggestBoatSize(regi.getBoatTypesSet());

            String memberID = SessionUtils.getUserId(req);
            if (memberID == null || memberID.isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                return;
            }
            Member mainMember = systemManagement.getMemberByID(memberID);

            boolean validRower = false;
            String urlToRedirect = null;
            if (regi.getRowersListInBoat().contains(member)){
                urlToRedirect = Constants.Error;
            }
            else if (regi.getRowersListInBoat().size() < max){
                if (systemManagement.isRowerAllowToBeAddedToRegistration(regi.getActivityDate().toLocalDate(), member,
                        regi.getWindowRegistration().getStartTime(), regi.getWindowRegistration().getStartTime())){
                    systemManagement.addRowerToRegiRequest(member,regi);
                    validRower = true;
                }
                else
                    urlToRedirect = Constants.OverlappingMember;
            }
            else
                urlToRedirect = Constants.ErrorCapacity;

            if (validRower)
                urlToRedirect = mainMember.getIsManager() ? Constants.ManagerPage : Constants.MemberPage;

            resp.setStatus(HttpServletResponse.SC_OK);
            resp.setContentType("application/json");
            out.print(urlToRedirect);
        }
        catch (IOException e) {
            e.getStackTrace();
        }
    }

    static class RegiAndRowerArgs {
        private Registration registration;
        private Member rower;
    }

}
