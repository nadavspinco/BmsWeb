package Servlet.Manager.ManageBoat;

import Objects.Boat;
import Objects.SystemManagement;
import Servlet.Manager.ManageMember.AddMemberServlet;
import Utils.Constants;
import Utils.ServletUtils;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.stream.Collectors;

@WebServlet(name = "RemoveBoatServlet", urlPatterns = "/removeBoat")
public class RemoveBoatServlet extends HttpServlet {
    private Gson gson = new Gson();

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        removeBoat(req, resp);
    }

    public void removeBoat(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());

            BufferedReader reader = req.getReader();
            String gsonString = reader.lines().collect(Collectors.joining());
            Boat boat = gson.fromJson(gsonString, Boat.class);

            resp.setStatus(HttpServletResponse.SC_OK);
            systemManagement.removeBoat(boat);
            String redirectUrlPage = "managerMenu.html";
            out.print(redirectUrlPage);
        }
        catch (IOException e) {
            e.getStackTrace();
        }
    }
}
