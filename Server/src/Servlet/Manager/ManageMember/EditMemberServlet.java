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

@WebServlet(name = "EditMemberServlet", urlPatterns = "/editMember")
public class EditMemberServlet extends HttpServlet {
    private Gson gson = new Gson();

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        editMember(req, resp);
    }

    public void editMember(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());

            BufferedReader reader = req.getReader();
            String gsonString = reader.lines().collect(Collectors.joining());
            EditMemberArgs memberArgs = gson.fromJson(gsonString, EditMemberArgs.class);

            Member member = systemManagement.getMemberList().get(memberArgs.index);

            if (memberArgs.name != null)
                systemManagement.changeName(member, memberArgs.name);

            if (memberArgs.phone != null)
                systemManagement.changePhoneNumber(member, memberArgs.phone);

            if (memberArgs.level != null){
                LevelEnum level = LevelEnum.convertFromInt(Integer.parseInt(memberArgs.level));
                systemManagement.updateMemberLevel(member, level);
            }

            if (memberArgs.age != 0)
                systemManagement.updateMemberAge(member, memberArgs.age);

            resp.setStatus(HttpServletResponse.SC_OK);
            String redirectUrlPage = Constants.Manager_Page;
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