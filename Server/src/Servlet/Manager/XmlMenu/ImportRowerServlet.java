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

@WebServlet(name = "ImportRowerServlet", urlPatterns = "/importRower")
@MultipartConfig(fileSizeThreshold = 1024 * 1024, maxFileSize = 1024 * 1024 * 5, maxRequestSize = 1024 * 1024 * 5 * 5)
public class ImportRowerServlet extends HttpServlet {

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        removeAllRower(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        addAllImportedRower(req,resp);
    }

    private void removeAllRower(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            systemManagement.cleanAllMembersBecauseImport();
            out.print("All rowers have been removed successfully");
        }
        catch (IOException e) {
            e.getStackTrace();
        }
    }

    private void addAllImportedRower(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            resp.setContentType("text/html");
            Collection<Part> parts = req.getParts();
            StringBuilder fileContent = new StringBuilder();
            for (Part part : parts)
                fileContent.append(readFromInputStream(part.getInputStream()));

            String[] wrongDetails = systemManagement.convertMembersFromXml(fileContent.toString());
            out.print(wrongDetails);
        }
        catch (Exception e) {
            e.getStackTrace();
        }
    }

    private String readFromInputStream(InputStream inputStream) {
        return new Scanner(inputStream).useDelimiter("\\Z").next();
    }
}