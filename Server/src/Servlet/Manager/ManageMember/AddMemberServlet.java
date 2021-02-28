package Servlet.Manager.ManageMember;
import Enum.LevelEnum;
import Objects.SystemManagement;
import Utils.Constants;
import Utils.ServletUtils;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.stream.Collectors;

@WebServlet(name = "AddMemberServlet", urlPatterns = "/addMember")
public class AddMemberServlet extends HttpServlet {
    private Gson gson = new Gson();

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        AddMember(req, resp);
    }

    public void AddMember(HttpServletRequest req, HttpServletResponse resp) {
        try (PrintWriter out = resp.getWriter()) {
            SystemManagement systemManagement = ServletUtils.getSystemManagment(getServletContext());
            HttpSession session = req.getSession();
            if (session == null) {
                out.print(Constants.Error);
                return;
            }

            BufferedReader reader = req.getReader();
            String gsonString = reader.lines().collect(Collectors.joining());
            MemberArgs member = gson.fromJson(gsonString, MemberArgs.class);
            LevelEnum level = LevelEnum.convertFromInt(member.level);

            if(systemManagement.isMemberExistBySerial(member.serial)){
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(Constants.Existed_Serial);
                return;
            }

            if(systemManagement.isEmailAlreadyExist(member.email)){
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(Constants.Existed_Email);
                return;
            }

            resp.setStatus(HttpServletResponse.SC_OK);
            systemManagement.addMember(member.name,member.phone,member.email,member.password,member.age,
                    member.comment, level, member.isManager, member.serial);
            String redirectUrlPage = Constants.ManagerPage;
            out.print(redirectUrlPage);
        }
        catch (IOException e) {
            e.getStackTrace();
        }
    }

    static class MemberArgs{
        private String email;
        private String password;
        private String name;
        private String serial;
        private String comment;
        private String phone;
        private int age;
        private int level;
        private boolean isManager;
    }
}