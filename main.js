

import Dwindle from './dwindle.js';
import L from 'leaflet';

let d;

let map = L.map('map').setView([52.522032, 13.412718], 6);
let url ='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

L.tileLayer(url, {}).addTo(map);

fetch("./data/de.4326.geo.json")
  .then(res => res.json())
  .then((data)=>{

    let deutschland = data.features[0].geometry.coordinates[90][0];
    let d = new Dwindle(deutschland);

    let simple = d.simplify(0.001);
    console.log(simple);

    // Leaflet expects lat, lon (y, x) ordering of coords so .map() them first
    var p = L.polygon(simple.map(c => { return [c[1], c[0]]})).addTo(map);
    map.fitBounds(p.getBounds());
  });

//Julius / selina, oslo astra
