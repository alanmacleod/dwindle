
var fs = require('fs');

var de = JSON.parse(fs.readFileSync("./data/de.4839.geo.json"));

console.log(de.features.length);
