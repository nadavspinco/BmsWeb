package Servlet.Manager.WindowRegistration;
import java.time.LocalTime;

import Objects.Boat;
import Objects.Member;
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
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@WebServlet(name = "WindowRegistrationServlet", urlPatterns = "/addWindowRegistration")
public class  WindowRegistrationServlet extends HttpServlet {
    private Gson gson = new Gson();

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        AddWindowRegistration(req, resp);
    }

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        showWindowRegistration(req, resp);
    }

    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        removeWindowRegistration(req, resp);
    }

    public void AddWindowRegistration(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            HttpSession session = req.getSession();

            BufferedReader reader = req.getReader();
            String gsonString = reader.lines().collect(Collectors.joining());
            WindowArgs window = gson.fromJson(gsonString, WindowArgs.class);
            LocalTime startTime = LocalTime.parse(window.startTime);
            LocalTime endTime = LocalTime.parse(window.endTime);

            BoatTypeEnum boatType;
            ActivityTypeEnum activityType;
            boatType = window.boatType == 0 ? null : BoatTypeEnum.convertFromInt(window.boatType);
            activityType = ActivityTypeEnum.convertFromInt(window.activityType);

            resp.setStatus(HttpServletResponse.SC_OK);
            WindowRegistration newWindow = new WindowRegistration(activityType, boatType, startTime,endTime);
            systemManagement.addWindowRegistration(newWindow);
            String redirectUrlPage = "managerMenu.html";
            out.print(redirectUrlPage);
        }
        catch (IOException | JsonParseException e) {
            e.getStackTrace();
        }
    }

    public void removeWindowRegistration(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            List<WindowRegistration> windowList = systemManagement.getWindowRegistrationList();
            BufferedReader reader = req.getReader();
            String gsonString = reader.lines().collect(Collectors.joining());
            int windowIndex = gson.fromJson(gsonString, int.class);

            resp.setStatus(HttpServletResponse.SC_OK);
            systemManagement.deleteWindowRegistration(windowList.get(windowIndex));
            String redirectUrlPage = "managerMenu.html";
            out.print(redirectUrlPage);
        }
        catch (IOException e) {
            e.getStackTrace();
        }
    }

    public void showWindowRegistration(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            List<WindowRegistration> windowsList = systemManagement.getWindowRegistrationList();

            List <dummyWindowToJS> dummyWindowListToJs = new ArrayList<>();
            for (WindowRegistration window : windowsList){
                dummyWindowToJS newWindow = new dummyWindowToJS();
                newWindow.startTime = window.getStartTime().toString();
                newWindow.endTime = window.getEndTime().toString();
                newWindow.boatType = window.getBoatType();
                newWindow.activityType = window.getActivityType();
                dummyWindowListToJs.add(newWindow);
            }

            String windowsListJson = gson.toJson(dummyWindowListToJs);
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.setContentType("application/json");
            out.print(windowsListJson);
        }
        catch (IOException e) {
            e.getStackTrace();
        }
    }

    static class WindowArgs{
        private String startTime;
        private String endTime;
        private int boatType;
        private int activityType;
    }

    static class dummyWindowToJS{
        private String startTime;
        private String endTime;
        private BoatTypeEnum boatType;
        private ActivityTypeEnum activityType;
    }
}