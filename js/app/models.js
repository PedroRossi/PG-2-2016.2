function Vetor(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}
Vetor.prototype.normalizar = function() {
  var normal = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
  this.x/=normal;
  this.y/=normal;
  this.z/=normal;
  if(this.x == -0)this.x = 0;
  if(this.y == -0)this.y = 0;
  if(this.z == -0)this.z = 0;
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
Vetor.prototype.add = function(v) {
  return new Vetor(this.x+v.x, this.y+v.y, this.z+v.z);
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
  var r = this;
  r = r.sub(camera.c);
  r = r.multiplicarMatrix(camera.alfa);
  return r;
};
Ponto3D.prototype.getPontoTela = function(camera) {
  var x = (camera.d/camera.hx)*(this.x/this.z);
  var y = (camera.d/camera.hy)*(this.y/this.z);
  if(this.z == 0) {
    x = -1;
    y = 1;
  }
  var a = new Ponto2D(x, y);
  var r = new Ponto2D(((a.x + 1) * (largura / 2)), ((1 - a.y) * (altura / 2)));
  r.x = Math.trunc(r.x);
  r.y = Math.trunc(r.y);
  if(r.x == -0) r.x = 0;
  if(r.y == -0) r.y = 0;
  r.normal = this.normal;
  return r;
}
Ponto3D.prototype.multiplicar = function(k) {
  this.x*=k;
  this.y*=k;
  this.z*=k;
};

function Ponto2D(x, y) {
  this.x = x;
  this.y = y;
  this.normal = new Vetor(0, 0, 0);
}

function Triangulo(p1, p2, p3) {
  this.p1 = p1;
  this.p2 = p2;
  this.p3 = p3;
  this.normal = new Vetor(0, 0, 0);
}
Triangulo.prototype.ordenar = function () {
  var p1 = this.p1;
  var p2 = this.p2;
  var p3 = this.p3;
  if(this.p1.y > this.p2.y && this.p1.y > this.p3.y) {
    if(this.p2.y > this.p3.y) {
      this.p1 = p3;
      this.p2 = p2;
      this.p3 = p1;
    } else {
      this.p1 = p2;
      this.p2 = p3;
      this.p3 = p1;
    }
  } else if(this.p1.y > this.p3.y) {
    this.p1 = p3;
    this.p2 = p1;
    this.p3 = p2;
  } else if(this.p2.y > this.p3.y) {
    this.p1 = p1;
    this.p2 = p3;
    this.p3 = p2;
  }
};
Triangulo.prototype.calcularNormal = function() {
  var v2v1 = new Vetor(this.p2.x - this.p1.x, this.p2.y - this.p1.y, this.p2.z - this.p1.z);
  var v3v1 = new Vetor(this.p3.x - this.p1.x, this.p3.y - this.p1.y, this.p3.z - this.p1.z);
  this.normal = v2v1.produtoVetorial(v3v1);
  this.normal.normalizar();
  this.p1.normal.add(this.normal);
};
Triangulo.prototype.getTrianguloTela = function(camera) {
  return new Triangulo(this.p1.getPontoTela(camera),
                       this.p2.getPontoTela(camera),
                       this.p3.getPontoTela(camera));
};
Triangulo.prototype.varredura = function(index) {
  /* at first sort the three vertices by y-coordinate ascending so v1 is the topmost vertice */
  this.ordenar();
  /* here we know that v1.y <= v2.y <= v3.y */
  /* check for trivial case of bottom-flat triangle */
  if (this.p2.y == this.p3.y) varrerTrianguloSuperior(this, index);
  /* check for trivial case of top-flat triangle */
  else if (this.p1.y == this.p2.y) varrerTrianguloInferior(this, index);
  else {
    /* general case - split the triangle in a topflat and bottom-flat one */
    var p4 = new Ponto2D((this.p1.x + ((this.p2.y-this.p1.y)/(this.p3.y-this.p1.y)) * (this.p3.x-this.p1.x)),this.p2.y);
    var tSup = new Triangulo(this.p1, this.p2, p4);
    var tInf = new Triangulo(this.p2, p4, this.p3);
    varrerTrianguloSuperior(tSup, index);
    varrerTrianguloInferior(tInf, index);
  }
};
Triangulo.prototype.getPonto3DBaricentrico = function(cb) {
  var a = this.p1;
  var b = this.p2;
  var g = this.p3;
  a.multiplicar(cb.alfa);
  b.multiplicar(cb.beta);
  g.multiplicar(cb.gama);
  a = a.add(b);
  a = a.add(g);
  return a;
};
Triangulo.prototype.getVetorBaricentrico = function(cb) {
  var a = this.p1.normal;
  var b = this.p2.normal;
  var g = this.p3.normal;
  a.multiplicar(cb.alfa);
  b.multiplicar(cb.beta);
  g.multiplicar(cb.gama);
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

function Cor(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
}

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
Iluminacao.prototype.calcularCor = function(p, L) {
  var l = this.ia;
  l.multiplicar(this.ka);
  N.normalizar();
  L.normalizar();
  var pe_nl = N.produtoEscalar(L);
  var R = 2*this.n*(pe_nl) - L;
  l += this.od*this.il*this.kd*pe_nl;
  var pe_rv = R.produtoEscalar(V);
  for (var i = 0; i < this.n; i++) {
    pe_rv *= pe_rv;
  }
  l += this.ks*pe_rv*this.il;
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
  var normal = calcularVetorNormal();
  var d = this.s*(normal.x + normal.y + normal.z);
};
