// Creating map object
var map = L.map("map", {
  center: [40.71455, -74.00712],
  zoom: 10.5
});

// Adding tile layer
var layer=L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);
var link = "Choropleth map/static/data/Borough_Boundaries.geojson";

d3.json(link).then(function(data) {
  console.log(data);
  var geojson = L.choropleth(data, {
    valueProperty: 'licensecount', // which property in the features to use
    scale: ['yellow', 'red'], // chroma.js scale - include as many as you like
    steps: 5, // number of breaks or steps in range
    mode: 'q', // q for quantile, e for equidistant, k for k-means
    style: {
      color: 'black', // border color
      weight: 1,
      fillOpacity: 0.8
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`License Count: ${feature.properties.licensecount.toString()}`);
    }
  }).addTo(map);

// markers for New York Bourghs
var layer=L.marker([40.758896, -73.985130]).addTo(map);
var layer=L.marker([40.650002, -73.949997]).addTo(map);
var layer=L.marker([40.742054, -73.769417]).addTo(map);
var layer=L.marker([40.579027, -74.151535]).addTo(map);
var layer=L.marker([40.837048, -73.865433]).addTo(map);

// L.circle([40.758896, -73.985130], {
//   title: "Manhatten"
//   color: "yellow",
//   fillColor: "yellow",
//   radius: 1000
// }).addTo(map);

// var layer=L.marker = ([40.758896, -73.985130],
//   title: "Matthattan"
// );


// Set up the legend
  var legend = L.control({position: "topleft"});
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h3>License Counts</h3>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };
  legend.addTo(map);
});

var latlng = L.latlng
