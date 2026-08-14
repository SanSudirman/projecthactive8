const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

// Menyimpan riwayat percakapan untuk dikirim ke backend (multi-turn)
const conversation = [];

const WELCOME_MESSAGE =
  "Halo! Aku Jelajah ✈️ Mau liburan ke mana nih? Ceritakan destinasi impianmu, budget, atau berapa hari kamu punya waktu — nanti aku bantu susun rencananya.";

window.addEventListener("DOMContentLoaded", () => {
  appendMessage("bot", WELCOME_MESSAGE);
  conversation.push({ role: "model", text: WELCOME_MESSAGE });
  input.focus();
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage("user", userMessage);
  conversation.push({ role: "user", text: userMessage });
  input.value = "";
  setComposerDisabled(true);

  // Tampilkan placeholder sementara sambil menunggu respons
  const thinkingEl = appendMessage("thinking", "Jelajah sedang menyusun jawaban...");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ conversation }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data && data.result) {
      replaceMessage(thinkingEl, "bot", data.result);
      conversation.push({ role: "model", text: data.result });
    } else {
      replaceMessage(thinkingEl, "error", "Maaf, tidak ada respons yang diterima.");
    }
  } catch (error) {
    console.error("Error fetching response:", error);
    replaceMessage(thinkingEl, "error", "Gagal mendapatkan respons dari server. Coba lagi ya.");
  } finally {
    setComposerDisabled(false);
    input.focus();
  }
});

function appendMessage(type, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", `message--${type}`);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

function replaceMessage(el, type, text) {
  el.className = `message message--${type}`;
  el.textContent = text;
  chatBox.scrollTop = chatBox.scrollHeight;
}

function setComposerDisabled(disabled) {
  input.disabled = disabled;
  form.querySelector("button[type='submit']").disabled = disabled;
}
