

import Dwindle from './dwindle.js';
import L from 'leaflet';

let d, shape, deutschland;

let container = document.getElementById('map');
let info = document.getElementById('info');

let map = L.map(container).setView([52.522032, 13.412718], 6);
let url ='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

L.tileLayer(url, {}).addTo(map);

fetch("./data/de.4326.geo.json")
  .then(res => res.json())
  .then((data)=>{

    deutschland = data.features[0].geometry.coordinates[90][0];
    d = new Dwindle(deutschland);

    // Leaflet expects lat, lon (y, x) ordering of coords so .map() them first
    shape = L.polygon(deutschland.map(c => { return [c[1], c[0]]})).addTo(map);
    map.fitBounds(shape.getBounds());
  });


  map.on('mousemove', (m) => {
    if (!d) return;

    let x = m.containerPoint.x;
    let f = x / container.clientWidth;

    let area = d.minarea * Math.pow(d.maxarea/d.minarea, 0.5 + (f/2));

    let simple = d.simplify(area);

    if (simple.length < 8) return;

    if (shape)
      shape.remove();

    let pc = ((simple.length / deutschland.length) * 100).toFixed(2);

    info.innerHTML = `${simple.length} points (${pc}%)`;

    shape = L.polygon(simple.map(c => { return [c[1], c[0]]})).addTo(map);
  })

//Julius / selina, oslo astra
