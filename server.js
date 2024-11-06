import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import ServerPlayer from "./server_player.js"
import ServerAsteroid from "./server_asteroid.js"

const app = express()
const server = createServer(app)
const io = new Server(server)
app.use(express.static("public"))

const game = {
  players: {},
  asteroids: {},
}
game.asteroids[0] = new ServerAsteroid(60, 60, 20)
game.asteroids[1] = new ServerAsteroid(740, 740, 40)

const gameJson = {
  players: {},
  asteroids: {},
}

io.on("connection", (socket) => {
  console.log("New player connected:", socket.id)
  game.players[socket.id] = new ServerPlayer(socket.id)

  socket.on("updateControl", (playerData) => {
    const player = game.players[socket.id]
    if (player) {
      player.name = playerData.name
      player.updatePosition(playerData.angle, playerData.thrust)
      player.stayInCanvas(800, 800)
      player.updateProjectile(playerData.fired)
      player.stayProjectileInCanvas(800, 800)
      player.checkPlayerHit(game.players)
      player.checkProjectileHit(game.players)
    }
  })

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id)
    delete game.players[socket.id]
    delete gameJson.players[socket.id]
  })
})

setInterval(() => {
  for (const id in game.asteroids) {
    gameJson.asteroids[id] = game.asteroids[id].toJSON()
  }
  for (const id in game.players) {
    gameJson.players[id] = game.players[id].toJSON()
  }
  io.emit("gameState", gameJson)
}, 1000 / 20)

server.listen(3333, () => {
  console.log("Server running on http://localhost:3333")
})
