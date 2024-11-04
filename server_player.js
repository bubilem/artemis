class ServerPlayer {
  constructor(id) {
    this.id = id
    this.name = ""
    this.score = 0
    this.x = Math.random() * 600 + 100
    this.y = Math.random() * 400 + 100
    this.angle = 0
    this.move = { x: 0, y: 0 }
    this.thrust = 0
    this.fired = 0
    this.projectile = { ttl: 0, x: 0, y: 0, dx: 0, dy: 0 }
  }

  updatePosition(angle, thrust) {
    this.angle = angle
    this.thrust = thrust
    if (this.thrust > 0) {
      this.move.x += (Math.sin(this.angle) * this.thrust) / 1000
      this.move.y -= (Math.cos(this.angle) * this.thrust) / 1000
    }
    this.x += this.move.x
    this.y += this.move.y
  }

  stayInCanvas(width, height) {
    if (this.x < 0) this.x = width
    if (this.x > width) this.x = 0
    if (this.y < 0) this.y = height
    if (this.y > height) this.y = 0
  }

  updateProjectile(fired) {
    if (fired == 1 && this.projectile.ttl == 0) {
      this.projectile.ttl = 350
      this.projectile.x = this.x
      this.projectile.y = this.y
      this.projectile.dx = Math.sin(this.angle) * 2
      this.projectile.dy = -Math.cos(this.angle) * 2
    } else if (this.projectile.ttl > 0) {
      this.projectile.x += this.projectile.dx
      this.projectile.y += this.projectile.dy
      this.projectile.ttl--
      if (this.projectile.ttl <= 0) {
        this.projectile.ttl = 0
        this.projectile.dx = 0
        this.projectile.dy = 0
      }
    }
  }

  checkProjectileHit(players) {
    if (this.projectile.ttl <= 0) {
      return
    }
    for (let id in players) {
      const enemy = players[id]
      if (enemy.id == this.id) {
        continue
      }
      if (
        Math.abs(this.projectile.x - enemy.x) < 25 &&
        Math.abs(this.projectile.y - enemy.y) < 25
      ) {
        this.score++
        console.log("Score:", this.score)
        this.projectile.ttl = 0
        this.projectile.dx = 0
        this.projectile.dy = 0
      }
    }
  }

  stayProjectileInCanvas(width, height) {
    if (this.projectile.ttl <= 0) {
      return
    }
    if (this.projectile.x < 0) this.projectile.x = width
    if (this.projectile.x > width) this.projectile.x = 0
    if (this.projectile.y < 0) this.projectile.y = height
    if (this.projectile.y > height) this.projectile.y = 0
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      score: this.score,
      x: this.x,
      y: this.y,
      angle: this.angle,
      move: this.move,
      thrust: this.thrust,
      fired: this.fired,
      projectile: this.projectile,
    }
  }
}

module.exports = ServerPlayer
