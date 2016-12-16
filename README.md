# PG-2-2016.2
Projeto 2 da cadeira de Processamento Gráfico, 2016.2 - CIn, UFPE

**Corte por um plano**

Objetivo:

Parte Geral: Implementar o método de visualização de objetos triangulados, através do algoritmo de conversão por varredura, com métodos de interpolação de Phong, com a visibilidade garantida pelo algoritmo do “z-buffer”.

Parte Específica: Fazer o corte do objeto com um plano arbitrário.

Descrição: O usuário, através de arquivos-texto ou interface gráfica, entra com dados do objeto (triangulado, com lista dos vértices e da conectividade, que determina os triângulos, de um arquivo-texto), atributos do objeto (ka, kd e ks, pontos flutuantes entre 0 e 1, ponto flutuante positivo e Od, tripla de pontos flutuantes entre 0 e 1,), atributos da cena (Ia, IL, triplas de ponto flutuante entre 0 e 255, PL, tripla de ponto flutuante) e os atributos da câmera virtual (C, N e V, triplas de pontos flutuantes, d, hx, e hy, pontos flutuantes positivos). Se desejado, o usuário entra com a,b,c e d os coeficientes de um plano qualquer (de equação: ax+by+cz+d=0). O seu sistema deve preparar a câmera, ortogonalizando V e gerando U, e depois os normalizando, fazer a mudança de coordenadas para o sistema de vista de todos os vértices do objeto e da posição da fonte de luz PL, gerar as normais dos triângulos e gerar as normais dos vértices (como recomendado em sala de aula). Para cada triângulo, calculam-se as projeções dos seus vértices e inicia-se assim a sua conversão por varredura. Para cada pixel (x, yscan), calculam-se suas coordenadas baricêntricas com relação aos vértices projetados, e multiplicam-se essas coordenadas pelos correspondentes vértices do triângulo 3D original para se obter uma aproximação para o ponto 3D original correspondente ao pixel atual. Após uma consulta ao z-buffer, se o ponto for aceito para pintura, testa-se ainda se o ponto está de um certo lado do plano (do mesmo lado do centroide do objeto), se o ponto não estiver desse certo lado, ele será ignorado. Caso contrário, calcula-se uma aproximação para a normal do ponto utilizando-se mesmas coordenadas baricêntricas multiplicadas pelas normais dos respectivos vértices originais. Calculam-se também os demais vetores (L, V e R) e os substitui na equação do modelo de iluminação de Phong produzindo a cor do pixel atual.
