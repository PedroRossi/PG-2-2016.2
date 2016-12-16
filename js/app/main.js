var camera, iluminacao, objeto, largura = 640, altura = 480, z-buffer = new Array(largura);
for (var i = 0; i < z-buffer.length; i++) z-buffer[i] = new Array(altura);

// CANVAS
// var canvas = document.getElementById('canvas');
// var ctx = canvas.getContext('2d');

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
