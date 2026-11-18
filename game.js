const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
ctx.strokeStyle = "black";

const keysDown = new Map();
window.addEventListener('keydown', (event) => {
  //event.preventDefault()
  if (!keysDown.has(event.code)) {
    keysDown.set(event.code, performance.now());
  }
});
window.addEventListener('keyup', (event) => {
  keysDown.delete(event.code);
});

var placed = new Map();
var placeable = new Set(["1,0", "1,1", "0,1", "-1,1", "-1,0", "-1,-1", "0,-1", "1,-1"]);
var turn = "o";
const neighRay = [];
for (let i=-4; i<1; i++) {
  neighRay.push([[0,i], [0,i+1], [0,i+2], [0,i+3], [0,i+4]]);
  neighRay.push([[i,0], [i+1,0], [i+2,0], [i+3,0], [i+4,0]]);
  neighRay.push([[i,i], [i+1,i+1], [i+2,i+2], [i+3,i+3], [i+4,i+4]]);
  neighRay.push([[i,-i], [i+1,-i-1], [i+2,-i-2], [i+3,-i-3], [i+4,-i-4]]);
}
placed.set("0,0",'x');

function placeChar(c, x, y) {
  const pos = x + "," + y;
  placeable.delete(pos);
  placed.set(pos, c);
  const n = neighbors(x,y);
  for (const neigh of n) {
    const neighed = neigh[0] + "," + neigh[1];
    if (!placed.has(neighed)) {placeable.add(neighed);}
  }
  return fiveInRow(c,x,y);
}

function neighbors(x,y) {
  const allneigh = new Set()
  for (let dx=-1; dx<2; dx++) {
    for (let dy=-1; dy<2; dy++) {
      if (dx!=0 || dy!=0) {
        allneigh.add([x+dx, y+dy]);
      }
    }
  }
  return allneigh;
}

function fiveInRow(c,x,y) {
  for (const checkers of neighRay) {
    var allright = true;
    for (const hi of checkers) {
      if ( (placed.get((x+hi[0]) + "," + (y+hi[1]) ) ?? "b") != c ) {
        allright = false;
        break;
      }
    }
    if (allright) {return true;}
  }
  return false;
}

var tileSize = 64;
let prevFrame = 0;
var turn = "x";

function renderBoard() {
  ctx.beginPath();
  for (let x=0; x<canvas.width; x+=tileSize) {
    ctx.moveTo(x+0.5,0);
    ctx.lineTo(x+0.5,canvas.height);
  }
  for (let y=0; y<canvas.height; y+=tileSize) {
    ctx.moveTo(0,y+0.5);
    ctx.lineTo(canvas.width,y+0.5);
  }
  ctx.stroke();
}

function updateClick(Cx, Cy) {
  let xpos = Math.floor(Cx/tileSize);
  let ypos = Math.floor(Cy/tileSize);
  if (turn=="x") {
    turn = "o";
    ctx.fillStyle = "#FF0000";
  } else if (turn=="o") {
    turn = "x";
    ctx.fillStyle = "#0000FF";
  }
  ctx.fillRect(xpos*tileSize+0.5,ypos*tileSize+0.5,tileSize,tileSize);
  ctx.strokeRect(xpos*tileSize+0.5,ypos*tileSize+0.5,tileSize,tileSize);
  if (placeChar(turn, xpos, ypos)) {alert("The winner is " + turn);}
}

renderBoard();
updateClick(10*tileSize,5*tileSize);

canvas.addEventListener('click', (event) => {updateClick(event.clientX, event.clientY);});
window.addEventListener("resize", () => {canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; renderBoard();});