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
    if(this.floorTiles.length >= 3) return;
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

function tick() {
  world.tick();
  world.draw();
  window.setTimeout('tick()', 1000/60)
}

tick();