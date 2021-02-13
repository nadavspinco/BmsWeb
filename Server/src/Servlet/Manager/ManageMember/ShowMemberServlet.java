package Servlet.Manager.ManageMember;

import Objects.Member;
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

@WebServlet(name = "ShowMemberServlet", urlPatterns = "/showMembers")
public class ShowMemberServlet extends HttpServlet {
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        showMember(req, resp);
    }

    public void showMember(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            List<Member> memberList = systemManagement.getMemberList();
            String MemberListJson = gson.toJson(memberList);

            resp.setStatus(HttpServletResponse.SC_OK);
            resp.setContentType("application/json");
            out.print(MemberListJson);
        }
        catch (IOException e) {
            e.getStackTrace();
        }
    }
}
