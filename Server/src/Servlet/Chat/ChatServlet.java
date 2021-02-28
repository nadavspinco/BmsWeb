package Servlet.Chat;

import Objects.*;
import Servlet.NotificationsServlet;
import Utils.Constants;
import Utils.ServletUtils;
import Utils.SessionUtils;
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
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@WebServlet(name = "ChatServlet",urlPatterns = "/chat")
public class ChatServlet extends HttpServlet {
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        sendMessages(req,resp);
    }

    private void sendMessages(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        ChatManager chatManager = (ChatManager) getServletContext().getAttribute(Constants.ChatManager);
        GetMessagesResponse response = new GetMessagesResponse();
        response.messages = chatManager.getMessages();
        response.lastUpdate = chatManager.getLastUpdate();
        String responseString= gson.toJson(response);
        try(PrintWriter out =resp.getWriter()){
            out.print(responseString);
            out.flush();
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        addMessage(req,resp);
    }

    private void addMessage(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession();
        if (session == null) {
            return;
        }

        String memberID = SessionUtils.getUserId(req);
        if (memberID == null || memberID.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        SystemManagement systemManagement = ServletUtils.getSystemManagment(req.getServletContext());
        Member member = systemManagement.getMemberByID(memberID);
        String notificationString;

        try(BufferedReader bufferedReader = req.getReader()) {
            notificationString = bufferedReader.lines().collect(Collectors.joining());
        }
        Message message = gson.fromJson(notificationString, Message.class);
        ChatManager chatManager = (ChatManager) getServletContext().getAttribute(Constants.ChatManager);
        chatManager.addMessage(message.getHeader(),message.getContent(),member);
        Response response = new Response();
        String responseString = gson.toJson(response);
        try (PrintWriter writer = resp.getWriter()){
            writer.write(responseString);
            writer.flush();
        }
    }

    static class AddMessageRequest{
        String header;
        String content;
    }

    static  class Response{
        int errorCode;
        String errorDetails;
    }

    static class GetMessagesResponse{
        int errorCode;
        String errorDetails;
        LocalDateTime lastUpdate;
        ChatMessage [] messages;
    }
}
