package Servlet;



import Objects.*;
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
        createChatManager(servletContextEvent.getServletContext());
        System.out.println("The app is on");
    }

    private void createChatManager(ServletContext servletContext) {
        ChatManager chatManager = new ChatManager();
        servletContext.setAttribute(Constants.ChatManager,chatManager);
    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent){
        SystemManagement systemManagement = (SystemManagement) servletContextEvent.getServletContext().getAttribute(Constants.SystemManagment);
        NotificationManager notificationManager = (NotificationManager) servletContextEvent.getServletContext().getAttribute(Constants.NotificationManager);
        XmlManagement.exportSystemManagementDetails(systemManagement);
        XmlManagement.exportNotificationManagerDetails(notificationManager);
        System.out.println("The app is down");
    }

    private void createEngine(ServletContext servletContext){
        SystemManagement systemManagement = null;
        try {
            systemManagement = XmlManagement.importSystemManagementDetails();
            System.out.println("import good!!");
        } catch (Exception e) {
           systemManagement = new SystemManagement();
            System.out.println("import bad!!");
        }

        servletContext.setAttribute(Constants.SystemManagment, systemManagement);
    }

    private void createNotificationManager(ServletContext servletContext){
        NotificationManager manager ;
        try {
            manager = XmlManagement.importNotificationManagerDetails() ;
            System.out.println("notification GOOD!");

        } catch (Exception e) {
            System.out.println("notification failed");
            manager = new NotificationManager();
        }
        servletContext.setAttribute(Constants.NotificationManager, manager);

    }
}
