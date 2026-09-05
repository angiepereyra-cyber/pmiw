let idle = [];
let caminar = [];
let fondo;
let cantFrames = 5;
let imagenesListas = 0;
let imagenesConError = [];
let estado = "caminar";   
let animar = 0;
let velocidadAnim = 12;
let posX, posY, vel;
let fondoOffset = 0;
let fondoAncho = 820;

function setup() {
  createCanvas(800, 600);
  posX = -80;   
  posY = height * 0.78;
  vel = 3;
  cargarSprites();
}

function cargarSprites() {
  fondo = loadImage("data/fondo_playa.png",() => { imagenesListas++; },() => { imagenesConError.push("data/fondo_playa.png"); });

  for (let i = 0; i < cantFrames; i++) {idle[i] = loadImage("data/idle_" + i + ".png",() => { imagenesListas++; },() => { imagenesConError.push("data/idle_" + i + ".png"); });
    caminar[i] = loadImage("data/caminar_" + i + ".png",() => { imagenesListas++; },() => { imagenesConError.push("data/caminar_" + i + ".png"); });
  }
}

function draw() {
  let totalEsperado = cantFrames * 2 + 1;

  if (imagenesListas + imagenesConError.length < totalEsperado) {
    background(0);
    fill(255);
    textAlign(LEFT, TOP);
    text("Cargando imagenes... " + imagenesListas + "/" + totalEsperado, 20, 20);
    return;
  }
  if (imagenesConError.length > 0) {
    background(0);
    fill(255, 80, 80);
    textAlign(LEFT, TOP);
    text("No se pudieron cargar:", 20, 20);
    for (let i = 0; i < imagenesConError.length; i++) {
      text(imagenesConError[i], 20, 45 + i * 20);
    }
    return;
  }

  fondoOffset -= 1.5;
  dibujarFondo(fondoOffset);
  moverPersonaje();       
  actualizarAnimacion();  

  let frames;
  if (estado === "idle") {
    frames = idle;
  } else if (estado === "caminar") {
    frames = caminar;
  }
  dibujarPersonaje(frames, posX, posY);

  fill(0);
  textAlign(LEFT, TOP);
  text("Estado: " + estado + "   Velocidad: " + velocidadAnim, 10, 20);
}

function dibujarFondo(offset) {
  imageMode(CORNER);
  let x = offset % fondoAncho;
  if (x > 0) x -= fondoAncho;
  for (let px = x; px < width; px += fondoAncho) {
    image(fondo, px, 0, fondoAncho + 8, height);  
  }
}

function moverPersonaje() {
  posX -= vel;
  if (posX < -80) {
    posX = width + 80;
  }

  if (keyIsDown(32)) {        
    estado = "idle";
  } else {
    estado = "caminar";
  }

  if (keyIsDown(UP_ARROW) && velocidadAnim > 2) velocidadAnim--;
  if (keyIsDown(DOWN_ARROW)) velocidadAnim++;
}

function actualizarAnimacion() {
  if (frameCount % velocidadAnim === 0) {
    animar++;
  }
  if (terminoAnimacion(animar, cantFrames)) {
    animar = 0;
  }
}

function terminoAnimacion(indice, cantidad) {
  if (indice >= cantidad) {
    return true;
  } else {
    return false;
  }
}
function dibujarPersonaje(frames, x, y) {
  push();
  imageMode(CENTER);
  translate(x, y);
  image(frames[animar], 0, 0);
  pop();
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    reiniciar();
  }
}

function reiniciar() {
  posX = width + 80;
  estado = "caminar";
  animar = 0;
  velocidadAnim = 12;
  fondoOffset = 0;
}
