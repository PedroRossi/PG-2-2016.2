document.getElementById('iluminacao').disabled = true;
document.getElementById('objeto').disabled = true;
document.getElementById('plano').disabled = true;

function loadCamera(data) {
  if(!iluminacao) document.getElementById('iluminacao').disabled = false;
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
  if(iluminacao) {
    iluminacao.pl = iluminacao.pl.getPontoVista(camera);
    if(objeto) {

    }
  }
  document.getElementById('iluminacao').disabled = false;
}

function loadIluminacao(data) {
  if(!objeto) document.getElementById('objeto').disabled = false;
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
  iluminacao.pl = iluminacao.pl.getPontoVista(camera);
  document.getElementById('objeto').disabled = false;
}

function loadObjeto(data) {
  if(!plano) document.getElementById('plano').disabled = false;
  zBuffer = new Array(altura);
  for (var i = 0; i < zBuffer.length; i++) {
    zBuffer[i] = new Array(largura);
    for (var j = 0; j < zBuffer[i].length; j++) zBuffer[i][j] = Infinity;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var pontos3DVista = [];
  var pontos2DTela = [];
  pontos3DMundo = [];
  triangulos3D = [];
  triangulos2D = [];
  var a;
  a = data[0].split(' ');
  var qntP = a[0];
  var qntT = a[1];
  var i, f = 1000000; //0000
  centroide = new Ponto3D(0, 0, 0);
  for (i = 1; i <= qntP; ++i) {
    a = data[i].split(' ');
    var p = new Ponto3D(a[0], a[1], a[2]);
    centroide.x+=Number(p.x);
    centroide.y+=Number(p.y);
    centroide.z+=Number(p.z);
    centroide.x = Math.round(centroide.x*f)/f;
    centroide.y = Math.round(centroide.y*f)/f;
    centroide.z = Math.round(centroide.z*f)/f;
    pontos3DMundo.push(p);
    p = camera.getPontoVista(p);
    pontos3DVista.push(p);
  }
  centroide.x/=qntP;
  centroide.y/=qntP;
  centroide.z/=qntP;
  for(var j = 0; j < qntT; ++j, ++i) {
    a = data[i].split(' ');
    triangulosRef.push([a[0],a[1],a[2]]);
    var t = new Triangulo(pontos3DVista[a[0]-1], pontos3DVista[a[1]-1], pontos3DVista[a[2]-1]);
    t.calcularNormal();
    var normal = t.normal;
    pontos3DVista[a[0]-1].normal = pontos3DVista[a[0]-1].normal.add(normal);
    pontos3DVista[a[1]-1].normal = pontos3DVista[a[1]-1].normal.add(normal);
    pontos3DVista[a[2]-1].normal = pontos3DVista[a[2]-1].normal.add(normal);
  }
  for (var a = 0; a < pontos3DVista.length; a++) {
    pontos3DVista[a].normal.normalizar();
    pontos2DTela[a] = camera.getPontoTela(pontos3DVista[a]);
  }
  i-=qntT;
  for(var j = 0; j < qntT; ++j, ++i) {
    a = data[i].split(' ');
    var t = new Triangulo(pontos3DVista[a[0]-1], pontos3DVista[a[1]-1], pontos3DVista[a[2]-1]);
    t.calcularNormal();
    triangulos3D.push(t);
    t = new Triangulo(pontos2DTela[a[0]-1], pontos2DTela[a[1]-1], pontos2DTela[a[2]-1]);
    triangulos2D.push(t);
  }
  desenharObjeto();
  document.getElementById('plano').disabled = false;
}

function loadPlano(data) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  zBuffer = new Array(altura);
  for (var i = 0; i < zBuffer.length; i++) {
    zBuffer[i] = new Array(largura);
    for (var j = 0; j < zBuffer[i].length; j++) zBuffer[i][j] = Infinity;
  }
  var s = data[0];
  var a;
  a = data[1].split(' ');
  var p1 = new Ponto3D(a[0], a[1], a[2]);
  a = data[2].split(' ');
  var p2 = new Ponto3D(a[0], a[1], a[2]);
  a = data[3].split(' ');
  var p3 = new Ponto3D(a[0], a[1], a[2]);
  plano = new Plano(p1, p2, p3, s);
  var sinalCentroide = plano.calcularSinal(centroide);
  var pontos3DVista = [];
  var pontos2DTela = [];
  for (var i = 0; i < pontos3DMundo.length; i++) {
    var s = plano.calcularSinal(pontos3DMundo[i]);
    if(s != sinalCentroide) pontos3DMundo[i].invalido = true;
    else pontos3DMundo[i].invalido = false;
  }
  for (var i = 0; i < pontos3DMundo.length; i++) {
    var p = camera.getPontoVista(pontos3DMundo[i]);
    pontos3DVista.push(p);
    pontos2DTela.push(camera.getPontoTela(p));
  }
  for (var i = 0; i < triangulosRef.length; i++) {
    var p = triangulosRef[i];
    var t = new Triangulo(pontos3DVista[p[0]-1], pontos3DVista[p[1]-1], pontos3DVista[p[2]-1]);
    t.calcularNormal();
    var normal = t.normal;
    pontos3DVista[p[0]-1].normal = pontos3DVista[p[0]-1].normal.add(normal);
    pontos3DVista[p[1]-1].normal = pontos3DVista[p[1]-1].normal.add(normal);
    pontos3DVista[p[2]-1].normal = pontos3DVista[p[2]-1].normal.add(normal);
  }
  triangulos3D = [];
  triangulos2D = [];
  for (var i = 0; i < triangulosRef.length; i++) {
    var p = triangulosRef[i];
    var check = true;
    for(var j = 0; j < p.length && check; j++) {
      if(pontos3DMundo[p[j]-1].invalido) check = false;
    }
    if(!check) continue;
    var t = new Triangulo(pontos3DVista[p[0]-1], pontos3DVista[p[1]-1], pontos3DVista[p[2]-1]);
    triangulos3D.push(t);
    t = new Triangulo(pontos2DTela[p[0]-1], pontos2DTela[p[1]-1], pontos2DTela[p[2]-1]);
    triangulos2D.push(t);
  }
  // console.log(triangulos3D);
  // console.log(triangulos2D);
  desenharObjeto();
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
