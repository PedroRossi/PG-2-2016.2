var camera, iluminacao, plano, largura = 1280, altura = 720;
var pontos3DMundo = [];
var triangulos3D = [];
var triangulos2D = [];
var zBuffer;

// CANVAS
document.getElementById('canvas').width = largura;
document.getElementById('canvas').height = altura;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
