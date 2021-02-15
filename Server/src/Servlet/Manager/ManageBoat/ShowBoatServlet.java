package Servlet.Manager.ManageBoat;

import Objects.Boat;
import Objects.SystemManagement;
import Utils.ServletUtils;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet(name = "ShowBoatServlet", urlPatterns = "/showBoats")
public class ShowBoatServlet extends HttpServlet {
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        showBoat(req, resp);
    }

    public void showBoat(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            List<Boat> boatList = systemManagement.getBoatList();
            String BoatListJson = gson.toJson(boatList);

            resp.setStatus(HttpServletResponse.SC_OK);
            resp.setContentType("application/json");
            out.print(BoatListJson);
        }
        catch (IOException e) {
            e.getStackTrace();
        }
    }
}
