const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const ServerPlayer = require("./server_player")

const app = express()
const server = http.createServer(app)
const io = new Server(server)
app.use(express.static("public"))

const players = {}
const playersJson = {}

io.on("connection", (socket) => {
  console.log("New player connected:", socket.id)
  players[socket.id] = new ServerPlayer(socket.id)

  socket.on("updatePlayer", (playerData) => {
    const player = players[socket.id]
    if (player) {
      player.name = playerData.name
      player.updatePosition(playerData.angle, playerData.thrust)
      player.stayInCanvas(800, 800)
      player.updateProjectile(playerData.fired)
      player.stayProjectileInCanvas(800, 800)
      player.checkProjectileHit(players)
      playersJson[socket.id] = player.toJSON()
    }
  })

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id)
    delete players[socket.id]
    delete playersJson[socket.id]
  })
})

setInterval(() => {
  io.emit("gameState", playersJson)
}, 1000 / 15)

server.listen(3333, () => {
  console.log("Server running on http://localhost:3333")
})
