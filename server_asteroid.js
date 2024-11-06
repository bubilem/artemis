class ServerAsteroid {
  constructor(x, y, r) {
    this.x = x
    this.y = y
    this.r = r
    this.move = { x: 0, y: 0 }
  }

  updatePosition() {
    this.x += this.move.x
    this.y += this.move.y
  }

  stayInCanvas(width, height) {
    if (this.x < 0) this.x = width
    if (this.x > width) this.x = 0
    if (this.y < 0) this.y = height
    if (this.y > height) this.y = 0
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      r: this.r,
      move: this.move,
    }
  }
}

export default ServerAsteroid
