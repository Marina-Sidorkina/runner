const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function floor(x, height) {
  this.x = x;
  this.width = 700;
  this.height = height
}

const world = {
  height: 400,
  width: 640,
  gravity: 10,
  highestFloor: 240,
  speed: 5,
  distanceTravelled: 0,
  floorTiles: [
    new floor(0, 140)
  ],
  moveFloor: function() {
    for(index in this.floorTiles) {
      const tile = this.floorTiles[index];
      tile.x -= this.speed;
      this.distanceTravelled += this.speed;
    }
  },
  addFutureTiles: function() {
    if(this.floorTiles.length >= 2) return;
    const previousTile = this.floorTiles[this.floorTiles.length - 1];
    const randomHeight = Math.floor(Math.random() * this.highestFloor) + 20;
    const leftValue = (previousTile.x + previousTile.width);
    const next = new floor(leftValue, randomHeight);
    this.floorTiles.push(next); 
  },
  cleanOldTiles: function() {
    for(index in this.floorTiles) {
      if(this.floorTiles[index].x <= -this.floorTiles[index].width) {
        this.floorTiles.splice(index, 1);
      }
    }
  },
  getDistanceToFloor: function(playerX) {
    for(index in this.floorTiles) {
      const tile = this.floorTiles[index];
      if(tile.x <= playerX && tile.x + tile.width >= playerX) {
        return tile.height;
      }
    }
    return -1;
  },
  tick: function() {
    this.cleanOldTiles();
    this.addFutureTiles();
    this.moveFloor();
  },
  draw: function() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.width, this.height);

    for(index in this.floorTiles) {
      const tile = this.floorTiles[index];
      const y = this.height - tile.height;
      ctx.fillStyle = 'blue';
      ctx.fillRect(tile.x, y, tile.width, tile.height);
    }
  }
}

const player = {
  x: 160,
  y: 340,
  height: 20,
  width: 20,
  draw: function() {
    ctx.fillStyle = 'green';
    ctx.fillRect(player.x, player.y - player.height, this.height, this.width);
  },
  applyGravity: function() {
    let platformBelow = world.getDistanceToFloor(this.x);
    this.currentDistanceAboveGround = world.height - this.y - platformBelow;
  },
  processGravity: function() {
    this.y += world.gravity;
    let floorHeight = world.getDistanceToFloor(this.x);
    let topYofPlatform = world.height - floorHeight;
    if(this.y > topYofPlatform) {
      console.log(this.y,topYofPlatform);
      this.y = topYofPlatform;
    }
  },
  tick: function() {
    this.processGravity();
    this.applyGravity();
  }
}

function tick() {
  player.tick();
  world.tick();
  world.draw();
  player.draw();
  window.setTimeout('tick()', 1000/60)
}

tick();