package Servlet.Manager.ManageBoat;
import Objects.Boat;
import Objects.Member;
import Objects.SystemManagement;
import Utils.Constants;
import Utils.ServletUtils;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.stream.Collectors;

@WebServlet(name = "EditBoatServlet", urlPatterns = "/editBoat")
public class EditBoatServlet extends HttpServlet {
    private Gson gson = new Gson();

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        editBoat(req, resp);
    }

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        fixBoat(req, resp);
    }

    private void fixBoat(HttpServletRequest req, HttpServletResponse resp){
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            String redirectUrlPage;
            BufferedReader reader = req.getReader();
            String gsonString = reader.lines().collect(Collectors.joining());
            int boatIndex = gson.fromJson(gsonString, int.class);

            Boat boat = systemManagement.getBoatList().get(boatIndex);
            redirectUrlPage = boat.isAvailable() ? Constants.Error : Constants.ManagerPage;

            systemManagement.fixBoat(boat);
            resp.setStatus(HttpServletResponse.SC_OK);
            out.print(redirectUrlPage);
        }
        catch (IOException e) {
            e.getStackTrace();
        }
    }

    public void editBoat(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            String redirectUrlPage;
            BufferedReader reader = req.getReader();
            String gsonString = reader.lines().collect(Collectors.joining());
            EditBoatArgs boatArgs = gson.fromJson(gsonString, EditBoatArgs.class);

            Boat boat = systemManagement.getBoatList().get(boatArgs.index);
            redirectUrlPage = (boat.isAvailable() == false && boatArgs.disableBoat == true)  ? Constants.Error : Constants.ManagerPage;

            if (boatArgs.name != null)
                systemManagement.updateBoatName(boat, boatArgs.name);
            if (boatArgs.isWidth)
                systemManagement.updateIsWide(boat);
            if (boatArgs.isCoastal)
                systemManagement.updateIsCoastal(boat);
            if (boatArgs.disableBoat)
                systemManagement.disAbleBoat(boat);

            resp.setStatus(HttpServletResponse.SC_OK);
            out.print(redirectUrlPage);
        }
        catch (IOException e) {
            e.getStackTrace();
        }
    }

    static class EditBoatArgs{
        private int index;
        private String name;
        private boolean isWidth;
        private boolean isCoastal;
        private boolean disableBoat;
    }
}
