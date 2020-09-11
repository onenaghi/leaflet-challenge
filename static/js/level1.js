// code for creating Basic Map (Level 1)
// code for creating Basic Map (Level 1)
// Creating map object
const myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3
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
        return '#fee5d9';
    }
    else if (sig <= 500) {
        return '#fcae91';
    }
    else if (sig <= 750){
        return '#fb6a4a';
    }
    else if (sig <= 1000){
        return '#de2d26';
    }
    else {
        return '#a50f15';
    };
}

// Connect geo data and store in API
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