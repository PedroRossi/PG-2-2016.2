document.getElementById('camera').disabled = false;
document.getElementById('iluminacao').disabled = true;
document.getElementById('objeto').disabled = true;
document.getElementById('plano').disabled = true;


function loadCamera(data) {
  document.getElementById('iluminacao').disabled = true;
  document.getElementById('objeto').disabled = true;
  document.getElementById('plano').disabled = true;
  camera = {};
  var a;
  a = data[0].split(' ');
  var c = new Ponto3D(a[0], a[1], a[2]);
  a = data[1].split(' ');
  var n = new Vetor(a[0], a[1], a[2]);
  a = data[2].split(' ');
  var v = new Vetor(a[0], a[1], a[2]);
  a = data[3].split(' ');
  var d = a[0];
  var hx = a[1];
  var hy = a[2];
  camera = new Camera(c, n, v, d, hx, hy);
  // console.log("Camera");console.log(camera);
  camera.genAlfa();
  document.getElementById('iluminacao').disabled = false;
}

function loadIluminacao(data) {
  document.getElementById('objeto').disabled = true;
  document.getElementById('plano').disabled = true;
  iluminacao = {};
  var a;
  a = data[0].split(' ');
  var pl = new Ponto3D(a[0], a[1], a[2]);
  var ka = data[1];
  var a = data[2].split(' ');
  var ia = new Vetor(a[0], a[1], a[2]);
  var kd = data[3];
  var a = data[4].split(' ');
  var od = new Vetor(a[0], a[1], a[2]);
  var ks = data[5];
  var a = data[6].split(' ');
  var il = new Vetor(a[0], a[1], a[2]);
  var n = data[7];
  iluminacao = new Iluminacao(pl, ka, ia, kd, od, ks, il, n);
  // console.log("Iluminacao");console.log(iluminacao);
  iluminacao.pl.getPontoVista(camera);
  document.getElementById('objeto').disabled = false;
}

function loadObjeto(data) {
  document.getElementById('plano').disabled = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var pontos3D = [];
  var pontos2D = [];
  triangulos3D = [];
  triangulos2D = [];
  var a;
  a = data[0].split(' ');
  var qntP = a[0];
  var qntT = a[1];
  var i;
  for (i = 1; i <= qntP; ++i) {
    a = data[i].split(' ');
    var p = new Ponto3D(a[0], a[1], a[2]);
    p = p.getPontoVista(camera);
    pontos3D.push(p);
  }
  for(var j = 0; j < qntT; ++j, ++i) {
    a = data[i].split(' ');
    var t = new Triangulo(pontos3D[a[0]-1], pontos3D[a[1]-1], pontos3D[a[2]-1]);
    t.calcularNormal();
    var normal = t.normal;
    pontos3D[a[0]-1].normal = pontos3D[a[0]-1].normal.add(normal);
    pontos3D[a[1]-1].normal = pontos3D[a[1]-1].normal.add(normal);
    pontos3D[a[2]-1].normal = pontos3D[a[2]-1].normal.add(normal);
  }
  for (var a = 0; a < pontos3D.length; a++) {
    pontos3D[a].normal.normalizar();
    pontos2D[a] = pontos3D[a].getPontoTela(camera);
  }
  i-=qntT;
  for(var j = 0; j < qntT; ++j, ++i) {
    a = data[i].split(' ');
    var t = new Triangulo(pontos3D[a[0]-1], pontos3D[a[1]-1], pontos3D[a[2]-1]);
    t.calcularNormal();
    triangulos3D.push(t);
    t = new Triangulo(pontos2D[a[0]-1], pontos2D[a[1]-1], pontos2D[a[2]-1]);
    t.ordenar();
    triangulos2D.push(t);
  }
  desenharObjeto();
  document.getElementById('plano').disabled = false;
}

function loadPlano(data) {
  var s = data[0];
  var a;
  a = data[1].split(' ');
  var p1 = new Ponto3D(a[0], a[1], a[2]);
  a = data[2].split(' ');
  var p2 = new Ponto3D(a[0], a[1], a[2]);
  a = data[3].split(' ');
  var p3 = new Ponto3D(a[0], a[1], a[2]);
  plano = new Plano(p1, p2, p3, s);
  var v1 = plano.calcularVetorNormal();
  var d = plano.calcularD();
  // console.log("Plano");console.log(plano);
  // console.log(v1); console.log(d);
  document.getElementById('plano').disabled = false;
}

function handleFileSelect(evt) {
  var next;
  switch (this.id) {
    case 'camera':
      next = loadCamera;
    break;
    case 'objeto':
      next = loadObjeto;
    break;
    case 'iluminacao':
      next = loadIluminacao;
    break;
    case 'plano':
      next = loadPlano;
    break;
  }
  var file = evt.target.files[0]; // FileList object

  var reader = new FileReader();
  // Closure to capture the file information.
  reader.onload = (function(file) {
    return function(e) {
      var data = this.result.split('\n');
      next(data);
    };
  })(file);
  reader.readAsText(file);
}

document.getElementById('camera').addEventListener('change', handleFileSelect, false);
document.getElementById('iluminacao').addEventListener('change', handleFileSelect, false);
document.getElementById('objeto').addEventListener('change', handleFileSelect, false);
document.getElementById('plano').addEventListener('change', handleFileSelect, false);
