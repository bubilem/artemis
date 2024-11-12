class ServerAsteroid {
  constructor(x, y, r) {
    this.x = x
    this.y = y
    this.r = r
    this.move = { x: 0, y: 0 }
  }

  update(game) {
    this.updatePosition()
    this.stayInCanvas(800, 800)
    this.checkProjectileHit(game)
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

  checkProjectileHit(game) {
    for (let id in game.projectiles) {
      const projectile = game.projectiles[id]
      if (
        Math.abs(projectile.x - this.x) < this.r &&
        Math.abs(projectile.y - this.y) < this.r
      ) {
        this.move.x += projectile.dx / 20
        this.move.y += projectile.dy / 20
        projectile.deactivate()
      }
    }
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
