const io = require("socket.io")(3000);

const clients = {};

/* When a user connects to the website, a socket is created for them */
io.on("connection", (socket) => {
  socket.on("newUser", (nickname) => {
    clients[socket.id] = nickname;
    socket.broadcast.emit("userConnected", nickname);
  });
  socket.on("send-chatMsg", (msg) => {
    socket.broadcast.emit("chatMSg", {
      message: msg,
      nickname: clients[socket.id]
    });
  });
  socket.on("disconnection", () => {
    socket.broadcast.emit("userDisconnected", clients[socket.id]);
    delete clients[socket.id];
  });
});
