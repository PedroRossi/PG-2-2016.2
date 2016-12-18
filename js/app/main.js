var camera, iluminacao, largura = 800, altura = 800, painting = false, curX, curY;
var triangulos3D = [];
var triangulos2D = [];
// document.getElementById('canvas').width = largura;
// document.getElementById('canvas').height = altura;
var zBuffer = new Array(largura);
for (var i = 0; i < zBuffer.length; i++) {
  zBuffer[i] = new Array(altura);
  for (var j = 0; j < zBuffer[i].length; j++) zBuffer[i][j] = Infinity;
}

// CANVAS
// var mainCanvas = document.getElementById('canvas');
// var mainCtx = mainCanvas.getContext('2d');
// var auxCanvas = document.createElement('canvas');
// var auxCtx = auxCanvas.getContext('2d');

// P5JS
function setup() {
  createCanvas(largura, altura);
}

function draw() {
  if (painting) {
    fill(0);
    ellipse(curX, curY, 10, 10);
  } else {
    fill(255);
  }
}

painting = true;
curX = 10;
curY = 10;
var p = 100;
while(p--) {
  curX++;
}
