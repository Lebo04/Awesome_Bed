let sum = "";

function clearSum() {
  document.getElementById("output").value = " ";
}

function addToSum(value) {
  document.getElementById("output").value += value;
}

function evaluateSum() {
  let x = document.getElementById("output").value;
  let y = eval(x);
  document.getElementById("output").value = y;
}
