
var nanoq = require('nanoq');

var err = "Expected: array of numerical coordinate arrays, e.g. [[0,1],[1,1],[1,0]]";

module.exports = Dwindle;

function Dwindle(points)
{
  // Basic type and order checks

  if (!Array.isArray(points))
    throw new Error(err);

  if (points.length == 0) return;

  let p = points[0];
  if (!Array.isArray(p))
    throw new Error(err);

  if (p.length != 2)
    throw new Error(err);

  if (isNaN(p[0]))
    throw new Error(err);

  // Seems ok: go johnny go-go go go

  this.rebuild(points);
}

Dwindle.prototype = {

  simplify: function(options)
  {
    // Select points by significance (area)
    // Easiest to implement, but least useful to the user
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
    // More practical/useful
    if (options.target || options.percent)
    {
      let pc = Math.max(Math.min(options.percent, 100),0);
      let count = pc ? ((pc / 100) * this.points.length) >> 0 : options.target;

      count = Math.min(this.maxpoint+1, count);
      count = Math.max(count, 2);

      let max = new nanoq(null, (a, b) => this.meta[a].area < this.meta[b].area );
      let min = new nanoq();

      // My somewhat clumsy implementation involves ordering points by area
      // significance, selecting the top N, then reordering the list
      // by winding order (index/id) so they render correctly. Not ideal.

      // Order all points by area/significance
      for (let i=this.minpoint; i<=this.maxpoint; i++)
        max.push(i);

      let out = [], c = count;

      // Output must include endpoints
      out.push(this.points[0]);
      out.push(this.points[this.maxpoint+1]);

      c = count-2;

      // Order points by index
      while (c--) min.push(max.pop());

      c = count-2;

      // Create subset array
      while (c--) out.push(this.points[min.pop()]);


      return out;
    }
  },

  rebuild: function(points)
  {
    // Descriptor array for every point in `this.points[]`
    this.meta = [];

    // Store a reference to the user's point data
    this.points = points;

    // minheap to order the simplification
    this.q = new nanoq(null, (a, b) =>  this.meta[a].area > this.meta[b].area );

    this.minpoint = 1;
    this.maxpoint = this.points.length-2;

    this.minarea = 0;
    this.maxarea = 0;

    this.init();
    this.dwindle();
  },

  // Called only once to calculate areas
  dwindle: function()
  {
    let p;

    this.minarea = Number.MAX_VALUE;
    this.maxarea = -1;

    //Process all points in order of area significance
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
  },

  recalc: function(p)  // p = index into this.points[]
  {
    let prev = this.meta[p].prev;
    let next = this.meta[p].next;
    let a = this.area([this.points[prev], this.points[p], this.points[next]]);
    return isNaN(a)? 0 : a;
  },

    // For each point given;
    //  - create a next/prev pointer
    //  - calculate the area of the point with its neighbours
    //  - add the point to our minheap (which uses its area)
  init: function()
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
  },

  area: function(tri)
  {
    let a = this.dist(tri[0], tri[1]);
    let b = this.dist(tri[1], tri[2]);
    let c = this.dist(tri[2], tri[0]);
    let s = (a + b + c) / 2;

    return Math.sqrt(
        s * (s - a) * (s - b) * (s - c)
    );
  },

  dist: function(a, b)
  {
    var xdiff = b[0] - a[0];
    var ydiff = b[1] - a[1];

    return Math.sqrt( xdiff*xdiff + ydiff*ydiff );
  }
}
