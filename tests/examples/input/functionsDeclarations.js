const a = 0;

// standard function declaration
function f1(x) {
  return a + x;
}

// variable function declaration
var f2 = function(x) {
  return a + x;
}

// arrow function declaration
var f3 = (x) => {
  return a + x;
}

// object method declaration
var o = {
  f4(x) {
    return a + x;
  }
}
