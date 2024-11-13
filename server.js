import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import ServerPlayer from "./server_player.js"
import ServerProjectile from "./server_projectile.js"
import ServerAsteroid from "./server_asteroid.js"

const app = express()
const server = createServer(app)
const io = new Server(server)
app.use(express.static("public"))

const game = {
  players: {},
  projectiles: [],
  asteroids: [],
}
const gameJson = {
  players: {},
  projectiles: [],
  asteroids: [],
}

game.asteroids.push(new ServerAsteroid(60, 60, 30))
game.asteroids.push(new ServerAsteroid(60, 740, 30))
game.asteroids.push(new ServerAsteroid(740, 60, 30))
game.asteroids.push(new ServerAsteroid(740, 740, 30))

io.on("connection", (socket) => {
  const referer = socket.handshake.headers.referer
  if (referer.endsWith("/player/")) {
    console.log("New player connected:", socket.id)
    game.players[socket.id] = new ServerPlayer(socket.id)

    socket.on("updateControl", (playerData) => {
      const player = game.players[socket.id]
      if (player) {
        player.updateControl(playerData)
      }
    })
  }
  if (referer.endsWith("/observer/")) {
    console.log("New observer connected:", socket.id)
  }

  socket.on("disconnect", () => {
    if (referer.endsWith("/player/")) {
      console.log("Player disconnected:", socket.id)
      delete game.players[socket.id]
      delete gameJson.players[socket.id]
    }
    if (referer.endsWith("/observer/")) {
      console.log("Observer disconnected:", socket.id)
    }
  })
})

setInterval(() => {
  for (const id in game.players) {
    game.players[id].update(game)
    if (game.players[id].fired == 1 && game.players[id].reload == 0) {
      game.projectiles.push(new ServerProjectile(game.players[id]))
      game.players[id].reload = 20
      game.players[id].fired = 0
    }
    gameJson.players[id] = game.players[id].toJSON()
  }

  gameJson.projectiles = []
  for (const id in game.projectiles) {
    game.projectiles[id].update()
    if (game.projectiles[id].ttl > 0) {
      gameJson.projectiles.push(game.projectiles[id].toJSON())
    }
    if (game.projectiles[id].ttl <= 0) {
      game.projectiles.splice(id, 1)
    }
  }
  for (const id in game.asteroids) {
    game.asteroids[id].update(game)
    gameJson.asteroids[id] = game.asteroids[id].toJSON()
  }
  io.emit("gameState", gameJson)
}, 1000 / 30)

server.listen(3333, () => {
  console.log("Server running on http://localhost:3333")
})
