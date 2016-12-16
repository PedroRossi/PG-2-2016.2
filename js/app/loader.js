function loadCamera(data) {
  var a;
  a = data[0].split(' ');
  var c = new Ponto(a[0], a[1], a[2]);
  a = data[1].split(' ');
  var n = new Vetor(a[0], a[1], a[2]);
  a = data[2].split(' ');
  var v = new Vetor(a[0], a[1], a[2]);
  a = data[3].split(' ');
  var d = a[0];
  var hx = a[1];
  var hy = a[2];
  camera = new Camera(c, n, v, d, hx, hy);
  // console.log(camera);
  if(!camera.alfa.length) {
    camera.genAlfa();
    console.log(camera.alfa);
  }
}

function loadIluminacao(data) {
  var a;
  a = data[0].split(' ');
  var pl = new Ponto(a[0], a[1], a[2]);
  var ka = data[1];
  var a = data[2].split(' ');
  var ia = new Vetor(a[0], a[1], a[2]);
  var kd = data[3];
  var a = data[4].split(' ');
  var od = new Vetor(a[0], a[1], a[2]);
  var ks = data[5];
  var a = data[6].split(' ');
  var il = new Cor(a[0], a[1], a[2]);
  var n = data[7];
  iluminacao = new Iluminacao(pl, ka, ia, kd, od, ks, il, n);
  // console.log(iluminacao);
}

function loadObjeto(data) {
  var pontos = [];
  var triangulos = [];
  var a;
  a = data[0].split(' ');
  var qntP = a[0];
  var qntT = a[1];
  var i;
  for (i = 1; i <= qntP; ++i) {
    a = data[i].split(' ');
    var p = new Ponto(a[0], a[1], a[2]);
    pontos.push(p);
  }
  for(var j = 0; j < qntT; ++j, ++i) {
    a = data[i].split(' ');
    var t = new Triangulo(pontos[a[0]-1], pontos[a[1]-1], pontos[a[2]-1]);
    triangulos.push(t);
  }
  objeto = new Objeto(triangulos);
  // console.log(pontos);
  // console.log(triangulos);
  // console.log(objeto);
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
