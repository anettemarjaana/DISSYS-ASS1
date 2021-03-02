const socket = io("http://localhost:3000");
const msgContainer = document.getElementById("msg-container");
const msgForm = document.getElementById("send-container");
const msgInput = document.getElementById("input-message");

const nickname = prompt("Enter nickname: ");
appendMsg("You joined");
socket.emit("newUser", nickname);

socket.on("chatMsg", (data) => {
  appendMsg(`${data.nickname}: ${data.message}`);
});
socket.on("userConnected", (nickname) => {
  appendMsg(`${nickname} joined`);
});
socket.on("userDisconnected", (nickname) => {
  appendMsg(`${nickname} left`);
});

/* Prevent the page from refreshing (and losing all the chat msgs) */
msgForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = msgInput.value;
  appendMsg(`You: ${msg}`);
  socket.emit("send-chatMsg", msg);
  msgInput.value = ""; // the input is emptied once its sent
});

function appendMsg(msg) {
  const msgElement = document.createElement("div");
  msgElement.innerText = msg;
  msgContainer.append(msgElement);
}
