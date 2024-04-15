// sketch.js - purpose and description here
// Author: Marco Ogaz-Vega
// Date: 4/14/24

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

const grassColor = "#707533";
const skyColor = "#A9C0BA";
const roadColor = "#BCB89F";
const lineColor = "#B2A45D"; 
const treeColor = "#1B251D";
// Define the colors for the layers
let layerColors = [];
// = ["#90ABB2", "#C4CECD", "#D2C5B2"];

let cars = []; // Array to store car objects
let offScreenCars = []; // Array to store car objects driving off-screen from the horizon

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
    
    }

}

class Point {
  constructor(x, y) {
      this.x = x;
      this.y = y;
  }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  createCanvas(400, 200);
  let button = createButton("reimagine").mousePressed(() => {
    seed = millis(); // Set seed to current time in milliseconds
    redraw(); // Redraw the canvas with the new seed
  })
  button.position(42, 685);
  
  // Start spawning cars at different intervals
  setInterval(spawnCar, 3000); // Spawn a car every second
  setInterval(spawnCar, 3350); // Spawn a car every two seconds
  setInterval(spawnCar, 3700); // Spawn a car every three seconds
  // Start spawning off-screen cars at different intervals
  setInterval(spawnOffScreenCar, 3000); // Spawn a car every second
  setInterval(spawnOffScreenCar, 3350); // Spawn a car every two seconds
  setInterval(spawnOffScreenCar, 3700); // Spawn a car every three seconds

  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

  // $(window).resize(function() {
  //   resizeScreen();
  // });
  // resizeScreen();
}

// draw() function is called repeatedly, it's the main animation loop
function draw() { 
  // code to run when method is called
  randomSeed(seed);

  background(100);

  noStroke();

  // Generate sky color
  let randomSkyColor = color(random(0, 127), random(0, 127), random(50, 255));
  fill(randomSkyColor);
  rect(0, 0, width, height / 2);

  // Generate grass
  let randomGrassColor = color(random(100, 200), random(200, 255), random(100, 200));
  fill(randomGrassColor);
  rect(0, height / 2, width, height / 2);

  // Draw mountain layers
  layerColors[0] = color(random(50, 100), random(50, 100), random(50, 100));
  layerColors[1] = color(random(150, 200), random(150, 200), random(150, 200));
  layerColors[2] = color(random(200, 255), random(200, 255), random(200, 255));
  for (let layer = 0; layer < layerColors.length; layer++) {
    fill(layerColors[layer]);
    beginShape();
    vertex(0, height / 2);
    const steps = 10;

    let maxHeight;
    // Adjust the range of random heights based on the layer index
    if (layer === 0) {
      // For the first layer, reduce the maxHeight to ensure visibility of subsequent layers
      maxHeight = height - 20; // Adjust the factor as needed
    } else  if (layer === 1) {
      maxHeight = height / 2 ;
    }else  if (layer === 2) {
      maxHeight = height / 3 ;
    }

    for (let i = 0; i < steps + 1; i++) {
      let x = (width * random(i - 1, i)) / steps;
      let y = height / 2 - (random() * random() * random() * maxHeight) - 20;
      vertex(x, y);
    }
    vertex(width + 20, height / 2);
    endShape(CLOSE);
  }

  let randomRoadColor = color(random(100, 200)); // Adjust the range as needed
  fill(randomRoadColor);
  // Draw road
  beginShape();
  vertex(width / 2 + 5, height / 2);
  vertex(width / 2 - 5, height / 2);
  vertex(width / 5, height);
  vertex(width / 5 * 4, height);
  endShape(CLOSE);

  // Draw divider in the middle of road
  fill(lineColor);
  beginShape();
  vertex(width / 2 - 5, height);
  vertex(width / 2 + 5, height);
  vertex(width / 2, height / 2);
  endShape(CLOSE);
 
  const polygon = [
    new Point(width / 2 + 5, height / 2),
    new Point(width / 2 - 5, height / 2),
    new Point(width / 5, height),
    new Point(width / 5 * 4, height)
  ];
  // Draw trees
  let randomTreeColor = color(random(50, 100), random(100, 200), random(50, 100)); // Random green color for trees
  fill(randomTreeColor);
  const trees = random(70, 100);
  for (let i = 0; i < trees; i++) {
    let z;
    let x, y;
    let pointcheck;
    do {
      z = random();
      x = random(width); // Random x position
      y = height / 2 + height / 20 / z;
      pointcheck = new Point(x, y);
    } while (
      // Ensure the tree is not in the road area
      // Check if tree's x and y position falls within the road area
      point_in_polygon(pointcheck, polygon) == true || y > height
    );
    let s = width / 50 / z;
    triangle(x, y - s, x - s / 4, y, x + s / 4, y);
  }



  // Update and draw cars
  for (let i = cars.length - 1; i >= 0; i--) {
    let car = cars[i];
    drawCar(car.x, car.y, car.size, car.angle, car.carColor);
    
    // Move cars towards the target point (width / 2, height / 2)
    let targetX = width / 2;
    let targetY = height / 2;
    let dx = targetX - car.x;
    let dy = targetY - car.y;
    let distance = sqrt(dx * dx + dy * dy);
    if (distance > 1) { // If the car is not at the target point
      car.x += dx / 50; // Adjust the division factor to control speed
      car.y += dy / 50;
    } else { // If the car reaches the target point, remove it from the array
      cars.splice(i, 1);
    }
    
    // Adjust the size of the cars based on their distance from the target point
    car.size = map(distance, 0, width / 2, 10, 50); // Adjust the range of sizes as needed
  }
  
  // Update and draw cars driving off-screen from the horizon
  for (let i = offScreenCars.length - 1; i >= 0; i--) {
    let car = offScreenCars[i];
    drawCar(car.x, car.y, car.size, car.angle, car.carColor);

    // Move cars towards their off-screen target point
    let dx = car.targetX - car.x;
    let dy = car.targetY - car.y;
    let distance = sqrt(dx * dx + dy * dy);

    // Calculate speed based on distance (inversely proportional)
    let speed = map(distance, 0, width / 2, 1, 100); // Adjust the range of speeds as needed

    if (distance > 1) { // If the car is not at the target point
      car.x += dx / speed; // Adjust speed based on distance
      car.y += dy / speed;
    } else { // If the car reaches the target point, remove it from the array
      offScreenCars.splice(i, 1);
    }

    // Adjust the size of the cars based on their distance from the target point
    car.size = map(distance, 0, width / 2, 30, 1); // Adjust the range of sizes as needed
  }
  
}

// Function to draw a car
function drawCar(x, y, size, angle, carColor) {
  fill(carColor);
  push(); // Save current drawing state
  translate(x, y); // Move to car position
  rotate(angle); // Rotate the car
  scale(-1, 1);
  beginShape();
  vertex(-size / 2, 0); // Left corner
  vertex(0, -size / 4); // Top corner
  vertex(size / 2, 0); // Right corner
  vertex(0, size / 4); // Bottom corner
  endShape(CLOSE);
  pop(); // Restore previous drawing state
}

// Function to spawn a car
function spawnCar() {
  let x = random(width / 2 + 50, width / 5 * 4 - 50); // Random x position within the specified range
  let y = height + 20; // Spawn off-screen with an offset
  let size = 5; // Set initial size small
  let angle = x > width / 2 ? 180 : 90; // Random angle for car slant
  let carColor = color(random(255), random(255), random(255)); // Random color for car
  cars.push({x, y, size, angle, carColor}); // Add car object to the array
}

// Function to spawn a car driving off-screen from the horizon
function spawnOffScreenCar() {
  let x = width / 2; // Spawn from the horizon
  let y = height / 2; // Horizon level
  let targetX = random(width / 5 + 50, width / 2 - 50); // Random target x position off-screen
  let targetY = height + 20; // Off-screen with an offset
  let size = 0; // Random size
  let angle = 90; // Angle for car slant (driving downwards)
  let carColor = color(random(255), random(255), random(255)); // Random color for car
  offScreenCars.push({x, y, targetX, targetY, size, angle, carColor}); // Add car object to the array

}

// Function to check if the tree is to the right of the line created by the bottom right and top right vertices of the road
function leftOrRightSideOfLine(Ax, Ay, Bx, By, x, y) {
  //line from A=(x1,y1) to B=(x2,y2) a point P=(x,y)
  //d=(x−x1)(y2−y1)−(y−y1)(x2−x1)
  let position = (x - Ax) * (By - Ay) - (y - Ay) * (Bx - Ax);
  return position; // Check if the tree is below the line
}

function point_in_polygon(point, polygon) {
  const num_vertices = polygon.length;
  const x = point.x;
  const y = point.y;
  let inside = false;

  let p1 = polygon[0];
  let p2;

  for (let i = 1; i <= num_vertices; i++) {
      p2 = polygon[i % num_vertices];

      if (y > Math.min(p1.y, p2.y)) {
          if (y <= Math.max(p1.y, p2.y)) {
              if (x <= Math.max(p1.x, p2.x)) {
                  const x_intersection = ((y - p1.y) * (p2.x - p1.x)) / (p2.y - p1.y) + p1.x;

                  if (p1.x === p2.x || x <= x_intersection) {
                      inside = !inside;
                  }
              }
          }
      }

      p1 = p2;
  }

  return inside;
}