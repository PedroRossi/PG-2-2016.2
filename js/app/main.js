var camera, iluminacao, largura = 640, altura = 480;
var triangulos3D = [];
var triangulos2D = [];
document.getElementById('canvas').width = largura;
document.getElementById('canvas').height = altura;
var zBuffer = new Array(largura);
for (var i = 0; i < zBuffer.length; i++) {
  zBuffer[i] = new Array(altura);
  for (var j = 0; j < zBuffer[i].length; j++) zBuffer[i][j] = Infinity;
}

// CANVAS
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// P5JS
// function setup() {
//   createCanvas(largura, altura);
//   noLoop();
// }
//
// var draw = function(x, y) {
//   if (mouseIsPressed) {
//     fill(0);
//     point(x, y);
//   } else {
//     fill(255);
//   }
// }
