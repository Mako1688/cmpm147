// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;

function preload() {
  tilesetImage = loadImage(
    "./img/tilesetP8.png"
  );
}

function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized
  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  select("#asciiBox").input(reparseGrid);

  reseed();
}


function draw() {
  randomSeed(seed);
  drawGrid(currentGrid);
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

function generateGrid(numCols, numRows) {
  let grid = [];
  // Fill the grid with empty spaces initially
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }

  // Generate a random height for the box
  let boxHeight = Math.floor(Math.random() * (numRows - 3)) + 1; // Ensuring the box doesn't touch the top of the grid
  let boxStartX = Math.floor(Math.random() * (numCols - 3)) + 1;

  // Fill the bottom row with dots to create the box
  for (let j = boxStartX; j < numCols; j++) {
    grid[numRows - boxHeight][j] = ".";
  }

  // Fill every grid tile below the box with "."
  for (let i = numRows - boxHeight + 1; i < numRows; i++) {
    for (let j = boxStartX; j < numCols; j++) {
      grid[i][j] = ".";
    }
  }

  // Fill the grid with random -
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (Math.random() < 0.05 && isFarFromDot(grid, i, j, 2)) {
        if(determineSandOrientation(grid, i, j) === 'default'){
          grid[i][j] = "-";
        }
      }
    }
  }

  return grid;
}


function gridCheck(grid, i, j, target) {
  if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length) {
    return grid[i][j] === target;
  }
  return false;
}

function drawGrid(grid) {
  background(128);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === '_') {
        let sandOrientation = determineSandOrientation(grid, i, j);
        if (sandOrientation === 'left') {
          // Draw the appropriate tile for "_" pointing towards "x" to the left
          placeTile(i, j, random(0, 3), 14);
          placeTile(i, j, 6,19); // Tile ID: 2 (pointing left)
        } else if (sandOrientation === 'right') {
          // Draw the appropriate tile for "_" pointing towards "x" to the right
          placeTile(i, j, random(0, 3), 14);
          placeTile(i, j, 4,19); // Tile ID: 2 (pointing right)
        } else if (sandOrientation === 'up') {
          // Draw the appropriate tile for "_" pointing towards "x" upwards
          placeTile(i, j, random(0, 3), 14);
          placeTile(i, j, 5,20); // Tile ID: 2 (pointing up)
        } else if (sandOrientation === 'down') {
          // Draw the appropriate tile for "_" pointing towards "x" downwards
          placeTile(i, j, random(0, 3), 14);
          placeTile(i, j, 5,18); // Tile ID: 2 (pointing down)
        } else if (sandOrientation === 'corner'){
          placeTile(i, j, random(0, 3), 14);
          placeTile(i, j, 4,18); // Tile ID: 2 (pointing corner)
        }else {
          if(isFarFromDot(grid, i, j, 5)){
            placeTile(i, j, random(1, 3), random(18, 19));
          } else {
            placeTile(i, j, random(9, 11), random(18, 19));
          }
        }
      } else if (grid[i][j] === '.') {
        // Draw the default tile for "."
        placeTile(i, j, random(0, 3), 14);
      } else if (grid[i][j] === '-') {
        // Draw the default tile for "-"
        if(isFarFromDot(grid, i, j, 5)){
          placeTile(i, j, random(1, 3), random(18, 19));
        } else {
          placeTile(i, j, random(9, 11), random(18, 19));
        }
        
        placeTile(i, j, 26, Math.round(random(0, 1)));
      }
    }
  }
  
  // Overlay semi-transparent wavy lines
  drawHeatHaze();
  
}

function determineSandOrientation(grid, i, j) {
  // Check neighboring tiles for water
  if (gridCheck(grid, i, j - 1, 'x') || gridCheck(grid, i, j - 1, '.')) {
    return 'left'; // Sand bordering water on the left
  } else if (gridCheck(grid, i, j + 1, 'x') || gridCheck(grid, i, j + 1, '.')) {
    return 'right'; // Sand bordering water on the right
  } else if (gridCheck(grid, i - 1, j, 'x') || gridCheck(grid, i - 1, j, '.')) {
    return 'up'; // Sand bordering water from above
  } else if (gridCheck(grid, i + 1, j, 'x') || gridCheck(grid, i + 1, j, '.')) {
    return 'down'; // Sand bordering water from below
  } else if(gridCheck(grid, i + 1, j+1, '.')){
    return 'corner';
  } else {
    return 'default'; // No adjacent water tiles
  }
}


function isFarFromDot(grid, x, y, distance) {
  for (let i = Math.max(0, x - distance); i <= Math.min(grid.length - 1, x + distance); i++) {
    for (let j = Math.max(0, y - distance); j <= Math.min(grid[0].length - 1, y + distance); j++) {
      if (grid[i][j] === ".") {
        return false;
      }
    }
  }
  return true;
}

function drawHeatHaze() {
  // Set the color for the wavy lines (adjust opacity as needed)
  fill(255, 100); // Semi-transparent white
  noStroke();

  // Define parameters for the wavy lines
  let spacing = 20; // Spacing between each wavy line
  let amplitude = 10; // Amplitude of the wavy lines
  let speed = 0.02; // Speed of the wavy lines

  // Draw the wavy lines
  for (let y = 0; y < height; y += spacing) {
    beginShape();
    for (let x = 0; x < width; x++) {
      let yOffset = amplitude * sin(x * speed + frameCount * speed);
      vertex(x, y + yOffset);
    }
    vertex(width, y + amplitude * sin(width * speed + frameCount * speed));
    vertex(width, y);
    endShape(CLOSE);
  }
}
