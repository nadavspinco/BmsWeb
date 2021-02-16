package Servlet.Manager.ExportMenu;
import Objects.SystemManagement;
import Utils.ServletUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "ExportActivityServlet", urlPatterns = "/exportActivity")
public class ExportActivityServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        exportAllActivity(req, resp);
    }

    private void exportAllActivity(HttpServletRequest req, HttpServletResponse resp) {
        try(PrintWriter out = resp.getWriter()){
            String activityXmlString;
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            activityXmlString = systemManagement.exportActivitiesToString();
            out.print(activityXmlString);
        }
        catch (IOException e){
            e.getStackTrace();
        }
    }
}