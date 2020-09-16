var map;
var geoJSON;
var request;
var gettingData = false;
var openWeatherMapKey = "" //Add here your own key
var units = 'metric'; //By default the temperature units will appear in Celsius
var symbol = 'C';

function loadInfo(str){
  var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4){
        document.getElementById('wrapper1').innerHTML = xhr.responseText;
    }
};
xhr.open('GET', str, true);
xhr.send();
}

function changeUnits(unit){
units = unit;
  if(unit=="metric"){symbol="C";}
  if(unit=="standard"){symbol="K";}
  if(unit=="imperial"){symbol="F";}
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat:39.47, lng:-6.371},
    zoom: 10
    });
    //If the browser can use our location it will be the center of our map
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        map.setCenter(pos);
      });
    } else {
      // Browser doesn't support Geolocation, center will be Cáceres by default.
      map.setCenter({lat:39.47, lng:-6.371});
    }
        // Listeners to make the requests when clicked
        google.maps.event.addListener(map, 'idle', checkIfDataRequested);
        // When we click the listener we will get the info below our map
        map.data.addListener('click', function(event) {
          document.getElementById("graficas").innerHTML=(
           "<img src=" + event.feature.getProperty("icon") + ">"
           + "<br/><strong>" + event.feature.getProperty("city") + "</strong>"
           + "<br/>" + event.feature.getProperty("temperature") + "&deg;"+symbol
           + "<br/>" + event.feature.getProperty("weather")
           );
        });
  }
  var checkIfDataRequested = function() {
    // Stop extra requests from being sent
    while (gettingData === true) {
      request.abort();
      gettingData = false;
    }
    getCoords();
  };

  // Get the coordinates from the Map bounds
  var getCoords = function() {
    var position = {lat: map.getCenter().lat() , lng: map.getCenter().lng() };
    getCurrentWeather(position.lat,position.lng);
  };
  // Make the current weather request (used in the map)
  var getCurrentWeather = function(lat,lon) {
    gettingData = true;
    var requestString = "http://api.openweathermap.org/data/2.5/find?lat="
                        + lat 
                        + "&lon=" 
                        + lon
                        + "&cluster=yes&format=json&cnt=10&units="
                        + units
                        + "&APPID=" 
                        + openWeatherMapKey;
    request = new XMLHttpRequest();
    request.onload = proccessResults;
    request.open("get", requestString, true);
    request.send();}
  // Take the JSON results and proccess them
  var proccessResults = function() {
    console.log(this);
    var results = JSON.parse(this.responseText);
    if (results.list.length > 0) {
        resetData();
        for (var i = 0; i < results.list.length; i++) {
          geoJSON.features.push(jsonToGeoJson(results.list[i]));
        }
        drawIcons(geoJSON);
    }
  };
  var infowindow = new google.maps.InfoWindow();
  // For each result that comes back, convert the data to geoJSON
  var jsonToGeoJson = function (weatherItem) {
    var feature = {
      type: "Feature",
      properties: {
        city: weatherItem.name,
        weather: weatherItem.weather[0].main,
        temperature: weatherItem.main.temp,
        min: weatherItem.main.temp_min,
        max: weatherItem.main.temp_max,
        humidity: weatherItem.main.humidity,
        pressure: weatherItem.main.pressure,
        windSpeed: weatherItem.wind.speed,
        windDegrees: weatherItem.wind.deg,
        windGust: weatherItem.wind.gust,
        icon: "http://openweathermap.org/img/w/"
              + weatherItem.weather[0].icon  + ".png",
        coordinates: [weatherItem.coord.lon, weatherItem.coord.lat]
      },
      geometry: {
        type: "Point",
        coordinates: [weatherItem.coord.lon, weatherItem.coord.lat]
      }
    };
    // Set the custom marker icon
    map.data.setStyle(function(feature) {
      return {
        icon: {
          url: feature.getProperty('icon'),
          anchor: new google.maps.Point(25, 25)
        }
      };
    });
    // returns object
    return feature;
  };
  // Add the markers to the map
  var drawIcons = function (weather) {
     map.data.addGeoJson(geoJSON);
     // We finished getting data
     gettingData = false;
  };
  // Clear data layer and geoJSON for every new map request
  var resetData = function () {
    geoJSON = {
      type: "FeatureCollection",
      features: []
    };
    map.data.forEach(function(feature) {
      map.data.remove(feature);
    });
  };
  google.maps.event.addDomListener(window, 'load', initMap);

// Like getCurrentWeather, is used to get the data from OpenWeatherMap. We access to the 5/3 API this time and use the data to draw a chart.
  function get53Weather(city,countryID) {
    gettingData = true;
    var requestString;
    var xhr = new XMLHttpRequest();
    if(countryID.length!=0){
      requestString ="http://api.openweathermap.org/data/2.5/forecast?q="
                      + city
                      +","
                      + countryID
                      + "&mode=json"
                      + "&units="
                      + units
                      + "&APPID=" 
                      + openWeatherMapKey;
    }
    else{
      requestString ="http://api.openweathermap.org/data/2.5/forecast?q="
                      + city
                      + "&mode=json"
                      + "&APPID=" 
                      + openWeatherMapKey
                      +"&units="
                      +units;
    }
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4){
          drawChart(xhr.responseText);
      }
    };
    xhr.open('GET', requestString, true);
    xhr.send();
  }