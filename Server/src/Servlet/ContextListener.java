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
    }

    private void createChatManager(ServletContext servletContext) {
        ChatManager chatManager;
        try {
            chatManager = XmlManagement.importChatManagerDetails();

        } catch (Exception e) {
            chatManager =  new ChatManager();
        }
        servletContext.setAttribute(Constants.ChatManager,chatManager);
    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent){
        SystemManagement systemManagement = (SystemManagement) servletContextEvent.getServletContext().getAttribute(Constants.SystemManagment);
        NotificationManager notificationManager = (NotificationManager) servletContextEvent.getServletContext().getAttribute(Constants.NotificationManager);
        ChatManager chatManager = (ChatManager) servletContextEvent.getServletContext().getAttribute(Constants.ChatManager);
        XmlManagement.exportSystemManagementDetails(systemManagement);
        XmlManagement.exportNotificationManagerDetails(notificationManager);
        XmlManagement.exportChatManagerDetails(chatManager);
    }

    private void createEngine(ServletContext servletContext){
        SystemManagement systemManagement = null;
        try {
            systemManagement = XmlManagement.importSystemManagementDetails();
        } catch (Exception e) {
           systemManagement = new SystemManagement();
        }

        servletContext.setAttribute(Constants.SystemManagment, systemManagement);
    }

    private void createNotificationManager(ServletContext servletContext){
        NotificationManager manager ;
        try {
            manager = XmlManagement.importNotificationManagerDetails() ;

        } catch (Exception e) {
            manager = new NotificationManager();
        }
        servletContext.setAttribute(Constants.NotificationManager, manager);

    }
}
