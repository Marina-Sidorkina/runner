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
  autoScroll: true,
  floorTiles: [
    new floor(0, 140)
  ],
  stop: function() {
    this.autoScroll = false;
  },
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
    if(!this.autoScroll) {
      return;
    }
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
  downwardForce: world.gravity,
  jumpHeight: 0,
  getDistanceFor: function(x) {
    const platformBelow = world.getDistanceToFloor(x);
    return world.height - this.y - platformBelow;
  },
  draw: function() {
    ctx.fillStyle = 'green';
    ctx.fillRect(player.x, player.y - player.height, this.height, this.width);
  },
  applyGravity: function() {
    this.currentDistanceAboveGround = this.getDistanceFor(this.x);
    const rightHandSideDistance = this.getDistanceFor(this.x + this.width);
    if(this.currentDistanceAboveGround < 0 || rightHandSideDistance < 0) {
      world.stop();
    }
  },
  processGravity: function() {
    this.y += this.downwardForce;
    let floorHeight = world.getDistanceToFloor(this.x);
    let topYofPlatform = world.height - floorHeight;
    if(this.y > topYofPlatform) {
      this.y = topYofPlatform;
    }
    if(this.downwardForce < 0) {
      this.jumpHeight += (this.downwardForce * -1);
      if(this.jumpHeight >= player.height * 6) {
        this.downwardForce = world.gravity;
        this.jumpHeight = 0;
      }
    }
  },
  keyPress: function() {
    const floorHeight = world.getDistanceToFloor(this.x + this.width);
    const onTheFloor = floorHeight === (world.height - this.y);
    if(onTheFloor) {
      this.downwardForce = -8;
    }
  },
  tick: function() {
    this.processGravity();
    this.applyGravity();
  }
}

window.addEventListener('keypress', function(keyInfo) {
  player.keyPress(keyInfo);
}, false);

function tick() {
  player.tick();
  world.tick();
  world.draw();
  player.draw();
  window.setTimeout('tick()', 1000/60)
}

tick();