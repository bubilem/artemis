import ClientPlayer from "../client_player.js"
import ClientAsteroid from "../client_asteroid.js"
import ClientProjectile from "../client_projectile.js"
const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")
const socket = io()

const bgImage = new Image()
bgImage.src = "../bg.webp"

let players = {}
let asteroids = []
let projectiles = []
let control = {
  thrust: 0,
  thrust_rotate: 0,
  angle: 0,
  fired: 0,
}

document.onkeydown = (e) => {
  switch (e.key) {
    case "w":
      control.thrust = 1
      break
    case "s":
      control.thrust = -1
      break
    case "q":
    case "a":
      control.thrust_rotate = -1
      break
    case "e":
    case "d":
      control.thrust_rotate = 1
      break
    case " ":
      control.fired = 1
      break
  }
}

// Aktualizace hráče na server
function updateControl() {
  socket.emit("updateControl", control)
}

// Zpracování příchozího stavu hry
socket.on("gameState", (gameState) => {
  //asteroids
  const serverAsteroids = gameState.asteroids
  for (const id in serverAsteroids) {
    if (!asteroids[id]) {
      asteroids[id] = new ClientAsteroid(serverAsteroids[id])
    } else {
      asteroids[id].update(serverAsteroids[id])
    }
  }

  //projectiles
  projectiles = []
  for (const id in gameState.projectiles) {
    projectiles[id] = new ClientProjectile(gameState.projectiles[id])
  }

  //players
  const serverPlayers = gameState.players
  for (const id in players) {
    if (!serverPlayers[id]) {
      delete players[id]
    }
  }
  for (const id in serverPlayers) {
    if (!players[id]) {
      players[id] = new ClientPlayer(serverPlayers[id])
    } else {
      players[id].update(serverPlayers[id])
    }
  }
})

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height)
  for (const asteroid of asteroids) {
    asteroid.draw(ctx)
  }
  for (const projectile of projectiles) {
    projectile.draw(ctx)
  }

  for (const id in players) {
    if (!players[id]) continue
    if (players[id].hp > 0) {
      players[id].drawPlayer(ctx, id == socket.id)
    } else {
      players[id].drawDeadPlayer(ctx, id == socket.id)
    }
  }
}

function gameLoop() {
  updateControl()
  draw()
  requestAnimationFrame(gameLoop)
  control.fired = 0
  control.thrust = 0
  control.thrust_rotate = 0
}

gameLoop()
