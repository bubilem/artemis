class ClientPlayer {
  constructor(p) {
    this.update(p)
  }
  update(p) {
    this.id = p.id
    this.name = p.name
    this.score = p.score
    this.hp = p.hp
    this.shield = p.shield
    this.x = p.x
    this.y = p.y
    this.angle = p.angle
    this.move = p.move
    this.thrust = p.thrust
    this.fired = p.fired
    this.projectile = p.projectile
    this.speed = Math.sqrt(
      this.move.x * this.move.x + this.move.y * this.move.y
    )
    this.hit = p.hit
  }

  drawPlayer(ctx, isLocalPlayer) {
    ctx.save()
    ctx.translate(this.x, this.y)
    if (isLocalPlayer) {
      this.drawCompass(ctx)
    }
    ctx.rotate(this.angle)
    if (isLocalPlayer) {
      this.drawdirectionArrow(ctx)
    }
    // Vykreslení plamene
    if (this.thrust > 0) {
      ctx.beginPath()
      ctx.moveTo(-4, 7)
      ctx.lineTo(4, 7)
      ctx.lineTo(0, this.thrust * 150 * (Math.random() / 2 + 0.5))
      ctx.closePath()
      ctx.fillStyle = "#F08"
      ctx.fill()
    }

    // Vykreslení raketky
    this.drawShield(ctx)

    ctx.globalAlpha = 1
    ctx.beginPath()
    ctx.moveTo(0, -10 - this.hit)
    ctx.lineTo(-6 - this.hit, 8 + this.hit)
    ctx.lineTo(6 + this.hit, 8 + this.hit)
    ctx.closePath()
    ctx.fillStyle = isLocalPlayer ? "#fff" : "#d22"
    ctx.fill()

    ctx.rotate(-this.angle)

    if (isLocalPlayer) {
      this.drawPlayerInfo(ctx)
    } else {
      this.drawEnemyInfo(ctx)
    }

    ctx.restore()
  }

  drawDeadPlayer(ctx, isLocalPlayer) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)
    ctx.globalAlpha = 1
    ctx.beginPath()
    ctx.moveTo(0, -10)
    ctx.lineTo(-6, 8)
    ctx.lineTo(6, 8)
    ctx.closePath()
    ctx.fillStyle = "#888"
    ctx.fill()

    ctx.rotate(-this.angle)

    if (isLocalPlayer) {
      this.drawPlayerInfo(ctx)
    } else {
      this.drawEnemyInfo(ctx)
    }
    ctx.restore()
  }

  drawCompass(ctx) {
    let alpha = this.angle
    if (this.speed > 0.001) {
      alpha = Math.atan2(this.move.y, this.move.x) + Math.PI / 2
    }
    ctx.rotate(alpha)
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.5
    ctx.strokeStyle = "#666"
    ctx.fillStyle = "#aaa"
    ctx.beginPath()
    ctx.arc(0, 0, 30, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(0, 0, 50, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, 50)
    ctx.lineTo(0, -50)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(50, 0)
    ctx.lineTo(-50, 0)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, -50)
    ctx.lineTo(4, -43)
    ctx.lineTo(-4, -43)
    ctx.closePath()
    ctx.fill()
    ctx.rotate(-alpha)
  }

  drawPlayerInfo(ctx) {
    ctx.globalAlpha = 0.8
    ctx.fillStyle = "#aaa"
    ctx.font = "10px Arial"
    ctx.fillText("SP: " + Math.round(this.speed * 1000), -15, 25)
    ctx.fillText("HP: " + Math.round(this.hp), -15, 35)
    ctx.fillText("SH: " + Math.round(this.shield), -15, 45)
    ctx.fillText(this.name + " " + this.score, -10, -20)
  }
  drawEnemyInfo(ctx) {
    ctx.globalAlpha = 0.8
    ctx.fillStyle = "#9aa"
    ctx.font = "10px Arial"
    ctx.fillText(this.name, -7, -20)
  }

  drawdirectionArrow(ctx) {
    ctx.strokeStyle = "#a00"
    ctx.fillStyle = "#a00"
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, -50)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, -59)
    ctx.lineTo(4, -52)
    ctx.lineTo(-4, -52)
    ctx.closePath()
    ctx.fill()
  }

  drawShield(ctx) {
    ctx.globalAlpha = this.shield / 40
    ctx.beginPath()
    ctx.moveTo(2, -13)
    ctx.moveTo(0, -14)
    ctx.lineTo(-2, -13)
    ctx.lineTo(-11, 11)
    ctx.lineTo(11, 11)
    ctx.closePath()
    ctx.lineWidth = 2
    ctx.strokeStyle = "#88f"
    ctx.stroke()
  }

  drawProjectile(ctx) {
    if (this.projectile.ttl <= 0) {
      return
    }
    ctx.save()
    ctx.translate(this.projectile.x, this.projectile.y)
    ctx.globalAlpha = 1
    ctx.beginPath()
    ctx.arc(0, 0, 4, 0, Math.PI * 2)
    ctx.fillStyle = "#f22"
    ctx.fill()
    ctx.restore()
  }
}

export default ClientPlayer
