package Servlet;

import Objects.*;
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

@WebServlet(name = "NotificationsServlet",urlPatterns = "/notifications")
public class NotificationsServlet extends HttpServlet {
    private Gson gson = new Gson();

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        writeNonPrivateNotifications(req,resp);
    }

    private void writeNonPrivateNotifications(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        NotificationManager notificationManager = (NotificationManager) getServletContext().getAttribute(Constants.NotificationManager);
        NotificationsResponse response = new NotificationsResponse();
        response.notifications = notificationManager.getNotifications(null);
        String responseString = gson.toJson(response);
        try (PrintWriter writer = resp.getWriter()){
            writer.write(responseString);
            writer.flush();
        }

    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        addNotification(req,resp);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        deleteNotification(req,resp);
    }

    private void deleteNotification(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession();
        if (session == null) {
            return;
        }

        String memberID = SessionUtils.getUserId(req);
        if (memberID == null || memberID.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        String notificationString;
        SystemManagement systemManagement = ServletUtils.getSystemManagment(req.getServletContext());
        Member member = systemManagement.getMemberByID(memberID);
        try(BufferedReader bufferedReader = req.getReader()) {
            notificationString = bufferedReader.lines().collect(Collectors.joining());
        }
        Notification notification = gson.fromJson(notificationString,Notification.class);
        NotificationManager notificationManager = (NotificationManager) getServletContext().getAttribute(Constants.NotificationManager);
       if(notification.isPrivate() == true){
           notificationManager.deletePrivateNotification(member,notification);
       }
       else {
           notificationManager.deleteGeneralNotification(notification);
       }
        Response response = new Response();
        String responseString = gson.toJson(response);
        try (PrintWriter writer = resp.getWriter()){
            writer.write(responseString);
            writer.flush();
        }
    }

    private void addNotification(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String notificationString;

        try(BufferedReader bufferedReader = req.getReader()) {
            notificationString = bufferedReader.lines().collect(Collectors.joining());
        }
        Notification notification = gson.fromJson(notificationString,Notification.class);
        NotificationManager notificationManager = (NotificationManager) getServletContext().getAttribute(Constants.NotificationManager);
        notificationManager.addGeneralNotification(notification.getHeader(),notification.getContent());
        Response response = new Response();
        String responseString = gson.toJson(response);
        try (PrintWriter writer = resp.getWriter()){
            writer.write(responseString);
            writer.flush();
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        getNotifications(req,resp);
    }

    private void getNotifications(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession();
        if (session == null) {
            return;
        }

        String memberID = SessionUtils.getUserId(req);
        if (memberID == null || memberID.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        SystemManagement systemManagement = ServletUtils.getSystemManagment(req.getServletContext());
        Member member = systemManagement.getMemberByID(memberID);
        NotificationManager notificationManager = (NotificationManager) getServletContext().getAttribute(Constants.NotificationManager);
        Notification [] notifications = notificationManager.getNotifications(member);
        NotificationsResponse response = new NotificationsResponse();
        response.notifications = notifications;
        response.lastUpdated = getRecentNotification(notifications);
        String jsonString = gson.toJson(response);
        try (PrintWriter writer = resp.getWriter()){
            writer.write(jsonString);
            writer.flush();
        }
    }
    private LocalDateTime getRecentNotification(Notification [] notifications){
        if(notifications == null ||  notifications.length == 0){
            return LocalDateTime.now();
        }
        LocalDateTime recentDateTime = notifications[0].getCreatedTime();
        for (Notification notification:notifications) {
            if(notification.getCreatedTime().isAfter(recentDateTime)){
                recentDateTime = notification.getCreatedTime();
            }
        }
        return recentDateTime;
    }

    static class Response {
        int errorCode;
        String errorDetails;
        boolean isUpdated;
    }

    static class NotificationsResponse{
        int errorCode;
        String errorDetails;
        Notification [] notifications;
        LocalDateTime lastUpdated;
    }

}
