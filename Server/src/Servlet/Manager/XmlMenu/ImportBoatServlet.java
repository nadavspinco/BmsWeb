package Servlet.Manager.XmlMenu;
import Objects.SystemManagement;
import Utils.ServletUtils;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.Collection;
import java.util.Scanner;

@WebServlet(name = "ImportBoatServlet", urlPatterns = "/importBoat")
@MultipartConfig(fileSizeThreshold = 1024 * 1024, maxFileSize = 1024 * 1024 * 5, maxRequestSize = 1024 * 1024 * 5 * 5)
public class ImportBoatServlet extends HttpServlet {

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        removeAllBoat(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        addAllImportedBoat(req,resp);
    }

    private void removeAllBoat(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            systemManagement.cleanAllBoatsBecauseImport();
            out.print("All Boats have been removed successfully");
        }
        catch (IOException e) {
            e.getStackTrace();
        }
    }

    private void addAllImportedBoat(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            resp.setContentType("text/html");
            Collection<Part> parts = req.getParts();
            StringBuilder fileContent = new StringBuilder();
            for (Part part : parts)
                fileContent.append(readFromInputStream(part.getInputStream()));

            String[] wrongDetails = systemManagement.convertBoatsFromXml(fileContent.toString());
            StringBuilder stringBuilder = new StringBuilder();
            if (wrongDetails.length == 0)
                stringBuilder = null;
            else {
                stringBuilder.append("The wrong details in the imported data are:");
                stringBuilder.append(System.getProperty("line.separator"));
                for (int i = 0; i < wrongDetails.length; i++) {
                    stringBuilder.append(wrongDetails[i]);
                    stringBuilder.append(System.getProperty("line.separator"));
                }
            }
            out.print(stringBuilder);
        }
        catch (Exception e) {
            e.getStackTrace();
        }
    }

    private String readFromInputStream(InputStream inputStream) {
        return new Scanner(inputStream).useDelimiter("\\Z").next();
    }
}