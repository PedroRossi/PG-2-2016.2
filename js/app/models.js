function Vetor(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}
Vetor.prototype.normalizar = function() {
  var norma = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
  this.x/=norma;
  this.y/=norma;
  this.z/=norma;
};
Vetor.prototype.produtoEscalar = function(v) {
  return (this.x*v.x + this.y*v.y + this.z*v.z);
};
Vetor.prototype.produtoVetorial = function(v) {
  var x = this.y*v.z - this.z*v.y;
  var y = this.z*v.x - this.x*v.z;
  var z = this.x*v.y - this.y*v.x;
  return new Vetor(x, y, z);
};
Vetor.prototype.multiplicar = function(k) {
  this.x*=k;
  this.y*=k;
  this.z*=k;
};
Vetor.prototype.projecaoOrtogonal = function(v) {
  var k = (v.produtoEscalar(this))/(this.produtoEscalar(this));
  var r = new Vetor(this.x, this.y, this.z);
  r.multiplicar(k);
  return r;
};
Vetor.prototype.sub = function(v) {
  return new Vetor(this.x-v.x, this.y-v.y, this.z-v.z);
};
Vetor.prototype.gramSchmidt = function(v) {
  return this.sub(v.projecaoOrtogonal(this));
};

function Ponto3D(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}
Ponto3D.prototype.sub = function(p) {
  return new Ponto3D(this.x - p.x, this.y - p.y, this.z - p.z);
};
Ponto3D.prototype.multiplicarMatrix = function(matrix) {
  var x = this.x*matrix[0][0] + this.y*matrix[0][1] + this.z*matrix[0][2];
  var y = this.x*matrix[1][0] + this.y*matrix[1][1] + this.z*matrix[1][2];
  var z = this.x*matrix[2][0] + this.y*matrix[2][1] + this.z*matrix[2][2];
  return new Ponto3D(x, y, z);
};
Ponto3D.prototype.getPontoVista = function(camera) {
  var r = this;
  r = r.sub(camera.c);
  r = r.multiplicarMatrix(camera.alfa);
  return r;
};
Ponto3D.prototype.getPonto2D = function(camera) {
  var r = new Ponto2D((camera.d/camera.hx)*(this.x/this.z), (camera.d/camera.hy)*(this.y/this.z));
  r.x = ((r.x + 1) * largura / 2);
  r.y = ((1 - r.y) * altura / 2);
  return r;
}

function Ponto2D(x, y) {
  this.x = x;
  this.y = y;
}

function Triangulo(p1, p2, p3) {
  this.p1 = p1;
  this.p2 = p2;
  this.p3 = p3;
  this.normal = 0;
}
Triangulo.prototype.calcularNormal = function() {
  var v2v1 = new Vetor(this.p2.x - this.p1.x, this.p2.y - this.p1.y, this.p2.z - this.p1.z);
  var v3v1 = new Vetor(this.p3.x - this.p1.x, this.p3.y - this.p1.y, this.p3.z - this.p1.z);
  this.normal = v2v1.produtoVetorial(v3v1);
  this.normal.normalizar();
};

function Camera(c, n, v, d, hx, hy) {
  this.c = c;
  this.n = n;
  this.v = v;
  this.d = d;
  this.hx = hx;
  this.hy = hy;
  this.alfa = [];
}
Camera.prototype.genAlfa = function() {
  this.n.normalizar();
  this.v = this.v.gramSchmidt(this.n);
  this.v.normalizar();
  var u = this.n.produtoVetorial(this.v);
  this.alfa.push([u.x, u.y, u.z]);
  this.alfa.push([this.v.x, this.v.y, this.v.z]);
  this.alfa.push([this.n.x, this.n.y, this.n.z]);
};

function Cor(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
}

function Objeto(triangles) {
  this.triangles = triangles;
}

function Iluminacao(pl, ka, ia, kd, od, ks, il, n) {
  this.pl = pl;
  this.ka = ka;
  this.ia = ia;
  this.kd = kd;
  this.od = od;
  this.ks = ks;
  this.il = il;
  this.n = n;
}
