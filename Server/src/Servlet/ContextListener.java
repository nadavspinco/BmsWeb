package Servlet;



import Objects.Notification;
import Objects.NotificationManager;
import Objects.SystemManagement;
import Objects.XmlManagement;
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
        SystemManagement systemManagement = (SystemManagement) servletContextEvent.getServletContext().getAttribute(Constants.SystemManagment);
        XmlManagement.exportSystemManagementDetails(systemManagement);
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
        NotificationManager manager = new NotificationManager();
        servletContext.setAttribute(Constants.NotificationManager, manager);

    }
}
