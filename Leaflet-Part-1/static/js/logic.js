// URL for API
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch earthquake data from API
fetch(url)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    // Create map & add base layer
    var earthquakemap = L.map("map").setView([38.00, -90.00], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(earthquakemap);

    // Overlay for more earthquake information
    data.features.forEach(function(feature) {
      var mag = feature.properties.mag * 6;
      var depth = Math.round(feature.geometry.coordinates[2] * 10000) / 10000;
      var lat = feature.geometry.coordinates[1];
      var lng = feature.geometry.coordinates[0];

      L.circleMarker([lat, lng], {
        radius: mag,
        color: "#000",
        fillColor: getColor(depth),
        fillOpacity: 0.8,
        weight: 0.5
      })
      .bindPopup(`<h3>Mag: ${feature.properties.mag}, Depth: ${depth}km, Loc: ${feature.properties.place}</h3>`)
      .addTo(earthquakemap);
    });

  // Create legend for the map key
var legend = L.control({ position: "bottomright" });
legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "info legend");
  var grades = [-10, 10, 30, 50, 70, 90];
  
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }
  return div;
};
legend.addTo(earthquakemap);
  });

// Set color based on depth
function getColor(d) {
  return d > 90
    ? "#FF0000"
    : d > 70
    ? "#FF8C00"
    : d > 50
    ? "#FFA500"
    : d > 30
    ? "#FFC247"
    : d > 10
    ? "#FFFF00"
    : d > -10
    ? "#00FF00"
    : "#ADFF2F";
}
  