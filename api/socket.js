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

clientsList = {};

io.on("connection", socket => {
  console.log("Client connected " + socket.id);
  socket.user_id = socket.handshake.query.userId;
  clientsList[socket.handshake.query.userId] = socket;

  socket.on("disconnect", () => {
    delete clientsList[socket.user_id];
    console.log("Client disconnected: " + socket.id);
  });

  socket.on("chat message", (data) => {
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });
});

server.listen(port);