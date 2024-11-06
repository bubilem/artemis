class ClientAsteroid {
  constructor(a) {
    this.update(a)
  }
  update(a) {
    this.x = a.x
    this.y = a.y
    this.r = a.r
    this.move = a.move
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
