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
  speed: 5,
  distanceTravelled: 0,
  floorTiles: [
    new floor(0, 140)
  ],
  moveFloor: function() {
    for(index in this.floorTiles) {
      let tile = this.floorTiles[index];
      tile.x -= this.speed;
      this.distanceTravelled += this.speed;
    }
  },
  tick: function() {
    this.moveFloor();
  },
  draw: function() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.width, this.height);

    for(index in this.floorTiles) {
      let tile = this.floorTiles[index];
      let y = this.height - tile.height;
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