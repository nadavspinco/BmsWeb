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

@WebServlet(name = "ExportRowerServlet", urlPatterns = "/exportRower")
public class ExportRowerServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        exportAllRower(req, resp);
    }

    private void exportAllRower(HttpServletRequest req, HttpServletResponse resp) {
        try(PrintWriter out = resp.getWriter()){
            String rowersXmlString;
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            rowersXmlString = systemManagement.exportMembersToString();
            out.print(rowersXmlString);
        }
        catch (IOException e){
            e.getStackTrace();
        }
    }
}