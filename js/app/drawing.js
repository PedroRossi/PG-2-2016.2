function getCoordenadasBaricentricas(x, y, index) {
  var i, j;
  var sistema = [[triangulos2D[index].p1.x, triangulos2D[index].p2.x, triangulos2D[index].p3.x, x], [triangulos2D[index].p1.y, triangulos2D[index].p2.y, triangulos2D[index].p3.y, y], [1,1,1,1]];
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
    alfa: alfa,
    beta: beta,
    gama: gama
  };
  return r;
}

function desenharPixel(x, y, cor) {
  ctx.fillRect(x,y,1,1);
  // pontosTela.push([x, y]);
}

function varrerLinha(x1, x2, y, index) {
  if(y >= altura || y < 0 || x1 >= largura || x2 <= 0) return;
  if(x2 > largura) x2 = largura;
  if(x1 < 0) x1 = 0;
  for (var i = 0; i < x2-x1; i++) {
    var x = x1+i;
    var cb = getCoordenadasBaricentricas(x, y, index);
    var pl = triangulos3D[index].getPonto3DBaricentrico(cb);
    if((x >= 0 && x < largura) && (y >= 0 && y < altura)) {
      if(pl.z < zBuffer[x][y]) {
        zBuffer[x][y] = pl.z;

  			var N = triangulos2D[index].getVetorBaricentrico(cb);
        N.normalizar();

        var V = new Vetor((-1)*pl.x, (-1)*pl.y, (-1)*pl.z);
        V.normalizar();

        var L = iluminacao.pl.sub(pl);
        L = new Vetor(L.x, L.y, L.z);
        L.normalizar();

        if(V.produtoEscalar(N)<0) {
          N.x*=-1;
          N.y*=-1;
          N.z*=-1;
        }
        if(N.produtoEscalar(L)<0) {
          // nao possui componentes difusa nem especular.
        } else {
          var k = 2*N.produtoEscalar(L);
          N.multiplicar(k);
          var R = N.sub(L);
          if(R.produtoEscalar(V)<0) {
            // nao possui componente especular.
          } else {
            /*
      			Substituir no modelo de Phong, obtendo a cor do pixel atual. Se alguma componente (r,g,b) der mais que 255, deixe-a em 255.
      			Pintar o pixel (P.x, P.y) com a cor obtida.
            */
            // console.log(x + " " + y);
            desenharPixel(x, y, 0);
          }
        }
      }
    }
  }
}

function varrerTrianguloSuperior(t, index) {
  var invslope1 = (t.p2.x - t.p1.x) / (t.p2.y - t.p1.y);
  var invslope2 = (t.p3.x - t.p1.x) / (t.p3.y - t.p1.y);

  var curx1 = t.p1.x;
  var curx2 = t.p1.x;

  for (var scanlineY = t.p1.y; scanlineY <= t.p2.y; scanlineY++) {
    varrerLinha(Math.trunc(curx1), Math.trunc(curx2), scanlineY, index);
    curx1 += invslope1;
    curx2 += invslope2;
  }
}

function varrerTrianguloInferior(t, index) {
  var invslope1 = (t.p3.x - t.p1.x) / (t.p3.y - t.p1.y);
  var invslope2 = (t.p3.x - t.p2.x) / (t.p3.y - t.p2.y);

  var curx1 = t.p3.x;
  var curx2 = t.p3.x;

  for (var scanlineY = t.p3.y; scanlineY > t.p1.y; scanlineY--) {
    varrerLinha(Math.trunc(curx1), Math.trunc(curx2), scanlineY, index);
    curx1 -= invslope1;
    curx2 -= invslope2;
  }
}

function desenharObjeto() {
  for (var i = 0; i < triangulos2D.length; i++) {
    var t = triangulos2D[i];
    if (t.p2.y == t.p3.y) varrerTrianguloSuperior(t, i);
    else if (t.p1.y == t.p2.y) varrerTrianguloInferior(t, i);
    else { // Separa o triangulo em dois
      var p4 = new Ponto2D((t.p1.x + ((t.p2.y-t.p1.y)/(t.p3.y-t.p1.y)) * (t.p3.x-t.p1.x)),t.p2.y);
      var tSup = new Triangulo(t.p1, t.p2, p4);
      var tInf = new Triangulo(t.p2, p4, t.p3);
      varrerTrianguloSuperior(tSup, i);
      varrerTrianguloInferior(tInf, i);
    }
  }
}
