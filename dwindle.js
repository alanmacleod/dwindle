
export default class dwindle
{
  constructor(points)
  {
    this.meta = [];
    this.init(points);

  }

  // For each point we're given, store the next/prev and area
  init(points)
  {
    for (let i=1; i<points.length-1; i++)
    {
      let p = points[i];
      this.meta.push({
        prev: i-1,
        next: i+1,
        area: this.area([ points[i-1], p, points[i+1] ])
      });
    }
  }

  area(triangle)
  {
    let a = length(tri[0], tri[1]);
    let b = length(tri[1], tri[2]);
    let c = length(tri[2], tri[0]);
    let s = (a + b + c) / 2;

    return Math.sqrt(
        s * (s - a) * (s - b) * (s - c)
    );
  }

  length(a, b)
  {
    var xdiff = b[0] - a[0];
    var ydiff = b[1] - a[1];

    return Math.sqrt( xdiff*xdiff + ydiff*ydiff );
  }
}
