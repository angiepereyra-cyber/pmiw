let pantalla = 0;
let imagenes = [];
let textos; 
let musica;
let letras = ["C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N"];   
let imagenesLetras = [];
let imagenActual;    // imagen d la pantalla en la que estamos
let estrellasX = [];     // inicio y d los creditos 
let estrellasY = [];
let estrellasTam = [];
let estrellasFase = [];    
const Y_ARRIBA = -60;
let tituloY = Y_ARRIBA;
const TITULO_Y_FINAL = 40;
const CANT_PANTALLAS = 15;
const PANTALLA_CREDITOS = 15;
const CANT_NUMERADAS = 12;               // imagenes pantalla 0 a pantalla 11
let letrasFinales = ["A", "B", "C"];     // imagenes pantallaFINALA, B y C
const CANT_ESTRELLAS = 90;

let lineasCreditos = [
  "La Casa de Asterion",
  "Autor de la obra: Jorge Luis Borges",
  "Integrantes:",
  "Angeles Pereyra",
  "Celina Quattrocchio",
  "Comision: 1"
];
let creditosYs = [];                   
const Y_PRIMERA_CREDITO = 50;           
const ESPACIADO_CREDITOS = 40;
const VELOCIDAD_CAIDA = 4;
const RETRASO_LINEAS = 50;           

let opcionesTexto = [
  ["Empezar"],           // 0
  ["Explorar las galerias", "Quedarse jugando en el patio"], 
  ["Ir hacia el patio con luz", "Seguir en la oscuridad"], 
  ["Preguntarle cosas a su otro yo", "Cansarse corriendo y dormirse"], 
  ["Seguir el hilo", "Ignorarlo y seguir explorando"], 
  ["Ir a investigar"], 
  ["Preguntar por que", "Enojarse y hacerlo desaparecer"], 
  ["Creer que fue un recuerdo real", "Despertar angustiado"], 
  ["Cruzarla", "Quedarse del lado de adentro"], 
  ["Quedarse en silencio, esperando"], 
  ["Esperar a que se acerquen"], 
  ["Aceptarlo", "Negarlo"], 
  ["Volver al inicio"], 
  ["Volver al inicio"], 
  ["Volver al inicio"]    // 14 FINAL C
];

let destinos = [           // a q pantalla lleva cada opcion
  [1], 
  [2, 3], 
  [4, 5], 
  [6, 7], 
  [8, 9], 
  [10], 
  [11, 11], 
  [10, 9], 
  [12, 13], 
  [13], 
  [14], 
  [13, 12], 
  [0], 
  [0], 
  [0]         
];

let letrasOpcion = [              // imagen q se muestra al llegar con cada opcion ("" = usa la de la pantalla a la q llega)
  [""], // 0
  ["", ""], // 1: usan pantalla2 y pantalla3
  ["C", "D"], // 2
  ["E", "F"], // 3
  ["G", "H"], // 4
  ["J"], // 5
  ["K", "L"], // 6
  ["M", "N"], // 7
  ["", ""], // 8: llevan a los finales
  [""], // 9
  [""], // 10
  ["", ""], // 11
  [""], // 12
  [""], // 13
  [""]           // 14
];

const X_INICIO = 650;          // boton empezar: abajo a la derecha
const Y_INICIO = 402;
const ANCHO_INICIO = 135;
const ALTO_INICIO = 36;

const X_CREDITOS = 15;         // boton creditos (y volver): abajo a la izquierda
const Y_CREDITOS = 402;
const ANCHO_CREDITOS = 135;
const ALTO_CREDITOS = 36;

const Y_BOTON = 375;
const ANCHO_BOTON = 360;
const ALTO_BOTON = 50;

function xBoton(i, cantidad) {
  if (cantidad === 1) {
    return width / 2 - ANCHO_BOTON / 2;
  }
  return 30 + i * 380;
}

function preload() {
  textos = loadStrings("data/textos.txt");    
  musica = loadSound("data/ambiente.mp3");

  for (let i = 0; i < CANT_NUMERADAS; i++) {
    imagenes[i] = loadImage("data/pantalla" + i + ".jpeg"); // armamos td con el indice y cargamos td con un for
  }
  // pantallaFINALA, B y C: van despues de las numeradas (posiciones 12, 13 y 14)
  for (let i = 0; i < letrasFinales.length; i++) {
    imagenes[CANT_NUMERADAS + i] = loadImage("data/pantallaFINAL" + letrasFinales[i] + ".jpeg");
  }
  for (let i = 0; i < letras.length; i++) {
    imagenesLetras[i] = loadImage("data/pantalla" + letras[i] + ".jpeg");
  }
}

function setup() {
  createCanvas(800, 450);
  noStroke();

  for (let i = 0; i < CANT_ESTRELLAS; i++) {
    agregarEstrella(random(width), random(height), random(2, 5));
  }
}

function draw() {
  background(0);
  if (pantalla === 0) {
    dibujarInicio();
  } else if (pantalla === PANTALLA_CREDITOS) {
    dibujarCreditos();
  } else {
    dibujarPantalla(pantalla);
  }
}

function buscarIndiceLetra(letra) {
  // recorremos el arreglo a mano, devuelve -1 si no esta
  for (let i = 0; i < letras.length; i++) {
    if (letras[i] === letra) {
      return i;
    }
  }
  return -1;
}

function cambiarPantalla(destino, letra) {
  pantalla = destino;
  let indice = buscarIndiceLetra(letra);
  if (indice >= 0) {
    imagenActual = imagenesLetras[indice];
  } else if (destino < CANT_PANTALLAS) {
    imagenActual = imagenes[destino];
  }
  if (pantalla === 0) {
    tituloY = Y_ARRIBA;                 // el titulo vuelve a bajar
  }
  if (pantalla === PANTALLA_CREDITOS) {
    reiniciarCreditos();
  }
}

function iniciarMusica() {
  userStartAudio();
  if (!musica.isPlaying()) {
    musica.setVolume(0.4);
    musica.loop();
  }
}

function agregarEstrella(x, y, tam) {
  estrellasX.push(x);
  estrellasY.push(y);
  estrellasTam.push(tam);
  estrellasFase.push(random(1000));
}

function dibujarEstrella(i) {
  let brillo = map(noise(frameCount * 0.02, estrellasFase[i]), 0, 1, 60, 255);
  noStroke();
  fill(255, brillo);
  circle(estrellasX[i], estrellasY[i], estrellasTam[i]);
}

function dibujarEstrellas() {
  for (let i = 0; i < estrellasX.length; i++) {
    dibujarEstrella(i);
  }
}

function moverTitulo() {
  tituloY += 3;
  if (tituloY > TITULO_Y_FINAL) {
    tituloY = TITULO_Y_FINAL;           // no se pasa de su lugar
  }
}

function dibujarTitulo() {
  textFont("Georgia");
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  textSize(60);
  fill(90, 0, 0);                       // sombra
  text("La Casa de Asterion", width / 2 + 3, tituloY + 3);
  fill(210, 20, 20);
  text("La Casa de Asterion", width / 2, tituloY);
}

function dibujarAutor() {
  textStyle(ITALIC);
  textSize(24);
  fill(210, 20, 20);
  text("Jorge Luis Borges", width / 2, 421);
}

function dibujarInicio() {
  dibujarEstrellas();                   
  image(imagenes[0], 120, 82, 560, 315);
  moverTitulo();
  dibujarTitulo();
  dibujarAutor();
  dibujarBoton(X_INICIO, Y_INICIO, ANCHO_INICIO, ALTO_INICIO, opcionesTexto[0][0]);
  dibujarBoton(X_CREDITOS, Y_CREDITOS, ANCHO_CREDITOS, ALTO_CREDITOS, "Creditos");
}

function dibujarPantalla(num) {
  image(imagenActual, 0, 0, width, height);
  dibujarCajaTexto(textos[num]);
  let cantidad = opcionesTexto[num].length;
  for (let i = 0; i < cantidad; i++) {            
    dibujarBoton(xBoton(i, cantidad), Y_BOTON, ANCHO_BOTON, ALTO_BOTON, opcionesTexto[num][i]);
  }
}

function dibujarCajaTexto(contenido) {
  noStroke();
  fill(0, 190);
  rect(30, 230, 740, 125, 10);
  fill(255);
  textFont("Georgia");
  textStyle(NORMAL);
  textSize(17);
  textAlign(LEFT, TOP);
  text(contenido, 45, 243, 710, 100);
}

function reiniciarCreditos() {
  for (let i = 0; i < lineasCreditos.length; i++) {  // cada linea arranca arriba, afuera del canvas, un poco mas arriba q la anterior
    creditosYs[i] = Y_ARRIBA - i * RETRASO_LINEAS;
  }
}

function moverLineaCredito(i) {
  let yFinal = Y_PRIMERA_CREDITO + i * ESPACIADO_CREDITOS;
  creditosYs[i] += VELOCIDAD_CAIDA;
  if (creditosYs[i] > yFinal) {
    creditosYs[i] = yFinal;
  }
}

function dibujarLineaCredito(i) {
  noStroke();
  textFont("Georgia");
  textAlign(CENTER, CENTER);

  if (i === 0) {
    textStyle(BOLD);
    textSize(44);
    fill(90, 0, 0);
    text(lineasCreditos[i], width / 2 + 3, creditosYs[i] + 3);
    fill(210, 20, 20);
    text(lineasCreditos[i], width / 2, creditosYs[i]);
  } else {
    textStyle(NORMAL);
    textSize(22);
    fill(255);
    text(lineasCreditos[i], width / 2, creditosYs[i]);
  }
}

function dibujarCreditos() {
  dibujarEstrellas();
  for (let i = 0; i < lineasCreditos.length; i++) {
    moverLineaCredito(i);
    dibujarLineaCredito(i);
  }
  dibujarBoton(X_CREDITOS, Y_CREDITOS, ANCHO_CREDITOS, ALTO_CREDITOS, "Volver");
}

function dibujarBoton(x, y, ancho, alto, etiqueta) {
  if (mouseSobre(x, y, ancho, alto)) {
    fill(160, 15, 40);                            // bordo
  } else {
    fill(110, 0, 25);
  }
  stroke(255);
  strokeWeight(2);
  rect(x, y, ancho, alto, 10);

  noStroke();
  fill(255);
  textFont("Georgia");
  textStyle(BOLD);
  textSize(16);
  textAlign(CENTER, CENTER);
  text(etiqueta, x + ancho / 2, y + alto / 2);
}

function mouseSobre(x, y, ancho, alto) {
  return mouseX > x && mouseX < x + ancho && mouseY > y && mouseY < y + alto;
}

function mousePressed() {
  iniciarMusica();

  if (pantalla === 0) {
    if (mouseSobre(X_INICIO, Y_INICIO, ANCHO_INICIO, ALTO_INICIO)) {
      cambiarPantalla(destinos[0][0], "");
    } else if (mouseSobre(X_CREDITOS, Y_CREDITOS, ANCHO_CREDITOS, ALTO_CREDITOS)) {
      cambiarPantalla(PANTALLA_CREDITOS, "");
    }
  } else if (pantalla === PANTALLA_CREDITOS) {
    if (mouseSobre(X_CREDITOS, Y_CREDITOS, ANCHO_CREDITOS, ALTO_CREDITOS)) {
      cambiarPantalla(0, "");
    }
  } else {
    let cantidad = opcionesTexto[pantalla].length;
    for (let i = 0; i < cantidad; i++) {
      if (mouseSobre(xBoton(i, cantidad), Y_BOTON, ANCHO_BOTON, ALTO_BOTON)) {
        cambiarPantalla(destinos[pantalla][i], letrasOpcion[pantalla][i]);
        return;                  
      }
    }
  }
}
