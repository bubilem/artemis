class ServerPlayer {
  constructor(id, name) {
    this.id = id
    this.name = name
    this.score = 0
    this.hp = 100
    this.shield = 40
    this.x = Math.random() * 600 + 100
    this.y = Math.random() * 400 + 100
    this.dx = 0
    this.dy = 0
    this.angle = 0
    this.thrust = 0
    this.thrust_rotate = 0
    this.fired = 0
    this.reload = 0
    this.hit = 0
  }

  updateControl(playerControl) {
    if (this.hp > 0) {
      if (playerControl.thrust != undefined && playerControl.thrust != 0) {
        this.thrust += playerControl.thrust > 0 ? 0.01 : -0.01
        if (this.thrust > 1) this.thrust = 1
        if (this.thrust < 0) this.thrust = 0
      }
      if (
        playerControl.thrust_rotate != undefined &&
        playerControl.thrust_rotate != 0
      ) {
        this.thrust_rotate += playerControl.thrust_rotate > 0 ? 0.001 : -0.001
        if (this.thrust_rotate > 0.1) this.thrust_rotate = 0.1
        if (this.thrust_rotate < -0.1) this.thrust_rotate = -0.1
      }

      if (playerControl.fired == 1) this.fired = 1
    } else {
      this.thrust = 0
      this.thrust_rotate = 0
    }
  }

  update(game) {
    this.updateShield()
    if (this.hit > 0) this.hit--
    if (this.reload > 0) this.reload--
    this.updatePosition()
    this.stayInCanvas(800, 800)
    this.checkPlayerHit(game)
    this.checkProjectileHit(game)
    this.checkAsteroidHit(game)
  }

  updatePosition() {
    if (this.thrust > 0) {
      this.dx += (Math.sin(this.angle) * this.thrust) / 500
      this.dy -= (Math.cos(this.angle) * this.thrust) / 500
    }
    this.x += this.dx
    this.y += this.dy
    this.angle += this.thrust_rotate
    //this.angle %= Math.PI * 2
  }

  stayInCanvas(width, height) {
    if (this.x < 0) this.x = width
    if (this.x > width) this.x = 0
    if (this.y < 0) this.y = height
    if (this.y > height) this.y = 0
  }

  updateShield() {
    if (this.hp > 0) this.shield += 0.05
    if (this.shield > 40) this.shield = 40
  }

  checkProjectileHit(game) {
    for (let id in game.projectiles) {
      const projectile = game.projectiles[id]
      if (projectile.playerId == this.id) continue
      if (
        Math.abs(projectile.x - this.x) < 16 &&
        Math.abs(projectile.y - this.y) < 16
      ) {
        this.takeDamage(15)
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
      if (enemy.id == this.id) continue
      if (Math.abs(this.x - enemy.x) < 16 && Math.abs(this.y - enemy.y) < 16) {
        if (this.hp > 0) this.takeDamage(30)
        if (enemy.hp > 0) enemy.takeDamage(30)
        const dx = this.dx
        const dy = this.dy
        this.dx = enemy.dx
        this.dy = enemy.dy
        enemy.dx = dx
        enemy.dy = dy
        this.updatePosition()
        enemy.updatePosition()
      }
    }
  }

  checkAsteroidHit(game) {
    for (let id in game.asteroids) {
      const asteroid = game.asteroids[id]
      if (
        Math.abs(this.x - asteroid.x) < asteroid.r + 5 &&
        Math.abs(this.y - asteroid.y) < asteroid.r + 5
      ) {
        this.takeDamage(40)
        asteroid.dx += this.dx / 10
        asteroid.dy += this.dy / 10
        this.dx = -this.dx / 2
        this.dy = -this.dy / 2
        this.updatePosition()
        asteroid.updatePosition()
      }
    }
  }

  takeDamage(damage = 10) {
    this.hit = damage * 2
    if (this.hp <= 0) return
    this.shield -= damage
    if (this.shield <= 0) {
      this.hp += this.shield
      this.shield = 0
      if (this.hp <= 0) this.hp = 0
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
      thrust_rotate: this.thrust_rotate,
      fired: this.fired,
      reload: this.reload,
      hit: this.hit,
    }
  }
}

export default ServerPlayer
