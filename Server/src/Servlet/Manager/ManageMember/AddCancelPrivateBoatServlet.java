package Servlet.Manager.ManageMember;
import Objects.Boat;
import Objects.Member;
import Objects.SystemManagement;
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
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@WebServlet(name = "AddCancelPrivateBoatServlet", urlPatterns = "/editPrivateBoatOfMember")
public class AddCancelPrivateBoatServlet extends HttpServlet {
    private Gson gson = new Gson();

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        cancelPrivateBoat(req, resp);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        getUnPrivateBoatList(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        addPrivateBoat(req, resp);
    }

    private void addPrivateBoat(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            List<Boat> boatList = systemManagement.getBoatList();
            List<Boat> newBoatList = new ArrayList<>();
            for (Boat boat : boatList){
                if (!boat.isPrivate())
                    newBoatList.add(boat);
            }

            BufferedReader reader = req.getReader();
            String gsonString = reader.lines().collect(Collectors.joining());
            AddPrivatBoatArgs addPrivatBoatArgs = gson.fromJson(gsonString, AddPrivatBoatArgs.class);
            Member member = systemManagement.getMemberList().get(addPrivatBoatArgs.indexMember);
            Boat boat = newBoatList.get(addPrivatBoatArgs.indexBoat);

            systemManagement.addPrivateBoat(member, boat.getSerialBoatNumber());
            resp.setStatus(HttpServletResponse.SC_OK);
            String redirectUrlPage = Constants.ManagerPage;
            out.print(redirectUrlPage);
        }
        catch (IOException e) {
            e.getStackTrace();
        }
    }

    private void getUnPrivateBoatList(HttpServletRequest req, HttpServletResponse resp){
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            List<Boat> boatList = systemManagement.getBoatList();
            List<Boat> newBoatList = new ArrayList<>();
            for (Boat boat : boatList){
                if (!boat.isPrivate())
                    newBoatList.add(boat);
            }

            if (newBoatList.size() == 0){
                out.print("There are not un private boats");
                return;
            }

            String BoatListJson = gson.toJson(newBoatList);
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.setContentType("application/json");
            out.print(BoatListJson);
        }
        catch (IOException e) {
            e.getStackTrace();
        }
    }

    private void cancelPrivateBoat(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());

            BufferedReader reader = req.getReader();
            String gsonString = reader.lines().collect(Collectors.joining());
            Member member = gson.fromJson(gsonString, Member.class);

            if (!member.getHasPrivateBoat()){
                out.print(Constants.Error);
                return;
            }

            resp.setStatus(HttpServletResponse.SC_OK);
            systemManagement.cancelMembersPrivateBoat(member);
            String redirectUrlPage = Constants.ManagerPage;
            out.print(redirectUrlPage);
        }
        catch (IOException e) {
            e.getStackTrace();
        }
    }

    static class AddPrivatBoatArgs{
        private int indexMember;
        private int indexBoat;
    }
}