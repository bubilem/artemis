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
  if (players[socket.id]?.reload == 0) {
    fireButton.disabled = false
    fireButton.classList.remove("disabled")
  } else {
    fireButton.disabled = true
    fireButton.classList.add("disabled")
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
      players[id].drawPlayer(ctx, true)
    } else {
      players[id].drawDeadPlayer(ctx, true)
    }
  }
}

function gameLoop() {
  draw()
  requestAnimationFrame(gameLoop)
}
gameLoop()
