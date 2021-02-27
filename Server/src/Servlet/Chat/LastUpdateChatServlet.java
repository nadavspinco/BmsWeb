package Servlet.Chat;

import Objects.ChatManager;
import Utils.Constants;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@WebServlet(name = "LastUpdateChatServlet", urlPatterns = "/lastUpdateChat")
public class LastUpdateChatServlet extends HttpServlet {
    private Gson gson = new Gson();
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        sendLastUpdate(req,resp);
    }

    private void sendLastUpdate(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String lastUpdatedString ;
        try(BufferedReader bufferedReader = req.getReader()) {
            lastUpdatedString = bufferedReader.lines().collect(Collectors.joining());
        }
        LocalDateTime lastUpdated =  gson.fromJson(lastUpdatedString,LocalDateTime.class);
        ChatManager chatManager = (ChatManager) getServletContext().getAttribute(Constants.ChatManager);
        Response response =  new Response();
        response.isUpdated = chatManager.isUpdated(lastUpdated);
        String responseString = gson.toJson(response);
        try(PrintWriter out = resp.getWriter()) {
            out.print(responseString);
            out.flush();
        }
    }
    static class Response {
        int errorCode;
        String errorDetails;
        boolean isUpdated;
    }
}
