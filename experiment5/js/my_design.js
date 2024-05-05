/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */


function getInspirations() {
  let inspiringArray = [
    {
      name: "Cat",
      assetUrl: "./img/cat.png",
      shape: "ellipse"
    },
    {
      name: "Cheetah",
      assetUrl: "./img/cheetah.png",
      shape: "any"
    },
    {
      name: "Flower",
      assetUrl: "./img/flower.png",
      shape: "ellipse"
    },
    {
      name: "Lines",
      assetUrl: "./img/lines.png",
      shape: "rect"
    },
    {
      name: "Hood",
      assetUrl: "./img/hood.png",
      shape: "any"
    },
    {
      name: "Tree",
      assetUrl: "./img/tree.png",
      shape: "any"
    },
  ];
  return inspiringArray;
}

function initDesign(inspiration) {
  resizeCanvas(inspiration.image.width / 10, inspiration.image.height / 10);
  // add the original image to #original
  const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${width}px;">`
  $('#original').empty();
  $('#original').append(imgHTML);
  let design = {
    bg: 128,
    fg: [],
    shape: inspiration.shape,
    widthRange: { min: 10, max: width/8 }, 
    heightRange: { min: 10, max: height/8 },
    rotation: { min: 0, max: TWO_PI }, 
    pointRange: { min: 3, max: 25 },
    opacityRange: {min: 50, max: 255}
  }
  
  for(let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height);
    let grayscaleValue = getGrayscaleValue(x, y, inspiration);
    let imageWidth = random(design.widthRange.min, design.widthRange.max);
    let imageHeight = random(design.heightRange.min, design.heightRange.max);
    let rotation = random(design.rotation.min, design.rotation.max);
    let points = random(design.pointRange.min, design.pointRange.max);
    let opacity = random(design.opacityRange.min, design.opacityRange.max)
    
    design.fg.push({x: x, y: y, w: imageWidth, h: imageHeight, fill: grayscaleValue, rotation: rotation, numPoints: points, opacity: opacity});
  }

  return design;
}


function getGrayscaleValue(x, y, inspiration) {
  // Get the color at the specified location from the inspiration image
  let inspirationColor = inspiration.image.get(int(x * 10), int(y * 10));
  
  // Convert the color to grayscale using luminance formula
  let grayscaleValue = (red(inspirationColor) + green(inspirationColor) + blue(inspirationColor)) / 3;
  
  // Return the grayscale value
  return grayscaleValue;
}


function renderDesign(design, inspiration) {
  background(design.bg);
  noStroke();
  for(let shape of design.fg) {
    fill(shape.fill, shape.opacity);
    push(); // Save the current drawing state
    translate(shape.x, shape.y); // Move the origin to the shape's position
    rotate(shape.rotation); // Rotate the canvas
    if(design.shape == "any"){
      beginShape();
      let numPoints = shape.numPoints;
      let angleIncrement = TWO_PI / numPoints;
      let radius = min(shape.w, shape.h) / 2; // Radius of the shape
      
      beginShape();
      for(let i = 0; i < numPoints; i++) {
        let x = cos(i * angleIncrement) * radius; // Calculate x-coordinate
        let y = sin(i * angleIncrement) * radius; // Calculate y-coordinate
        vertex(x, y); // Add vertex to the shape
      }
      endShape(CLOSE); // Close the shape
      
    } else if(design.shape == "ellipse"){
      ellipse(0, 0, shape.w, shape.h); // Draw the ellipse at (0, 0), which is now the translated origin
    } else if (design.shape == "rect"){
      rect(-shape.w / 2, -shape.h / 2, shape.w, shape.h); // Draw the rectangle at (0, 0), which is now the translated origin
    }
    pop(); // Restore the original drawing state
    
  }
}

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  for(let shape of design.fg) {
    shape.x = mut(shape.x, 0, width, rate);
    shape.y = mut(shape.y, 0, height, rate);
    shape.fill = getGrayscaleValue(shape.x, shape.y, inspiration);
    shape.w = mut(shape.w, design.widthRange.min, design.widthRange.max, rate);
    shape.h = mut(shape.h, design.heightRange.min, design.heightRange.max, rate);
    shape.rotation = mut(shape.rotation, design.rotation.min, design.rotation.max, rate);
    if(design.shape == "any"){
      shape.numPoints = mut(shape.numPoints, design.pointRange.min, design.pointRange.max, rate);
    }
    shape.opacity = mut(shape.opacity, design.opacityRange.min, design.opacityRange.max, rate);
  }
}


function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}