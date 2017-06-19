
[![Build Status](https://travis-ci.org/alanmacleod/dwindle.svg?branch=master)](https://travis-ci.org/alanmacleod/dwindle)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Dwindle

_**dwindle**_
ˈdwɪnd(ə)l

_verb_
- diminish gradually in size, amount, or strength.

[Try the demo here](http://demos.alanmacleod.eu/dwindle/pub/)

This is a geometry simplification tool I've wanted to write for a while cos the Visvalingam algorithm is just cool, basically. It accepts a list of 2d coordinates, which could be the outline of a complex polygon or a line-string (like a route) and simplifies the data in the most visually pleasing and acceptable manor i.e. by retaining the important and 'significant' data where possible.

It uses the Visvalingam method which is algorithmically clearer, easier to implement and I believe more effective and consistent than the classic Douglas-Peucker approach.

## Usage

Install via npm

```
$ npm install dwindle
```

Instantiate the object. **Dwindle** expects an array of coordinate-pair arrays as input:

```js
var Dwindle = require('dwindle');

let points = [[0,0], [100, 0], [100,100], ... [0, 100]];
let myshape = new Dwindle(points);
```

There are three choices when reducing the data;
* Specifiying a target point count
```js
let reduced = myshape.simplify({target: 1000}); // reduce to 1000 points
```
* Specifiying a percentage reduction
```js
let reduced = myshape.simplify({percent:50}); // reduce set by half
```
* Specifiying a minimum target area (not so useful in practice but it is the basis of the algorithm internally)
```js
let reduced = myshape.simplify({area:0.01}); // by minimum area
```

The `.simplify()` method returns an array of coordinate-pair arrays, same as the input.

Note that if your `points` array (the one you pass to the Dwindle constructor) changes and you want the simplifcations to reflect these changes, then you will need to rebuild the index by calling:

```
myshape.rebuild(newpoints);
```

Rebuilding is fast and can be called multiple times no problem.
