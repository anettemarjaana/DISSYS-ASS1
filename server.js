const express = require("express");
const app = express();
const server = require("http").Server(app);

const io = require("socket.io")(server);
const clients = {};
const channels = {};

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", { channels: channels });
});

/* Creating a new channel */
app.post("/channel", (req, res) => {
  const enteredChannel = req.body.channel;
  if (channels[enteredChannel] != null) {
    return res.redirect("/");
  }
  channels[enteredChannel] = { clients: {} };
  res.redirect(enteredChannel);
  // send message that new channel was created
  io.emit("channelCreated", req.body.channel);
});

app.get("/:channel", (res, req) => {
  /* if the channel does not exist */
  if (channels[req.params.channel] == null) {
    return res.redirect("/");
  }
  res.render("channel", { channelName: req.params.channel });
});

server.listen(3000);

/* When a user connects to the website, a socket is created for them */
io.on("connection", (socket) => {
  socket.on("newUser", (channel, nickname) => {
    socket.join(channel);
    channels[channel].clients[socket.id] = nickname;
    socket.to(channel).broadcast.emit("userConnected", nickname);
  });
  socket.on("send-chatMsg", (channel, msg) => {
    socket.to(channel).broadcast.emit("chatMSg", {
      message: msg,
      nickname: channels[channel].clients[socket.id]
    });
  });
  socket.on("disconnection", () => {
    getClientChannels(socket).forEach((channel) => {
      socket
        .to(channel)
        .broadcast.emit(
          "userDisconnected",
          channels[channel].clients[socket.id]
        );
      delete channels[channel].clients[socket.id];
    });
  });
});

function getClientChannels(socket) {
  return Object.entries(channels).reduce(
    (channelNames, [channelName, channel]) => {
      if (channel.clients[socket.id] != null) {
        channelNames.push(channelName);
      }
      return channelNames;
    },
    []
  );
}
