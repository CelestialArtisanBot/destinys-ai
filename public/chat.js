const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const stream = document.getElementById("stream");

// Function to add messages
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Fake AI response
async function getAIResponse(userMsg) {
  // Simulate "thinking"
  await new Promise(res => setTimeout(res, 1000));
  return `🌴 AI Ocean says: "${userMsg}" echoed back to you.`;
}

// Send message
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;
  addMessage(text, "user");
  userInput.value = "";

  const response = await getAIResponse(text);
  addMessage(response, "bot");
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

// Streaming numbers effect
function randomBinaryStream() {
  const line = Array.from({length: 50}, () =>
    Math.random() > 0.5 ? "1" : "0"
  ).join("");
  stream.innerText = line;
}
setInterval(randomBinaryStream, 200);
