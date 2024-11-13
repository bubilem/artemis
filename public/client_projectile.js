class ClientProjectile {
  constructor(projectile) {
    this.update(projectile)
  }
  update(projectile) {
    this.x = projectile.x
    this.y = projectile.y
    this.r = projectile.r
  }

  draw(ctx) {
    ctx.globalAlpha = 1
    ctx.fillStyle = "#f22"
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }
}

export default ClientProjectile
