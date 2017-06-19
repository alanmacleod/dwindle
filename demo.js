
var Dwindle = require('./dwindle.js');

import L from 'leaflet';

let dwin, shape, deutschland;

let container = document.getElementById('map');
let info = document.getElementById('info');

let map = L.map(container).setView([52.522032, 13.412718], 6);
let url ='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

L.tileLayer(url, {}).addTo(map);

fetch("./data/de.4326.geo.json")
  .then(res => res.json())
  .then((data)=>{

    deutschland = data.features[0].geometry.coordinates[90][0];
    dwin = new Dwindle(deutschland);

    // Leaflet expects lat, lon (y, x) ordering of coords so .map() them first
    shape = L.polygon(deutschland.map(c => { return [c[1], c[0]]})).addTo(map);
    map.fitBounds(shape.getBounds());
  });

  let done = false;

  map.on('mousemove', (m) => {
    if (!dwin) return;

    let x = m.containerPoint.x;
    let f = x / container.clientWidth;

    // Exp function for a pleasing interactive demo
    let area = dwin.minarea * Math.pow(dwin.maxarea/dwin.minarea, 0.5 + f/2);

    // Select the points we want by area
    let simple = dwin.simplify({area:area});

    // simple = d.simplify({target:500});

    // Limit to showing a half-decent shape
    if (simple.length < 6) return;

    // Clear the old shape on the map
    if (shape)
      shape.remove();

    let pc = ((simple.length / deutschland.length) * 100).toFixed(2);
    info.innerHTML = `<b>${simple.length} points (${pc}%)</b>`;

    // Add the new shape
    shape = L.polygon(simple.map(c => { return [c[1], c[0]]})).addTo(map);
  })

//Julius / selina, oslo astra
