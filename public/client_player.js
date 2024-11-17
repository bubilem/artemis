class ClientPlayer {
  constructor(player) {
    this.update(player)
  }
  update(player) {
    this.id = player.id
    this.name = player.name
    this.score = player.score
    this.hp = player.hp
    this.shield = player.shield
    this.x = player.x
    this.y = player.y
    this.dx = player.dx
    this.dy = player.dy
    this.angle = player.angle
    this.thrust = player.thrust
    this.thrust_rotate = player.thrust_rotate
    this.fired = player.fired
    this.speed = Math.sqrt(this.dx ** 2 + this.dy ** 2)
    this.hit = player.hit
    this.reload = player.reload
  }

  drawPlayer(ctx, isLocalPlayer) {
    ctx.save()
    ctx.translate(this.x, this.y)
    if (isLocalPlayer) {
      this.drawCompass(ctx)
    }
    ctx.rotate(this.angle)
    if (isLocalPlayer) {
      this.drawDirectionArrow(ctx)
    }
    if (this.thrust > 0) this.drawEngineTrail(ctx, this.thrust)
    this.drawShield(ctx)
    this.drawShip(ctx, isLocalPlayer ? "#fff" : "#d22", this.hit)
    ctx.rotate(-this.angle)
    if (isLocalPlayer) {
      this.drawPlayerInfo(ctx)
    } else {
      this.drawEnemyInfo(ctx)
    }
    ctx.restore()
  }

  drawShip(ctx, color, hit) {
    ctx.globalAlpha = 1
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(0, -10 - hit)
    ctx.lineTo(-6 - hit, 8 + hit)
    ctx.lineTo(6 + hit, 8 + hit)
    ctx.closePath()
    ctx.fill()
  }

  drawEngineTrail(ctx, thrust) {
    ctx.globalAlpha = 0.9
    ctx.fillStyle = "#F08"
    ctx.beginPath()
    ctx.moveTo(-4, 7)
    ctx.lineTo(4, 7)
    ctx.lineTo(0, thrust * 150 * (Math.random() / 2 + 0.5))
    ctx.closePath()
    ctx.fill()
  }

  drawDeadPlayer(ctx, isLocalPlayer) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)
    this.drawShip(ctx, "#888", 0)
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
      alpha = Math.atan2(this.dy, this.dx) + Math.PI / 2
    }
    ctx.rotate(alpha)
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.5
    ctx.strokeStyle = "#666"
    ctx.fillStyle = "#aaa"
    ctx.beginPath()
    ctx.arc(0, 0, 40, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(0, 0, 60, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, 60)
    ctx.lineTo(0, -60)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(60, 0)
    ctx.lineTo(-60, 0)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, -60)
    ctx.lineTo(4, -53)
    ctx.lineTo(-4, -53)
    ctx.closePath()
    ctx.fill()
    ctx.rotate(-alpha)
  }

  drawDirectionArrow(ctx) {
    ctx.globalAlpha = 0.5
    ctx.strokeStyle = "#a00"
    ctx.fillStyle = "#a00"
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, -60)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, -69)
    ctx.lineTo(4, -62)
    ctx.lineTo(-4, -62)
    ctx.closePath()
    ctx.fill()
  }

  drawPlayerInfo(ctx) {
    ctx.globalAlpha = 0.8
    ctx.fillStyle = "#aaa"
    ctx.font = "10px Arial"
    ctx.fillText(this.name + " " + this.score, -10, -20)
    let th = Math.round(this.thrust * 100)
    let rtdir = ""
    if (this.thrust_rotate != 0) {
      rtdir = this.thrust_rotate > 0 ? "R" : "L"
    }
    let rt = Math.abs(Math.round(this.thrust_rotate * 1000))
    ctx.fillText(`SP: ${Math.round(this.speed * 1000)}`, -20, 25)
    ctx.fillText(`TH: ${th}+${rtdir}${rt}`, -20, 35)
    let hp = Math.round(this.hp)
    let sh = Math.round(this.shield)
    ctx.fillText(`HP: ${hp}+${sh}`, -20, 45)
  }
  drawEnemyInfo(ctx) {
    ctx.globalAlpha = 0.8
    ctx.fillStyle = "#aaa"
    ctx.font = "10px Arial"
    ctx.fillText(this.name, -7, -20)
  }

  drawShield(ctx) {
    ctx.globalAlpha = this.shield / 40
    ctx.lineWidth = 3
    ctx.strokeStyle = "#88f"
    ctx.beginPath()
    ctx.moveTo(3, -13)
    ctx.lineTo(0, -15)
    ctx.lineTo(-3, -13)
    ctx.lineTo(-11, 11)
    ctx.lineTo(11, 11)
    ctx.closePath()
    ctx.stroke()
  }
}

export default ClientPlayer
