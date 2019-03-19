# Leaflet.Marker.PieMarker

[Leaflet](https://leafletjs.com) plugin for adding svg pie charts based on [David Gilbertson: "A simple pie chart in SVG"](https://hackernoon.com/a-simple-pie-chart-in-svg-dbdd653b6936).

[pie marker example](https://nlga.github.io/leaflet-piemarker/examples/piemarker.html)

Should work with Leaflet 1.x.

## Usage
Inlcude the scripts...
```js
<script src="path/to/leaflet.js"></script> 
<script src="path/to/dist/leaflet-piemarker.min.js"></script>
```

... and add a pie marker.

```js
myMap = L.map(...);
L.Marker.pieMarker([51.505, -0.09], {
            iconOptions: {
                iconSize: [50,50],
                data: [
                    {label: 'A', value: 0.05, color: 'rgba(0,12,50,0.75)', style:'stroke:black;stroke-width:0.01'},
                    {label: 'B', value: 0.3, color: 'green'},
                    {label: 'C', value: 0.2, color: '#00fff'},
                ]
            }
        }).addTo(myMap);
```

## Changelog

### 0.1.1 (2019-03-19)
- Fix: IE11 compatibility 
- Add: minified version in dist/leaflet-piemarker.min.js

### 0.1.0 (2018-10-09)
- initial commit

## ToDo
- add labels to pie chart
- scale on zoom

## License
This project is licensed under the BSD 3-Clause License - see the [LICENSE](LICENSE) file for details.