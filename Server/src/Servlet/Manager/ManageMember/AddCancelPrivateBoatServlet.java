package Servlet.Manager.ManageMember;
import Enum.LevelEnum;
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
import java.util.stream.Collectors;

@WebServlet(name = "AddCancelPrivateBoatServlet", urlPatterns = "/editPrivateBoatOfMember")
public class AddCancelPrivateBoatServlet extends HttpServlet {
    private Gson gson = new Gson();

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        cancelPrivateBoat(req, resp);
    }

    public void cancelPrivateBoat(HttpServletRequest req, HttpServletResponse resp) {
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

    static class EditMemberArgs{
        private int index;
        private String name;
        private String phone;
        private int age;
        private String level;
    }
}