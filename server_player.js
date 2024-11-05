class ServerPlayer {
  constructor(id) {
    this.id = id
    this.name = ""
    this.score = 0
    this.hp = 100
    this.x = Math.random() * 600 + 100
    this.y = Math.random() * 400 + 100
    this.angle = 0
    this.move = { x: 0, y: 0 }
    this.thrust = 0
    this.fired = 0
    this.projectile = { ttl: 0, x: 0, y: 0, dx: 0, dy: 0 }
    this.hit = 0
  }

  updatePosition(angle, thrust) {
    if (this.hp > 0) {
      this.angle = angle
      this.thrust = thrust
    }
    if (this.thrust > 0) {
      this.move.x += (Math.sin(this.angle) * this.thrust) / 1000
      this.move.y -= (Math.cos(this.angle) * this.thrust) / 1000
    }
    this.x += this.move.x
    this.y += this.move.y
    if (this.hit > 0) this.hit--
  }

  stayInCanvas(width, height) {
    if (this.x < 0) this.x = width
    if (this.x > width) this.x = 0
    if (this.y < 0) this.y = height
    if (this.y > height) this.y = 0
  }

  updateProjectile(fired) {
    if (fired == 1 && this.hp > 0 && this.projectile.ttl == 0) {
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
        Math.abs(this.projectile.x - enemy.x) < 20 &&
        Math.abs(this.projectile.y - enemy.y) < 20
      ) {
        this.score++
        this.projectile.ttl = 0
        this.projectile.dx = 0
        this.projectile.dy = 0
        enemy.hp -= 10
        if (enemy.hp <= 0) enemy.hp = 0
        enemy.hit = 40
      }
    }
  }

  checkPlayerHit(players) {
    for (let id in players) {
      const enemy = players[id]
      if (enemy.id == this.id) {
        continue
      }
      if (Math.abs(this.x - enemy.x) < 20 && Math.abs(this.y - enemy.y) < 20) {
        this.hit = 40
        this.hp -= 10
        if (this.hp <= 0) this.hp = 0
        const move = this.move
        this.move = enemy.move
        enemy.move = move
        enemy.hit = 40
        enemy.hp -= 10
        if (enemy.hp <= 0) enemy.hp = 0
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
      hp: this.hp,
      score: this.score,
      x: this.x,
      y: this.y,
      angle: this.angle,
      move: this.move,
      thrust: this.thrust,
      fired: this.fired,
      projectile: this.projectile,
      hit: this.hit,
    }
  }
}

export default ServerPlayer
