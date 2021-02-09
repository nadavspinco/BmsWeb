package Utils;


import Objects.SystemManagement;
import Servlet.LoginServlet;
import com.google.gson.Gson;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import java.io.BufferedReader;
import java.util.stream.Collectors;

public class ServletUtils {
    private static Gson gson;
    public static SystemManagement getSystemManagment(ServletContext servletContext){
        return (SystemManagement) servletContext.getAttribute(Constants.SystemManagment);
    }

    public static Object readJsonObj(BufferedReader bufferedReader, Class classType){
        String gsonString = bufferedReader.lines().collect(Collectors.joining());
        Object obj = gson.fromJson(gsonString,classType);
        return obj;
    }
}
