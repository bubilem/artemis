class ServerAsteroid {
  constructor(x, y, r) {
    this.x = x
    this.y = y
    this.dx = 0
    this.dy = 0
    this.r = r
  }

  update(game) {
    this.updatePosition()
    this.stayInCanvas(800, 800)
    this.checkProjectileHit(game)
  }

  updatePosition() {
    this.x += this.dx
    this.y += this.dy
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
        this.dx += projectile.dx / 50
        this.dy += projectile.dy / 50
        projectile.deactivate()
      }
    }
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      r: this.r,
    }
  }
}

export default ServerAsteroid
