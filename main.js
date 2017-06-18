

import Dwindle from './dwindle.js';
import L from 'leaflet';

let d, shape;

let container = document.getElementById('map');
let map = L.map(container).setView([52.522032, 13.412718], 6);
let url ='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

L.tileLayer(url, {}).addTo(map);

fetch("./data/de.4326.geo.json")
  .then(res => res.json())
  .then((data)=>{

    let deutschland = data.features[0].geometry.coordinates[90][0];
    d = new Dwindle(deutschland);

    // Leaflet expects lat, lon (y, x) ordering of coords so .map() them first
    shape = L.polygon(deutschland.map(c => { return [c[1], c[0]]})).addTo(map);
    map.fitBounds(shape.getBounds());
  });


  map.on('mousemove', (m) => {
    if (!d) return;

    let x = m.containerPoint.x;
    let f = x / container.clientWidth;

    if (shape)
      shape.remove();

    let y = d.minarea * Math.pow(d.maxarea/d.minarea, f);

    let simple = d.simplify(y);

    console.log(simple.length);

    shape = L.polygon(simple.map(c => { return [c[1], c[0]]})).addTo(map);
  })

//Julius / selina, oslo astra
