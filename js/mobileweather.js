// Written by: Jonathan Wolfe
// Date: 8/31/2015

// Current End Time
var endDate = new Date();
//endDate.setUTCMinutes(0, 0, 0);

var map = L.map('map', {
    zoom: 10,
    scrollWheelZoom: true,
    inertia: true,
    inertiaDeceleration: 2000,
    fullscreenControl: false,
    center: [38.0, -90.50],
    timeDimension: true,
    timeDimensionControl: true,
    timeDimensionControlOptions: {
        autoPlay: true,
        playerOptions: {
            buffer: 10,
            transitionTime: 200,
            loop: true
        },
        speedSlider: false
    }
//    timeDimensionOptions: {
//        timeInterval: "PT30M/" + endDate.toISOString(),
//        period: "PT5M",
//        loadingTimeout: 5000
//    },

});

// Basemap
var layer = L.esri.basemapLayer("DarkGray", {
    detectRetina: true
}).addTo(map);

// Geo-locate
map.locate({setView: true, maxZoom: 16});

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    //L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);


function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);

// Radar time-enabled WMS
var wmsUrl = "http://new.nowcoast.noaa.gov/arcgis/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer/WMSServer";

var radarWMS = L.nonTiledLayer.wms(wmsUrl, {
    layers: '1',
    format: 'image/png',
    transparent: true,
    opacity: 0.8,
    attribution: 'nowCOAST'
});

var proxy = 'server/proxy.php';
var testTimeLayer = L.timeDimension.layer.wms(radarWMS, {
    proxy: proxy,
    updateTimeDimension: true,
    updateTimeDimensionMode: "replace"
});
testTimeLayer.addTo(map);

var theLegend = L.control({
    position: 'topright'
});

theLegend.onAdd = function(map) {
    var src = "http://new.nowcoast.noaa.gov/images/legends/radar.png";
    var div = L.DomUtil.create('div', 'info legend');
    div.style.width = '270px';
    div.style.height = '50px';
    div.innerHTML += '<b>Legend</b><br><img src="' + src + '" alt="legend">';
    return div;
};
theLegend.addTo(map);

L.control.coordinates({
    position: "bottomright",
    decimals: 3,
    labelTemplateLat: "Latitude: {y}",
    labelTemplateLng: "Longitude: {x}",
    useDMS: false,
    enableUserInput: true
}).addTo(map);

// Basemap labels
var labels = L.esri.basemapLayer('DarkGrayLabels').addTo(map);
labels.setZIndex(1000);

// State overlay
function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0
    };
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        click: zoomToFeature
    });
}

var geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

map.on('layeradd', function(e) {
    geojson.bringToFront()
});

// NHC Hurricane Tracks
//var nhcTracks = L.tileLayer.wms("http://new.nowcoast.noaa.gov/arcgis/services/nowcoast/wwa_meteocean_tropicalcyclones_trackintensityfcsts_time/MapServer/WMSServer", {
//    layers: '0,1,2,3,4,5,6,7,8',
//    format: 'image/png',
//    transparent: true,
//    opacity: 0.5,
//    format: 'image/png32',
//    attribution: 'nowCOAST'
//});
//nhcTracks.addTo(map);