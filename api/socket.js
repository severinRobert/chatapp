const app = require("./app");
const http = require("http");
const socketIO = require("socket.io");

const port = "8000";
app.set("port", port);

const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

clients = {};

io.on("connection", socket => {
  console.log("Client connected " + socket.id);
  socket.user_id = socket.handshake.query.userId;
  clients[socket.handshake.query.userId] = socket;

  socket.broadcast.emit("connection")

  socket.on("disconnect", () => {
    socket.broadcast.emit("disconnection")

    delete clients[socket.user_id];
    console.log("Client disconnected: " + socket.id);
  });

  socket.on("chat message", (data) => {
    console.log(data)
    socket.broadcast.emit('new message', {
      username: data.username,
      message: data.message
    });
  });
});

server.listen(port);