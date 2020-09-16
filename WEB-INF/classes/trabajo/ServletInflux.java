package trabajo;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
//import java.net.*;
//import java.util.*;
//import java.util.concurrent.TimeUnit;

import org.influxdb.*;
import org.influxdb.dto.Pong;
//import org.influxdb.dto.BatchPoints;
//import org.influxdb.dto.Point;
//import org.influxdb.dto.QueryResult;
import org.influxdb.dto.Query;

public class ServletInflux extends HttpServlet {
    //Tag
    String cityName;
    int cityID;
    int reqlat;
    int reqlon;
    //Fields
    String weather;
    float temperature;
    float pressure;
    float humidity;
    float wind;
 
    private static final long serialVersionUID = 1L;
 
    /*We will make a query to InfluxDB. If system timestamp - influx last timestamp > 10 minutes we will send the
    request to OpenWeatherAPI. Otherwise we will send the data from our database*/
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
                response.setContentType("text/html");
                PrintWriter out = response.getWriter();

                InfluxDB influxDB = InfluxDBFactory.connect("localhost:8086");
                String dbName = "rinte";
                influxDB.query(new Query("CREATE DATABASE " + dbName));
                influxDB.setDatabase(dbName);
                String rpName = "autogen";
                influxDB.query(new Query("CREATE RETENTION POLICY " + rpName + " ON " + dbName + " DURATION 120h REPLICATION 2 SHARD DURATION 30h DEFAULT"));
                influxDB.setRetentionPolicy(rpName);
                Pong resp = influxDB.ping();
                if (resp.getVersion().equalsIgnoreCase("unknown")) {
                    out.println("<html><body>");
                    out.println("<h1>Error pinging server.</h1>");
                    out.println("</body></html>");
                }
                else{
                    out.println("<html><body>");
                    out.println("<h1>Success!</h1>");
                    out.println("</body></html>");
                }
                return;
            }
 
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
 
    //writeInflux will connect with InfluxDB and create a point
    /*public void writeInflux(String fields){
        

        InfluxDB influxDB = InfluxDBFactory.connect("http://127.0.0.1:8086");
        String dbName = "currentweather";
        String rpName = "autogen";
        influxDB.query(new Query("CREATE RETENTION POLICY " + rpName + " ON " + dbName + " DURATION 60h REPLICATION 2 SHARD DURATION 30m DEFAULT"));
        influxDB.setRetentionPolicy(rpName);

        influxDB.enableBatch(BatchOptions.DEFAULTS);

        influxDB.write(Point.measurement("currentweather")
            .time(System.currentTimeMillis(), TimeUnit.MILLISECONDS)
            .tag("Name","a" )     //City name
            .tag("ID",10L )     //City ID
            .tag("lat",1L)     //lat
            .tag("lon",1L )     //lon
            .addField("Weather","a" )   //Weather
            .addField("Temp",1L )   //Temp.
            .addField("Mintemp",1L )   //Min. Temp
            .addField("Maxtemp",1L )   //Max. Temp
            .addField("Pressure",1L )   //Pressure
            .addField("Humidity",1L )   //Humidity
            .build());
        influxDB.close();}*/

}
//El doGet mío
//{
    //We get the values of the query string:
    /*
                    CAMPOS: lat,lon,cnt*/
//    reqlat = Math.round(request.getParameter(lat));
  //  reqlon = Math.round(request.getParameter(lon));
    //influxDB.query(new Query("select * from weather where round(lat) = "+ lat +"and round(lon) = " + lon + "order by time desc limit 1;"));
      //      if(System.currentTimeMillis()-){
                
        //    }
    /*Parseamos la query;
    if(t system - t last query en influx >10){
        Hacemos petición a OpenWeather
        writeInflux(campos)
        Enviamos los datos al cliente
    }
    else{
        queryInflux()
        Enviamos los datos al cliente
    }*/
//}