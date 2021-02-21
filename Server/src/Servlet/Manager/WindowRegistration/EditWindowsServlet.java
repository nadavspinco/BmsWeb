package Servlet.Manager.WindowRegistration;
import java.time.LocalTime;

import Objects.SystemManagement;
import Objects.WindowRegistration;
import Utils.Constants;
import Utils.ServletUtils;
import com.google.gson.Gson;
import Enum.BoatTypeEnum;
import Logic.Enum.ActivityTypeEnum;
import com.google.gson.JsonParseException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.stream.Collectors;

@WebServlet(name = "EditWindowsServlet", urlPatterns = "/editActivity")
public class  EditWindowsServlet extends HttpServlet {
    private Gson gson = new Gson();

    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        editWindowRegistration(req, resp);
    }

    public void editWindowRegistration(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            BufferedReader reader = req.getReader();
            String gsonString = reader.lines().collect(Collectors.joining());
            WindowEditArgs dummyWindow = gson.fromJson(gsonString, WindowEditArgs.class);

            WindowRegistration window = systemManagement.getWindowRegistrationList().get(dummyWindow.index);

            LocalTime startTime = null, endTime = null;
            if (dummyWindow.startTime != null){
                startTime = LocalTime.parse(dummyWindow.startTime);
                endTime = LocalTime.parse(dummyWindow.endTime);
                systemManagement.changeWindowRegistrationTime(window, startTime, endTime);
            }

            if (dummyWindow.activityType)
                systemManagement.changeWindowRegistrationActivity(window);

            if (dummyWindow.boatType != 0){
                BoatTypeEnum boatType = BoatTypeEnum.convertFromInt(dummyWindow.boatType);
                systemManagement.changeBoatTypeToWindowRegistration(window,boatType);
            }

            resp.setStatus(HttpServletResponse.SC_OK);
            String redirectUrlPage = Constants.ManagerPage;
            out.print(redirectUrlPage);
        }
        catch (IOException | JsonParseException e) {
            e.getStackTrace();
        }
    }

    static class WindowEditArgs{
        private int index;
        private String startTime;
        private String endTime;
        private int boatType;
        private boolean activityType;
    }
}