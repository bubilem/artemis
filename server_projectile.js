class ServerProjectile {
  constructor(player) {
    this.x = player.x
    this.y = player.y
    this.dx = Math.sin(player.angle) * 8
    this.dy = -Math.cos(player.angle) * 8
    this.ttl = 100
    this.r = 3
    this.playerId = player.id
  }

  update() {
    this.updatePosition()
    this.stayInCanvas(800, 800)
    this.ttl--
    if (this.ttl <= 0) {
      this.deactivate()
    }
  }

  updatePosition() {
    this.x += this.dx
    this.y += this.dy
  }

  deactivate() {
    this.ttl = 0
    this.dx = 0
    this.dy = 0
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
    }
  }
}

export default ServerProjectile
