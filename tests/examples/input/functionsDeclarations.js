const a = 0;

function f1(x) {
  return a + x;
}

var f2 = function(x) {
  return a + x;
}

var o1 = {
  f(x) {
    return a + x;
  }
}

var o2 = {
  f(x) {
    return a + x;
  }
}
