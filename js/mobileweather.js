var endDate = new Date();
endDate.setUTCMinutes(0, 0, 0);

var map = L.map('map', {
    zoom: 4,
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
            }
        },
    timeDimensionOptions: {
        timeInterval: "PT2H/" + endDate.toISOString(),
        period: "PT5M"
    },
    loop: true
});

var layer = L.esri.basemapLayer("DarkGray", {
                                              detectRetina: true
                                            }).addTo(map);

// Geo-locate
map.locate({setView: true, maxZoom: 16});

var testWMS = "http://new.nowcoast.noaa.gov/arcgis/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer/WMSServer"
var testLayer = L.nonTiledLayer.wms(testWMS, {
    layers: '1',
    format: 'image/png',
    transparent: true,
    opacity:0.8,
    attribution: 'nowCOAST'
});
var testTimeLayer = L.timeDimension.layer.wms(testLayer);
testTimeLayer.addTo(map);

var testLegend = L.control({
    position: 'topright'
});


testLegend.onAdd = function(map) {
    var src = "http://new.nowcoast.noaa.gov/images/legends/radar.png";
    var div = L.DomUtil.create('div', 'info legend');
    div.style.width = '270px';
    div.style.height = '50px';
div.innerHTML +=  '<b>Legend</b><br><img src="' + src + '" alt="legend">';

    return div;
};
testLegend.addTo(map);

L.control.coordinates({
    position: "bottomright",
    decimals: 3,
    labelTemplateLat: "Latitude: {y}",
    labelTemplateLng: "Longitude: {x}",
    useDMS: false,
    enableUserInput: true
}).addTo(map);

var labels = L.esri.basemapLayer('DarkGrayLabels').addTo(map);
labels.setZIndex(1000);


// State overlay
function style(feature) {
			return {
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0//,
				//fillColor: getColor(feature.properties.density)
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

		geojson = L.geoJson(statesData, {
			style: style,
			onEachFeature: onEachFeature
		}).addTo(map);


		map.on('layeradd', function(e) {
        geojson.bringToFront()
        });
