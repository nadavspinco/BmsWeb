package Servlet;

import Objects.Member;
import Objects.NotificationManager;
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
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.util.stream.Collectors;
@WebServlet(name = "LastUpdatedNotifications" ,urlPatterns = "/lastUpdatedNotifications")
public class LastUpdatedNotifications extends HttpServlet {
private Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("in LastUpdatedNotifications");
        getLastUpdated(req,resp);
    }

    private void getLastUpdated(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession();
        if (session == null) {
            // TODO MAKE TO REDIRECT TO HOME PAGE
            return;
        }

        String memberID = SessionUtils.getUserId(req);
        if (memberID == null || memberID.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            // TODO MAKE TO REDIRECT TO HOME PAGE
            return;
        }
        SystemManagement systemManagement = ServletUtils.getSystemManagment(req.getServletContext());
        Member member = systemManagement.getMemberByID(memberID);
        String localDateTimeString;
        try(BufferedReader bufferedReader = req.getReader()) {
            localDateTimeString = bufferedReader.lines().collect(Collectors.joining());
        }
        LocalDateTime lastUpdated = gson.fromJson(localDateTimeString,LocalDateTime.class);

        System.out.println("here!!!");
        NotificationManager notificationManager = (NotificationManager) getServletContext().getAttribute(Constants.NotificationManager);
        NotificationsServlet.Response response = new NotificationsServlet.Response();
        response.isUpdated = notificationManager.isUpdated(member,lastUpdated);
        String responseString = gson.toJson(response);
        try (PrintWriter writer = resp.getWriter()){
            writer.write(responseString);
            writer.flush();
        }
    }
    static class LastUpdatedResponse{
        int errorCode;
        String errorDetails;
        boolean isUpdated;
    }
}
