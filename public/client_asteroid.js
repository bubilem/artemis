class ClientAsteroid {
  constructor(asteroid) {
    this.update(asteroid)
  }
  update(asteroid) {
    this.x = asteroid.x
    this.y = asteroid.y
    this.r = asteroid.r
  }

  draw(ctx) {
    ctx.globalAlpha = 1
    ctx.fillStyle = "#222"
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }
}

export default ClientAsteroid
