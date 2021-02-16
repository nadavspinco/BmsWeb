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

@WebServlet(name = "ExportBoatServlet", urlPatterns = "/exportBoat")
public class ExportBoatServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        exportAllBoat(req, resp);
    }

    private void exportAllBoat(HttpServletRequest req, HttpServletResponse resp) {
        try(PrintWriter out = resp.getWriter()){
            String boatsXmlString;
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            boatsXmlString = systemManagement.exportBoatsToString();
            out.print(boatsXmlString);
        }
        catch (IOException e){
            e.getStackTrace();
        }
    }
}