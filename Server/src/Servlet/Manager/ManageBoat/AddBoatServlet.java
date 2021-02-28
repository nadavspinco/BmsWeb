package Servlet.Manager.ManageBoat;
import Enum.BoatTypeEnum;
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
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.stream.Collectors;

@WebServlet(name = "AddBoatServlet", urlPatterns = "/addBoat")
public class AddBoatServlet extends HttpServlet {
    private Gson gson = new Gson();

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        AddBoatServlet(req, resp);
    }

    public void AddBoatServlet(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            HttpSession session = req.getSession();
            if (session == null) {
                out.print(Constants.Error);
                return;
            }

            BufferedReader reader = req.getReader();
            String gsonString = reader.lines().collect(Collectors.joining());
            BoatArgs boatArgs = gson.fromJson(gsonString, BoatArgs.class);
            String name = boatArgs.name;
            String serial = boatArgs.serial;
            boolean isCoastal = boatArgs.coastal;
            boolean isWide = boatArgs.wide;
            BoatTypeEnum boatType = BoatTypeEnum.convertFromInt(boatArgs.boatType);

            if(systemManagement.isBoatExistBySerial(serial)){
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(Constants.Existed_Serial);
                return;
            }

            resp.setStatus(HttpServletResponse.SC_OK);
            systemManagement.addBoat(name, boatType, isCoastal, isWide, serial);
            String redirectUrlPage = Constants.ManagerPage;
            out.print(redirectUrlPage);
        }
        catch (IOException e) {
            e.getStackTrace();
        }
    }

    static class BoatArgs{
        private String name;
        private String serial;
        private boolean coastal;
        private boolean wide;
        private int boatType;
    }
}