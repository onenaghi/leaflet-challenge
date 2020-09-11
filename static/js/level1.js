// code for creating Basic Map (Level 1)
// Creating map object
const myMap = L.map("map", {
    center: [40, -120],
    zoom: 4
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/dark-v10",
  accessToken: API_KEY
}).addTo(myMap);

// create function to determine color based on significance of eq
function getStyle(sig){
    // use color brewer to assign color values
    if (sig <= 250) {
        return '#f1d9fa';
    }
    else if (sig <= 500) {
        return '#d68ef0';
    }
    else if (sig <= 750){
        return '#ba43e6';
    }
    else if (sig <= 1000){
        return '#8f19bc';
    }
    else {
        return '#560f71';
    };
}


// Store API query variables
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson';

// Grab the data with d3 and reason geojson
d3.json(url).then( 
    jsonData => {
        console.log(jsonData.features);

        jsonData.features.forEach(response => {
            L.circle([response.geometry.coordinates[1], response.geometry.coordinates[0]],
                {
                    fillOpacity: .65,
                    // color: getStyle(response.properties.sig),
                    fillColor: getStyle(response.properties.sig),
                    radius: response.properties.mag **3*1000,
                    stroke:false
                }
        ).bindPopup(`<h1>Earthquake: ${response.properties.place}</h1> <hr>
                    <h3>Time: ${new Date(response.properties.time)}</h3> <hr>
                    <h3>Magnitude: ${response.properties.mag}</h3> <hr>
                    <h3>Significance:: ${response.properties.sig}</h3>`)
                    .addTo(myMap);
    })
    // create legend
    const legend = L.control({position: 'bottomright'});
    legend.onAdd = function() {
        const div = L.DomUtil.create("div", "info legend");
        div.innerHTML += "<b>EQ Significance</b><br><br>";
        significance = [0,250,500,750,1000];
        for (var i=0; i < significance.length; i++) {
            div.innerHTML +=
                '<i style= "background:' + getStyle(significance[i] + 1) + '"></i>' +
                significance[i] + (significance[i + 1] ? '-' + significance[i + 1] + '<br><br>': '+');
        }
        return div;
    };
    legend.addTo(myMap);
});