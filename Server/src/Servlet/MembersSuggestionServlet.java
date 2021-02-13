package Servlet;

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
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet (name = "MembersSuggestionServlet", urlPatterns = "/membersSuggestion")
public class MembersSuggestionServlet extends HttpServlet {
    private Gson gson = new Gson();
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("in MembersSuggestionServlet");
        makeMembersSuggestion(req,resp);
    }

    private void makeMembersSuggestion(HttpServletRequest req, HttpServletResponse resp) {
        SystemManagement systemManagement = ServletUtils.getSystemManagment(req.getServletContext());
        HttpSession session =req.getSession();
        if(session == null){
            return;
        }
        String memberId = (String) session.getAttribute(Constants.USERID);
        if(memberId == null || memberId.isEmpty()){
            return;
        }
        Member member = systemManagement.getMemberByID(memberId);
        if(member == null){
            return;
        }
        Response response = new Response();
        List<Member> memberList = systemManagement.memberPartnersSuggestion(member);
        response.members = memberList;
        String stringResponse = gson.toJson(response);
        System.out.println(stringResponse);
        try(PrintWriter writer =resp.getWriter()){
            writer.write(stringResponse);
        }
        catch (IOException e){

        }
    }
    static class Response{
        int errorCode;
        String errorDetails;
        List<Member> members;
    }
}
