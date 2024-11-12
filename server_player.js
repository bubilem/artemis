class ServerPlayer {
  constructor(id) {
    this.id = id
    this.name = ""
    this.score = 0
    this.hp = 100
    this.shield = 40
    this.x = Math.random() * 600 + 100
    this.y = Math.random() * 400 + 100
    this.dx = 0
    this.dy = 0
    this.angle = 0
    this.thrust = 0
    this.fired = 0
    this.hit = 0
  }

  updateControl(playerData) {
    this.name = playerData.name
    if (this.hp > 0) {
      this.angle = playerData.angle
      this.thrust = playerData.thrust
      if (playerData.fired == 1) {
        this.fired = 1
      }
    } else {
      this.thrust = 0
    }
  }

  update(game) {
    this.updateShield()
    if (this.hit > 0) this.hit--
    this.updatePosition()
    this.stayInCanvas(800, 800)
    this.checkPlayerHit(game)
    this.checkProjectileHit(game)
  }

  updatePosition() {
    if (this.thrust > 0) {
      this.dx += (Math.sin(this.angle) * this.thrust) / 500
      this.dy -= (Math.cos(this.angle) * this.thrust) / 500
    }
    this.x += this.dx
    this.y += this.dy
  }

  stayInCanvas(width, height) {
    if (this.x < 0) this.x = width
    if (this.x > width) this.x = 0
    if (this.y < 0) this.y = height
    if (this.y > height) this.y = 0
  }

  updateShield() {
    this.shield += 0.05
    if (this.shield > 40) this.shield = 40
  }

  checkProjectileHit(game) {
    for (let id in game.projectiles) {
      const projectile = game.projectiles[id]
      if (projectile.playerId == this.id) {
        continue
      }
      if (
        Math.abs(projectile.x - this.x) < 20 &&
        Math.abs(projectile.y - this.y) < 20
      ) {
        this.takeDamage(20)
        this.dx += projectile.dx / 40
        this.dy += projectile.dy / 40
        game.players[projectile.playerId].score++
        projectile.deactivate()
      }
    }
  }

  checkPlayerHit(game) {
    for (let id in game.players) {
      const enemy = game.players[id]
      if (enemy.id == this.id || this.hp <= 0 || enemy.hp <= 0) {
        continue
      }
      if (Math.abs(this.x - enemy.x) < 16 && Math.abs(this.y - enemy.y) < 16) {
        this.takeDamage(20)
        enemy.takeDamage(20)
        const dx = this.dx
        const dy = this.dy
        this.dx = enemy.dx
        this.dy = enemy.dy
        enemy.dx = dx
        enemy.dy = dy
      }
    }
  }

  takeDamage(damage = 20) {
    this.hit = damage * 3
    if (this.hp <= 0) return
    this.shield -= damage
    if (this.shield <= 0) {
      this.hp += this.shield
      this.shield = 0
      if (this.hp <= 0) {
        this.hp = 0
      }
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      hp: this.hp,
      shield: this.shield,
      score: this.score,
      x: this.x,
      y: this.y,
      dx: this.dx,
      dy: this.dy,
      angle: this.angle,
      thrust: this.thrust,
      fired: this.fired,
      projectile: this.projectile,
      hit: this.hit,
    }
  }
}

export default ServerPlayer
