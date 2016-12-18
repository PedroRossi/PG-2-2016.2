function getCoordenadasBaricentricas(x, y, index) {
  var i, j;
  var sistema =
  [
    [triangulos2D[index].p1.x, triangulos2D[index].p2.x, triangulos2D[index].p3.x, x],
    [triangulos2D[index].p1.y, triangulos2D[index].p2.y, triangulos2D[index].p3.y, y],
    [1,1,1,1]
  ];
  var solucao = [0, 0, 0];
  var coef_10, coef_20, coef_21;
  coef_10 = -1.0 * sistema[1][0] / sistema[0][0];
  coef_20 = -1.0 * sistema[2][0] / sistema[0][0];
  for (j = 0; j < 4; j++) {
    sistema[1][j] += coef_10 * sistema[0][j];
    sistema[2][j] += coef_20 * sistema[0][j];
  }
  coef_21 = -1.0 * sistema[2][1] / sistema [1][1];
  for (j = 1; j < 4; j++) {
    sistema[2][j] += coef_21 * sistema[1][j];
  }
  solucao[2] = (sistema[2][3]) / sistema[2][2];
  solucao[1] = (sistema[1][3] - (solucao[2] * sistema[1][2])) / sistema[1][1];
  solucao[0] = (sistema[0][3] - (solucao[2] * sistema[0][2]) - (solucao[1] * sistema[0][1])) / sistema[0][0];
  var alfa, beta, gama;
  alfa = solucao[0];
  beta = solucao[1];
  gama = solucao[2];
  var r = {
    alfa: 1.0 - (beta + gama),
    beta: beta,
    gama: gama
  };
  return r;
}

function desenharPixel(x, y, cor) {
  var str = "rgb("+cor.x+", "+cor.y+", "+cor.z+")";
  ctx.fillStyle = str;
  ctx.fillRect(x,y,1,1);
}

function avaliarPonto(x, y, index) {
  var cb = getCoordenadasBaricentricas(x, y, index);
  var pl = triangulos3D[index].getPonto3DBaricentrico(cb);
  var N, V, L, R, cor = new Vetor(0, 0, 0);
  x = Math.round(x);
  if(pl.z < zBuffer[y][x]) {
    zBuffer[y][x] = pl.z;
    N = triangulos3D[index].getVetorBaricentrico(cb);
    N.normalizar();

    V = new Vetor((-1)*pl.x, (-1)*pl.y, (-1)*pl.z);
    V.normalizar();

    var c = iluminacao.pl.sub(pl);
    L = new Vetor(c.x, c.y, c.z);
    L.normalizar();

    if(V.produtoEscalar(N)<0) {
      N.x*=-1;
      N.y*=-1;
      N.z*=-1;
    }
    if(N.produtoEscalar(L)<0) {
      // nao possui componentes difusa nem especular.
      cor = iluminacao.getCor(L, null, V, null, pl);
    } else {
      var k = 2*N.produtoEscalar(L);
      var a = N.clone();
      a.multiplicar(k);
      R = a.sub(L);
      if(R.produtoEscalar(V)<0) {
        // nao possui componente especular.
        cor = iluminacao.getCor(L, N, V, null, pl);
      } else {
        cor = iluminacao.getCor(L, N, V, R, pl);
      }
    }
    desenharPixel(x, y, cor);
  }
}

function varrerTrianguloSuperior(t, index) {
  var invslope1 = (t.p2.x - t.p1.x) / (t.p2.y - t.p1.y);
  var invslope2 = (t.p3.x - t.p1.x) / (t.p3.y - t.p1.y);

  var curx1 = t.p1.x;
  var curx2 = t.p1.x;

  for (var y = t.p1.y; y <= t.p2.y; y++) {
    var ini = Math.round(curx1);
    var fin = Math.round(curx2);
    if(ini>fin) {
      var aux = ini;
      ini = fin;
      fin = aux;
    }
    for (var x = ini; x <= fin; x++) {
      if((x >= 0 && x < largura) && (y >= 0 && y < altura)) {
        avaliarPonto(x, y, index);
      }
    }
    curx1 += invslope1;
    curx2 += invslope2;
  }
}

function varrerTrianguloInferior(t, index) {
  var invslope1 = (t.p3.x - t.p1.x) / (t.p3.y - t.p1.y);
  var invslope2 = (t.p3.x - t.p2.x) / (t.p3.y - t.p2.y);

  var curx1 = t.p3.x;
  var curx2 = t.p3.x;

  for (var y = t.p3.y; y > t.p1.y; y--) {
    var ini = Math.round(curx1);
    var fin = Math.round(curx2);
    if(ini>fin) {
      var aux = ini;
      ini = fin;
      fin = aux;
    }
    for (var x = ini; x <= fin; x++) {
      if((x >= 0 && x < largura) && (y >= 0 && y < altura)) {
        avaliarPonto(x, y, index);
      }
    }
    curx1 -= invslope1;
    curx2 -= invslope2;
  }
}

function desenharObjeto() {
  for (var i = 0; i < triangulos2D.length; i++) {
    var t = triangulos2D[i];
    t.ordenar();
    if (t.p2.y == t.p3.y) varrerTrianguloSuperior(t, i);
    else if (t.p1.y == t.p2.y) varrerTrianguloInferior(t, i);
    else { // Separa o triangulo em dois
      var x = (t.p1.x + ((t.p2.y-t.p1.y)/(t.p3.y-t.p1.y)) * (t.p3.x-t.p1.x));
      var p4 = new Ponto2D(x,t.p2.y);
      var tSup = new Triangulo(t.p1, t.p2, p4);
      var tInf = new Triangulo(t.p2, p4, t.p3);
      varrerTrianguloSuperior(tSup, i);
      varrerTrianguloInferior(tInf, i);
    }
  }
}
