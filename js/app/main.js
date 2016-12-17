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

function desenharPixel(x, y, cor) {

}


function desenharLinha(x1, x2, y) {
  for (var i = 0; i < x2-x1; i++) {
    // desenharPixel();
    ctx.fillRect(x1+i,y,10,10);
  }
}

function desenharTrianguloSuperior(p1, p2, p3) {
  var invslope1 = (p2.x - p1.x) / (p2.y - p1.y);
  var invslope2 = (p3.x - p1.x) / (p3.y - p1.y);

  var curx1 = p1.x;
  var curx2 = p1.x;
  var aux = 0;

  for (var scanlineY = p1.y; scanlineY <= p2.y; scanlineY++) {
    if(Math.trunc(curx1)-aux>1) {
      desenharLinha(Math.trunc(curx1), Math.trunc(curx2), scanlineY);
      aux = Math.trunc(curx1);
    }
    curx1 += invslope1;
    curx2 += invslope2;
  }
}

function desenharTrianguloInferior(p1, p2, p3) {
  var invslope1 = (p3.x - p1.x) / (p3.y - p1.y);
  var invslope2 = (p3.x - p2.x) / (p3.y - p2.y);

  var curx1 = p3.x;
  var curx2 = p3.x;
  var aux = 0;

  for (var scanlineY = p3.y; scanlineY > p1.y; scanlineY--) {
    if(Math.trunc(curx1)-aux>1) {
      desenharLinha(Math.trunc(curx1), Math.trunc(curx2), scanlineY);
      aux = Math.trunc(curx1);
    }
    curx1 -= invslope1;
    curx2 -= invslope2;
  }
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
