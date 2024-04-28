"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

let waveOffsetX = 0;
let waveOffsetY = 0;

let shipOffsetX = 0;
let shipOffsetY = 0;
const width = 800;
const height = 400;

let shipDLW;
let shipURW;
let shipULW;
let shipDRW;
let waveURW;
let waveDLW;
let waveUR1W;
let waveUR2W;
let waveUR3W;
let landW;
let castleW;

function p3_preload(shipDL, shipUR, shipUL, shipDR, waveDL, waveUR, waveUR1, waveUR2, waveUR3, land, castle) {
    shipDLW = shipDL;
    shipURW = shipUR
    shipULW = shipUL;
    shipDRW = shipDR
    waveURW = waveUR;
    waveDLW = waveDL;
    waveUR1W = waveUR1;
    waveUR2W = waveUR2;
    waveUR3W = waveUR3;
    landW = land;
    castleW = castle;
}

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  let isLand = XXH.h32("tile:" + key, worldSeed) % 4 === 0;
  
  if (isLand) {
    // Toggle the castle sprite for land tiles
    if (clicks[key]) {
      delete clicks[key];
    } else {
      clicks[key] = true;
    }
  } else {
    // For non-land tiles, cycle through ship sprites
    let n = clicks[key] | 0;
    let maxClicks = 5; // Number of unique ship sprites

    if (n < maxClicks) {
      clicks[key] = n + 1;
    } else {
      delete clicks[key]; // Remove the sprite when all unique sprites have been cycled through
    }
  }
}

function p3_drawBefore() {
  // Update wave and ship offsets
  waveOffsetX += 0.01;
  waveOffsetY += 0.01;

  shipOffsetX += 0.01;
  shipOffsetY += 0.01;
}

function p3_drawTile(i, j, landW, waveUR2W, waveUR1W, castleW, shipDLW, shipURW, shipULW, shipDRW) {
  noStroke();
  
  // Determine tile-specific offsets for wave and ship oscillations
  let waveTileOffsetX = waveOffsetX + i * 0.5;
  let waveTileOffsetY = waveOffsetY + j * 0.5;

  let shipTileOffsetX = shipOffsetX + i * 0.5;
  let shipTileOffsetY = shipOffsetY + j * 0.5;
  
  let waveUsed;

  // Calculate the tint color based on tile properties
  if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
    waveUsed = landW;
  } else if (XXH.h32("tile:" + [i, j], worldSeed) % 3 == 0) {
    waveUsed = waveUR2W;
  } else {
    waveUsed = waveUR1W;
  }
  
  fill(100,149,237);
  

  push();

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  
  
  
  // Calculate the wave position with oscillation, if the wave image is not land
  if (waveUsed !== landW) {
    let waveX = -tw / 2 - 20 + 5 * sin(waveTileOffsetX);
    let waveY = -th / 2 - 20 + 5 * cos(waveTileOffsetY);
    
    // Draw the wave image over the tile with oscillation
    image(waveUsed, waveX, waveY, tw + 35, th + 35);
  } else {
    // If the wave image is land, simply draw it at the tile position without oscillation
    image(waveUsed, -tw / 2 - 20, -th / 2 - 20, tw + 35, th + 35);
  }
  
  noTint();

  let key = [i, j];
  let isLand = XXH.h32("tile:" + key, worldSeed) % 4 === 0;
  let n = clicks[key] | 0;
  let spriteImage;

  // Determine which sprite image to use based on the tile properties
  if (isLand) {
    spriteImage = clicks[key] ? castleW : null;
    if (spriteImage) {
      // Adjust size and position for the castle sprite
      let castleWidth = 32; // Adjust the width of the castle sprite
      let castleHeight = 32; // Adjust the height of the castle sprite
      let castleX = -castleWidth / 2; // Adjust the X position of the castle sprite
      let castleY = -castleHeight / 2; // Adjust the Y position of the castle sprite
      
      // Draw the castle sprite with the adjusted size and position
      image(spriteImage, castleX - 4, castleY - 10, castleWidth, castleHeight);
    }
  } else {
    if (n % 5 == 1) {
      spriteImage = shipDLW;
    } else if (n % 5 == 2) {
      spriteImage = shipURW;
    } else if (n % 5 == 3) {
      spriteImage = shipULW;
    } else if (n % 5 == 4) {
      spriteImage = shipDRW;
    }

    if (spriteImage) {
      // Draw the sprite image with oscillation
      let halfWidth = spriteImage.width / 2;
      let halfHeight = spriteImage.height / 2;
      let spriteX = -spriteImage.width / 2 + 5 * sin(shipTileOffsetX);
      let spriteY = -spriteImage.height / 2 + 5 * cos(shipTileOffsetY);
      
      image(spriteImage, spriteX + 15, spriteY + 10, halfWidth, halfHeight);
    }
  }

  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}
