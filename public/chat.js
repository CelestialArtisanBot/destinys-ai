const chatContainer = document.querySelector(".chat-container");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

let chatHistory = [
  { role: "assistant", content: "Hi! I'm Destiny Nicole's AI. How can I help you today?" }
];
let isProcessing = false;

function createBubble(role, content) {
  const bubble = document.createElement("div");
  bubble.className = `message-bubble ${role}-message`;
  bubble.textContent = content;
  chatContainer.appendChild(bubble);
  // Scroll newest bubble into view
  bubble.scrollIntoView({ behavior: "smooth", block: "end" });
  return bubble;
}

async function sendMessage() {
  const msg = userInput.value.trim();
  if (!msg || isProcessing) return;
  isProcessing = true;
  userInput.disabled = true;
  sendButton.disabled = true;

  createBubble("user", msg);
  chatHistory.push({ role: "user", content: msg });
  userInput.value = "";

  try {
    const assistantBubble = createBubble("assistant", "...");
    // Simulate AI typing delay
    await delay(500);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: chatHistory })
    });
    if (!response.ok) throw new Error("Failed to get response");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let responseText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");
      for (const line of lines) {
        try {
          const jsonData = JSON.parse(line);
          if (jsonData.response) {
            responseText += jsonData.response;
            assistantBubble.textContent = responseText;
          }
        } catch (e) { console.error(e); }
      }
    }

    chatHistory.push({ role: "assistant", content: responseText });

  } catch (err) {
    console.error(err);
    createBubble("assistant", "Oops! Something went wrong.");
  } finally {
    isProcessing = false;
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
  }
}

function delay(ms) { return new Promise(res => setTimeout(res, ms)); }

userInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});
sendButton.addEventListener("click", sendMessage);

// Load initial assistant message
createBubble("assistant", chatHistory[0].content);
