
"#ifndef PI"
  "#define PI 3.141592653589793"
"#endif"

import nanoq from 'nanoq';

let nq = new nanoq(null, function(a,b){
  return a > b;
});

for (var t=0; t<100; t++)
{
  nq.push((Math.random()*100)>>0);
}


"#ifdef PI"
  console.log(nq.tree);
"#endif"


for (var t=0; t<nq.length(); t++)
{
  console.log(nq.pop());
}

// for (var t=0; t<1000; t++)
// {
//   nq.push((Math.random()*1000)>>0);
// }
// console.log(nq.tree);
//
// console.log("Pop...");
//
// for (var t=0; t<1000; t++)
// {
//   console.log(nq.pop());
// }

//Julius / selina, oslo astra
