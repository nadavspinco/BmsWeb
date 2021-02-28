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
import java.util.stream.Collectors;

@WebServlet(name = "AddRemoveBoatTypeServlet", urlPatterns = "/editBoatTypeInRegi")
public class AddRemoveBoatTypeServlet extends HttpServlet {
    private Gson gson = new Gson();

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        addBoatType(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        removeBoatType(req, resp);
    }

    private void removeBoatType(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());

            BufferedReader reader = req.getReader();
            String gsonString = reader.lines().collect(Collectors.joining());
            RegiAndBoatTypeArgs regiAndBoatTypeArgs = gson.fromJson(gsonString, RegiAndBoatTypeArgs.class);
            Registration regi = regiAndBoatTypeArgs.registration;
            int boatTypeIndex = regiAndBoatTypeArgs.boatTypeIndex + 1;
            BoatTypeEnum boatType = BoatTypeEnum.convertFromInt(boatTypeIndex);

            String memberID = SessionUtils.getUserId(req);
            if (memberID == null || memberID.isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                return;
            }
            Member mainMember = systemManagement.getMemberByID(memberID);

            boolean validBoatType = false;
            String urlToRedirect = null;
            if (regi.getBoatTypes().contains(boatType) && regi.getBoatTypes().size() != 1){
                systemManagement.removeBoatTypeFromRegiRequest(boatType, regi);
                validBoatType = true;
            }
            else    // the boat type isn't in the regi request
                urlToRedirect = Constants.Error;

            if (validBoatType)
                urlToRedirect = mainMember.getIsManager() ? Constants.ManagerPage : Constants.MemberPage;

            resp.setStatus(HttpServletResponse.SC_OK);
            resp.setContentType("application/json");
            out.print(urlToRedirect);
        }
        catch (IOException e) {
            e.getStackTrace();
        }
    }

    public void addBoatType(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());

            BufferedReader reader = req.getReader();
            String gsonString = reader.lines().collect(Collectors.joining());
            RegiAndBoatTypeArgs regiAndBoatTypeArgs = gson.fromJson(gsonString, RegiAndBoatTypeArgs.class);
            Registration regi = regiAndBoatTypeArgs.registration;
            int boatTypeIndex = regiAndBoatTypeArgs.boatTypeIndex + 1;
            BoatTypeEnum boatType = BoatTypeEnum.convertFromInt(boatTypeIndex);

            String memberID = SessionUtils.getUserId(req);
            if (memberID == null || memberID.isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                return;
            }
            Member mainMember = systemManagement.getMemberByID(memberID);

            boolean validBoatType = false;
            String urlToRedirect = null;
            if (!regi.getBoatTypes().contains(boatType)){
                systemManagement.addBoatTypeToRegiRequest(boatType, regi);
                validBoatType = true;
            }
            else    // the boat type is in the regi request
                urlToRedirect = Constants.Error;

            if (validBoatType)
                urlToRedirect = mainMember.getIsManager() ? Constants.ManagerPage : Constants.MemberPage;

            resp.setStatus(HttpServletResponse.SC_OK);
            resp.setContentType("application/json");
            out.print(urlToRedirect);
        }
        catch (IOException e) {
            e.getStackTrace();
        }
    }

    static class RegiAndBoatTypeArgs {
        private Registration registration;
        private int boatTypeIndex;
    }

}
