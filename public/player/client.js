import ClientPlayer from "./client_player.js"
import ClientAsteroid from "./client_asteroid.js"
const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")
const socket = io()

const bgImage = new Image()
bgImage.src = "../bg.webp"

const nameInput = document.getElementById("nameInput")
const thrustSlider = document.getElementById("thrustSlider")
const angleSlider = document.getElementById("angleSlider")
const fireButton = document.getElementById("fireButton")

// Function to generate a random two-letter player name
function generateRandomName() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let name = ""
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length)
    name += alphabet.charAt(randomIndex)
  }
  return name
}

nameInput.value = generateRandomName()
let players = {}
let asteroids = {}
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
  if (players[socket.id]?.projectile?.ttl == 0) {
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
  for (const id in asteroids) {
    asteroids[id].draw(ctx)
  }

  for (const id in players) {
    if (!players[id]) continue
    if (players[id].hp > 0) {
      players[id].drawPlayer(ctx, id == socket.id)
    } else {
      players[id].drawDeadPlayer(ctx, id == socket.id)
    }
    players[id].drawProjectile(ctx)
  }
}

function gameLoop() {
  updateControl()
  draw()
  requestAnimationFrame(gameLoop)
  control.fired = 0
}

gameLoop()
