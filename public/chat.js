const chatContainer = document.querySelector(".chat-container");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

let chatHistory = [{ role: "assistant", content: "Hey there! I'm Destiny Nicole's AI. How can I assist you today?" }];
let isProcessing = false;

function createBubble(role, text) {
  const bubble = document.createElement("div");
  bubble.className = `message-bubble ${role}-message`;
  bubble.textContent = text;
  chatContainer.appendChild(bubble);
  bubble.scrollIntoView({ behavior: "smooth" });
}

userInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

sendButton.addEventListener("click", sendMessage);

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text || isProcessing) return;

  isProcessing = true;
  createBubble("user", text);
  chatHistory.push({ role: "user", content: text });
  userInput.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: chatHistory })
    });

    if (!response.ok) throw new Error("Failed to fetch response");

    const data = await response.json();
    const answer = data.response || "Hmm... I don't know what to say.";

    createBubble("assistant", answer);
    chatHistory.push({ role: "assistant", content: answer });
  } catch (err) {
    console.error(err);
    createBubble("assistant", "Oops! Something went wrong.");
  } finally {
    isProcessing = false;
    userInput.focus();
  }
}

// Load initial assistant message
createBubble("assistant", chatHistory[0].content);
