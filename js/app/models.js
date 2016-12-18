function Vetor(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}
Vetor.prototype.normalizar = function() {
  var sum = (this.x*this.x + this.y*this.y + this.z*this.z);
  if(!sum) return;
  var normal = Math.sqrt(sum);
  this.x/=normal;
  this.y/=normal;
  this.z/=normal;
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
  return new Vetor(this.x*k, this.y*k, this.z*k);
};
Vetor.prototype.projecaoOrtogonal = function(v) {
  var k = (v.produtoEscalar(this))/(this.produtoEscalar(this));
  var r = new Vetor(this.x, this.y, this.z);
  r = r.multiplicar(k);
  return r;
};
Vetor.prototype.add = function(v) {
  return new Vetor(this.x+v.x, this.y+v.y, this.z+v.z);
};
Vetor.prototype.sub = function(v) {
  return new Vetor(this.x-v.x, this.y-v.y, this.z-v.z);
};
Vetor.prototype.gramSchmidt = function(v) {
  return this.sub(v.projecaoOrtogonal(this));
};
Vetor.prototype.clone = function () {
  return new Vetor(this.x, this.y, this.z);
};

function Ponto3D(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.normal = new Vetor(0, 0, 0);
}
Ponto3D.prototype.sub = function(p) {
  return new Ponto3D(this.x - p.x, this.y - p.y, this.z - p.z);
};
Ponto3D.prototype.add = function(p) {
  return new Ponto3D(this.x + p.x, this.y + p.y, this.z + p.z);
};
Ponto3D.prototype.multiplicarMatrix = function(matrix) {
  var x = this.x*matrix[0][0] + this.y*matrix[0][1] + this.z*matrix[0][2];
  var y = this.x*matrix[1][0] + this.y*matrix[1][1] + this.z*matrix[1][2];
  var z = this.x*matrix[2][0] + this.y*matrix[2][1] + this.z*matrix[2][2];
  return new Ponto3D(x, y, z);
};
Ponto3D.prototype.getPontoVista = function(camera) {
  var a = this.clone();
  var b = a.sub(camera.c);
  var r = b.multiplicarMatrix(camera.alfa);
  return r;
};
Ponto3D.prototype.getPontoTela = function(camera) {
  var x = (camera.d/camera.hx)*(this.x/this.z);
  var y = (camera.d/camera.hy)*(this.y/this.z);
  var a = new Ponto2D(x, y);
  var r = new Ponto2D(((a.x + 1) * (largura / 2)), ((1 - a.y) * (altura / 2)));
  r.x = Math.round(r.x);
  r.y = Math.round(r.y);
  r.normal = this.normal.clone();
  return r;
}
Ponto3D.prototype.multiplicar = function(k) {
  return new Ponto3D(this.x*k, this.y*k, this.z*k);
};
Ponto3D.prototype.clone = function() {
  return new Ponto3D(this.x, this.y, this.z);
};

function Ponto2D(x, y) {
  this.x = x;
  this.y = y;
  this.normal = new Vetor(0, 0, 0);
}
Ponto2D.prototype.clone = function() {
  return new Ponto2D(this.x, this.y);
};

function Triangulo(p1, p2, p3) {
  this.p1 = p1;
  this.p2 = p2;
  this.p3 = p3;
  this.normal = new Vetor(0, 0, 0);
}
Triangulo.prototype.ordenar = function () {
  if(this.p1.y > this.p2.y) {
    var aux = this.p1.clone();
    this.p1 = this.p2;
    this.p2 = aux;
  }
  if(this.p2.y > this.p3.y) {
    var aux = this.p2.clone();
    this.p2 = this.p3;
    this.p3 = aux;
  }
  if(this.p1.y > this.p2.y) {
    var aux = this.p1.clone();
    this.p1 = this.p2;
    this.p2 = aux;
  }
};
Triangulo.prototype.calcularNormal = function() {
  var v2v1 = new Vetor(this.p2.x - this.p1.x, this.p2.y - this.p1.y, this.p2.z - this.p1.z);
  var v3v1 = new Vetor(this.p3.x - this.p1.x, this.p3.y - this.p1.y, this.p3.z - this.p1.z);
  this.normal = v2v1.produtoVetorial(v3v1);
  this.normal.normalizar();
};
Triangulo.prototype.getTrianguloTela = function(camera) {
  return new Triangulo(this.p1.getPontoTela(camera),
                       this.p2.getPontoTela(camera),
                       this.p3.getPontoTela(camera));
};
Triangulo.prototype.getPonto3DBaricentrico = function(cb) {
  var a = this.p1.clone();
  var b = this.p2.clone();
  var g = this.p3.clone();
  a = a.multiplicar(cb.alfa);
  b = b.multiplicar(cb.beta);
  g = g.multiplicar(cb.gama);
  return new Ponto3D(a.x+b.x+g.x, a.y+b.y+g.y, a.z+b.z+g.z);
};
Triangulo.prototype.getVetorBaricentrico = function(cb) {
  var a = this.p1.normal.clone();
  var b = this.p2.normal.clone();
  var g = this.p3.normal.clone();
  a = a.multiplicar(cb.alfa);
  b = b.multiplicar(cb.beta);
  g = g.multiplicar(cb.gama);
  a = a.add(b);
  a = a.add(g);
  return new Vetor(a.x, a.y, a.z);;
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

function Objeto(triangulos) {
  this.triangulos = triangulos;
}
Objeto.prototype.desenhar = function() {
  this.triangulos.forEach(function(triangulo) {
    triangulo.varredura();
  });
};

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
Iluminacao.prototype.getCor = function(L, N, V, R, p) {
  // V = new Vetor(camera.c.x-p.x, camera.c.y-p.y, camera.c.z-p.z); // C - P | C é o foco da camera
  // V.normalizar();
  var l = this.ia.clone();
  l = l.multiplicar(this.ka); // Ia * Ka
  if(N != null) {
    var pe_nl = N.produtoEscalar(L); // <N, L>
    a = this.od.clone(); // vetor OD Difuso
    a = a.produtoEscalar(this.il); // <Od, Il>
    a *= (this.kd*pe_nl); // <Od, Il> * Kd * <N, L>
    l = new Vetor(l.x+a, l.y+a, l.z+a); // l + a(cte)
  }
  if(R != null) {
    var pe_rv = R.produtoEscalar(V); // <R, V>
    var aux = pe_rv;
    for (var i = 0; i < this.n; i++) pe_rv *= aux; // n é a cte de rugosidade | <R, V> ^n
    a = this.il.clone(); // vetor Il
    a = a.multiplicar(this.ks*pe_rv); // Ks * <R, V>^n * Il
    l = l.add(a); // l + Ks * <R, V>^n * Il
  }
  l.x = Math.clamp(l.x,0,255);
  l.y = Math.clamp(l.y,0,255);
  l.z = Math.clamp(l.z,0,255);
  l.x = Math.round(l.x);
  l.y = Math.round(l.y);
  l.z = Math.round(l.z);
  return l;
};

function Plano(p1, p2, p3, s){
  this.p1 = p1;
  this.p2 = p2;
  this.p3 = p3;
  this.s = s;
}
Plano.prototype.calcularVetorNormal = function(){
  var v1 = new Vetor(this.p2.x - this.p1.x, this.p2.y - this.p1.y, this.p2.z - this.p1.z);
  var v2 = new Vetor(this.p3.x - this.p1.x, this.p3.y - this.p1.y, this.p3.z - this.p1.z);
  return v1.produtoVetorial(v2);
};
Plano.prototype.calcularD = function(){
  var normal = this.calcularVetorNormal();
  var x = normal.x*this.p1.x;
  var y = normal.y*this.p1.y;
  var z = normal.z*this.p1.z;
  var d = x + y + z;
  return d;
};
