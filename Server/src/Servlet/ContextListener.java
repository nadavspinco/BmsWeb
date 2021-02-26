package Servlet;



import Objects.Notification;
import Objects.NotificationManager;
import Objects.SystemManagement;
import Utils.Constants;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
public class ContextListener implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent){
        createEngine(servletContextEvent.getServletContext());
        createNotificationManager(servletContextEvent.getServletContext());
        System.out.println("The app is on");
    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent){
        System.out.println("The app is down");
    }

    private void createEngine(ServletContext servletContext){
        servletContext.setAttribute(Constants.SystemManagment, new SystemManagement());
    }

    private void createNotificationManager(ServletContext servletContext){
        NotificationManager manager = new NotificationManager();
        manager.addGeneralNotification("test header","test body");
        servletContext.setAttribute(Constants.NotificationManager, manager);

    }
}
