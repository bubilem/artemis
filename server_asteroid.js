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
    this.checkAsteroidHit(game)
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
        Math.sqrt((this.x - projectile.x) ** 2 + (this.y - projectile.y) ** 2) <
        this.r + projectile.r
      ) {
        this.dx += projectile.dx / 50
        this.dy += projectile.dy / 50
        projectile.deactivate()
      }
    }
  }

  checkAsteroidHit(game) {
    for (let id in game.asteroids) {
      const asteroid = game.asteroids[id]
      if (asteroid === this) continue
      if (
        Math.sqrt((this.x - asteroid.x) ** 2 + (this.y - asteroid.y) ** 2) <
        this.r + asteroid.r
      ) {
        const dx = this.dx
        const dy = this.dy
        this.dx = asteroid.dx / 2
        this.dy = asteroid.dy / 2
        asteroid.dx = dx / 2
        asteroid.dy = dy / 2
        this.updatePosition()
        asteroid.updatePosition()
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
