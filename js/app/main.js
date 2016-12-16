var camera, iluminacao, objeto;

function setup() {
  createCanvas(640, 480);
}

function draw() {
  if (mouseIsPressed) {
    fill(0);
    point(mouseX, mouseY);
  } else {
    fill(255);
  }
}
