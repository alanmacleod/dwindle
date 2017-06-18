
import nanoq from 'nanoq';

export default class Dwindle
{
  constructor(points)
  {
    this.rebuild(points);
  }

  simplify(options)
  {
    // Select points by significance (area)
    if (options.area)
    {
      return this.points.filter((p,i) => {
        // always return the first and last points
        if (i < this.minpoint || i > this.maxpoint) return true;

        // otherwise return this point if deemed significant
        return this.meta[i].area >= options.area
      });
    }

    // Select specific target point count
    if (options.target || options.percent)
    {
      let pc = options.percent;
      let count = pc ? ((pc / 100) * this.points.length) >> 0 : options.target;

      let max = new nanoq(null, (a, b) => { this.meta[a].area > this.meta[b].area });

      for (let i=this.minpoint; i<=this.maxpoint; i++)
        max.push(i);

      let out = [this.points[this.minpoint-1], this.points[this.maxpoint+1]];

      while (count--)
        out.push(this.points[max.pop()]);

      return out;
    }
  }

  rebuild(points)
  {
    // Descriptor array for every point in `this.points[]`
    this.meta = [];

    // Store a reference to the user's point data
    this.points = points;

    // minheap to order the simplification
    this.q = new nanoq(null, (a, b) => { this.meta[a].area > this.meta[b].area });

    this.minpoint = 1;
    this.maxpoint = this.points.length-2;

    this.minarea = 0;
    this.maxarea = 0;

    this.init();
    this.dwindle();
  }

  // Called only once to calculate areas
  dwindle()
  {
    let p;

    this.minarea = Number.MAX_VALUE;
    this.maxarea = -1;

    while((p = this.q.pop()))
    {
      let prev = this.meta[p].prev;
      let next = this.meta[p].next;

      if (this.meta[p].area > 0)
        this.minarea = Math.min(this.minarea, this.meta[p].area);

      this.maxarea = Math.max(this.maxarea, this.meta[p].area);

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

    }
  }

  recalc(p)  // p = index into this.points[]
  {
    let prev = this.meta[p].prev;
    let next = this.meta[p].next;
    let a = this.area([this.points[prev], this.points[p], this.points[next]]);
    return isNaN(a)? 0 : a;
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

      // Math.sqrt() returns NaN for unrepresentable small numbers
      if (isNaN(t.area)) t.area = 0;

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
