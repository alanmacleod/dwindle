

import dwindle from './dwindle.js';
import L from 'leaflet';

let d;

let de;
let map = L.map('map').setView([52.522032, 13.412718], 6);
let url ='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

L.tileLayer(url, {}).addTo(map);

fetch("./data/de.4326.geo.json")
  .then(res => res.json())
  .then((data)=>{
    // console.log(data.features[0].geometry.coordinates.length);
    // drawpoly(data.features[0].geometry.coordinates[90][0]);
    de = data.features[0].geometry.coordinates[90][0];
    d = new dwindle(de);

    var p = L.polygon(de.map(c => { return [c[1], c[0]]})).addTo(map);
    map.fitBounds(p.getBounds());
  });




//Julius / selina, oslo astra
