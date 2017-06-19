import test from 'ava';
var Dwindle = require('./dwindle');
let crap;

test('Constructor param object', t => {
  crap = {x: "whatever"};

  try {
    let d = new Dwindle(crap);
    t.fail();
  } catch (e) {
    t.pass(); // Generated an exception, well done!
  }

});

test('Constructor param bad array', t => {
  crap = [0,1,2,3,4];

  try {
    let d = new Dwindle(crap);
    t.fail();
  } catch (e) {
    t.pass();
  }

});

test('Constructor param bad inner array', t => {
  crap = [[0,1,3]];

  try {
    let d = new Dwindle(crap);
    t.fail();
  } catch (e) {
    t.pass();
  }

});

test('Constructor param bad array values', t => {
  crap = [['a', 'b'],[null, undefined]];

  try {
    let d = new Dwindle(crap);
    t.fail();
  } catch (e) {
    t.pass();
  }

});

test('Target point reduction', t => {
  // Take four points
  let square = [[0,0], [100, 0], [100,100], [0, 100]];

  let d = new Dwindle(square);

  // Try reducing them to 3
  let res = d.simplify({target: 3});

  t.is(res.length, 3);

});


test('Percentage reduction', t => {
  // Take four points
  let square = [[0,0], [100, 0], [100,100], [0, 100]];

  let d = new Dwindle(square);

  // Try reducing them to 50% (2 points)
  let res = d.simplify({percent: 50});

  t.is(res.length, 2);

});
