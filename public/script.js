const socket = io("http://localhost:3000");
const msgContainer = document.getElementById("msg-container");
const channelContainer = document.getElementById("channel-container");
const msgForm = document.getElementById("send-container");
const msgInput = document.getElementById("input-message");

if (msgForm != null) {
  /* only ask for the nickname if the message form exists */
  const nickname = prompt("Enter nickname: ");
  appendMsg("You joined");
  socket.emit("newUser", channelName, nickname);

  /* Prevent the page from refreshing (and losing all the chat msgs) */
  msgForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = msgInput.value;
    appendMsg(`You: ${msg}`);
    socket.emit("send-chatMsg", channelName, msg);
    msgInput.value = ""; // the input is emptied once its sent
  });
}

socket.on("channelCreated", (channel) => {
  const channelElement = document.createElement("div");
  channelElement.innerText = channel;
  const channelLink = document.createElement("a");
  channelLink.href = `/${channel}`;
  channelLink.innerText = "Join";
  channelContainer.append(channelElement);
  channelContainer.append(channelLink);
});

socket.on("chatMsg", (data) => {
  appendMsg(`${data.nickname}: ${data.message}`);
});
socket.on("userConnected", (nickname) => {
  appendMsg(`${nickname} joined`);
});
socket.on("userDisconnected", (nickname) => {
  appendMsg(`${nickname} left`);
});

function appendMsg(msg) {
  const msgElement = document.createElement("div");
  msgElement.innerText = msg;
  msgContainer.append(msgElement);
}
