var camera, iluminacao, centroide, plano;
var largura = document.getElementById('main').offsetWidth;
var altura = document.getElementById('main').offsetHeight - document.getElementById('form').offsetHeight - 10;
largura = Math.trunc(largura/10)*10;
altura = Math.trunc(altura/10)*10;
var pontos3DMundo = [];
var triangulos3D = [];
var triangulos2D = [];
var triangulosRef = [];
var zBuffer;

// CANVAS
document.getElementById('canvas').width = largura;
document.getElementById('canvas').height = altura;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
