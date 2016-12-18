var camera, iluminacao, plano, largura = 640, altura = 480;
var pontos3DMundo = [];
var triangulos3D = [];
var triangulos2D = [];
var zBuffer;

// CANVAS
document.getElementById('canvas').width = largura;
document.getElementById('canvas').height = altura;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
