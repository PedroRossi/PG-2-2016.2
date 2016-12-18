var camera, iluminacao, plano, largura = 640, altura = 480;
var triangulos3D = [];
var triangulos2D = [];
var zBuffer;

Math.clamp = function(val, min, max) {
  return Math.min(Math.max(val, min), max);
};

// CANVAS
document.getElementById('canvas').width = largura;
document.getElementById('canvas').height = altura;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
