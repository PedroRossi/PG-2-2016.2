var camera, iluminacao, largura = 300, altura = 300, plano, pontosTela = [];
var triangulos3D = [];
var triangulos2D = [];
var zBuffer = new Array(largura);
for (var i = 0; i < zBuffer.length; i++) {
  zBuffer[i] = new Array(altura);
  for (var j = 0; j < zBuffer[i].length; j++) zBuffer[i][j] = Infinity;
}

// CANVAS
document.getElementById('canvas').width = largura;
document.getElementById('canvas').height = altura;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
// var auxCanvas = document.createElement('canvas');
// var auxCtx = auxCanvas.getContext('2d');

// P5JS
// function setup() {
//   createCanvas(largura, altura);
// }
//
// function draw() {
//   if (painting) {
//     fill(0);
//     ellipse(curX, curY, 10, 10);
//   } else {
//     fill(255);
//   }
// }
