google.charts.load('current', {'packages':['line']});
google.charts.setOnLoadCallback(drawChart);

function drawChart(data) {

var obj = JSON.parse(data);
var tab = new google.visualization.DataTable();
tab.addColumn('string', 'Date forecasted');
tab.addColumn('number', 'Min temp');
tab.addColumn('number', 'Max temp');
tab.addColumn('number', 'Avg temp');

for(var i=0;i<obj.list.length;i++){
    tab.addRow([obj.list[i].dt_txt,obj.list[i].main.temp_min,obj.list[i].main.temp_max,obj.list[i].main.temp]);
}

var options = {
  chart: {
    title: 'Maximum, minimum and average temperatures in ' + obj.city.name,
    subtitle: 'In º' + symbol 
  },
  legend: { position: 'bottom' },
  width: 570,
  height:400
};

var chart = new google.charts.Line(document.getElementById('espacio'));
chart.draw(tab, google.charts.Line.convertOptions(options));
}