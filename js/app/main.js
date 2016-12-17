var camera, iluminacao, objeto3D, objeto2D, largura = 640, altura = 480;
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

function desenharPixel(ponto, cor) {

}

// P5JS
// function setup() {
//   createCanvas(largura, altura);
// }
//
// var draw = function() {
//   if (mouseIsPressed) {
//     fill(0);
//     point(mouseX, mouseY);
//   } else {
//     fill(255);
//   }
// }
