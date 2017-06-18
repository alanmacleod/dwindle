
import nanoq from 'nanoq';

export default class Dwindle
{
  constructor(points)
  {
    // Descriptor array for every point in `this.points[]`
    this.meta = [];

    // Store a reference to the user's point data
    this.points = points;

    // minheap to order the simplification
    this.q = new nanoq(points.length, (a, b) => { this.meta[a].area > this.meta[b].area });

    this.minpoint = 1;
    this.maxpoint = this.points.length-2;

    this.init();
    this.dwindle();
  }

  simplify(area)
  {
    return this.points.filter((p,i) => {
      // always return the first and last points
      if (i < this.minpoint || i > this.maxpoint) return true;

      // otherwise return this point if deemed significant
      return this.meta[i].area >= area
    });
  }

  // Called only once to calculate areas
  dwindle()
  {
    let p;
    let startpoint = 0, endpoint = this.points.length-1;

    while((p = this.q.pop()))
    {
      let prev = this.meta[p].prev;
      let next = this.meta[p].next;

      // join the dots left orphaned by p's removal
      // and recalc neighbours' areas
      if (prev >= this.minpoint)
      {
        this.meta[prev].next = next;
        this.meta[prev].area = this.recalc(prev);
      }

      if (next <= this.maxpoint)
      {
        this.meta[next].prev = prev;
        this.meta[next].area = this.recalc(next);
      }

      // Fudge EA here if adjacent recalc'd areas are smaller than P's
    }
  }

  recalc(p)  // p = index into this.points[]
  {
    let prev = this.meta[p].prev;
    let next = this.meta[p].next;

    return this.area([this.points[prev], this.points[p], this.points[next]]);
  }

    // For each point given;
    //  - create a next/prev pointer
    //  - calculate the area of the point with its neighbours
    //  - add the point to our minheap (which uses its area)
  init()
  {
    for (let i=1; i<this.points.length-1; i++)
    {
      let p = this.points[i];
      let t = {
        prev: i-1,
        next: i+1,
        area: this.area([ this.points[i-1], p, this.points[i+1] ])
      };

      this.meta[i] = t;
      this.q.push(i);
    }
  }

  area(tri)
  {
    let a = this.dist(tri[0], tri[1]);
    let b = this.dist(tri[1], tri[2]);
    let c = this.dist(tri[2], tri[0]);
    let s = (a + b + c) / 2;

    return Math.sqrt(
        s * (s - a) * (s - b) * (s - c)
    );
  }

  dist(a, b)
  {
    var xdiff = b[0] - a[0];
    var ydiff = b[1] - a[1];

    return Math.sqrt( xdiff*xdiff + ydiff*ydiff );
  }
}
