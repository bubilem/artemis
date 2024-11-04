import ClientPlayer from "./client_player.js"
const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")
const socket = io()

const bgImage = new Image()
bgImage.src = "bg.webp"

const nameInput = document.getElementById("nameInput")
const thrustSlider = document.getElementById("thrustSlider")
const angleSlider = document.getElementById("angleSlider")
const fireButton = document.getElementById("fireButton")

let players = {}
let control = {
  name: nameInput.value,
  thrust: 0,
  angle: 0,
  fired: 0,
}

nameInput.oninput = (e) => {
  control.name = e.target.value
}
thrustSlider.oninput = (e) => {
  control.thrust = parseFloat(e.target.value)
}
angleSlider.oninput = (e) => {
  control.angle = parseFloat(e.target.value)
}
fireButton.onclick = (e) => {
  control.fired = 1
}

// Aktualizace hráče na server
function updatePlayer() {
  socket.emit("updatePlayer", control)
}

// Zpracování příchozího stavu hry
socket.on("gameState", (serverPlayers) => {
  players = {}
  for (const id in serverPlayers) {
    const p = serverPlayers[id]
    const player = new ClientPlayer()
    player.id = p.id
    player.name = p.name
    player.score = p.score
    player.x = p.x
    player.y = p.y
    player.angle = p.angle
    player.move = p.move
    player.thrust = p.thrust
    player.fired = p.fired
    player.projectile = p.projectile
    players[id] = player
  }
})

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height)
  for (const id in players) {
    players[id].draw(ctx, id == socket.id)
    players[id].drawProjectile(ctx)
  }
}

function gameLoop() {
  updatePlayer()
  draw()
  requestAnimationFrame(gameLoop)
  control.fired = 0
}

gameLoop()
