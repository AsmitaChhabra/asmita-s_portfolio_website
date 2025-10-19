// Minimal, provider-agnostic chat widget with a feature flag.
// You can later wire this to a real API; for now it echoes helpful responses.

const FEATURES = {
  // Enable GPT-5 (or whatever provider/model you choose) for all clients by default.
  aiChatEnabled: true,
};

function getFlag(name) {
  try {
    const url = new URL(window.location.href);
    const param = url.searchParams.get(name);
    if (param === "true") return true;
    if (param === "false") return false;
  } catch {}
  try {
    const ls = localStorage.getItem(`feature:${name}`);
    if (ls === "true") return true;
    if (ls === "false") return false;
  } catch {}
  return FEATURES[name];
}

function setFlag(name, value) {
  try {
    localStorage.setItem(`feature:${name}`, String(value));
  } catch {}
}

function mountChatWidget() {
  if (!getFlag("aiChatEnabled")) return;

  // Styles (scoped, minimal)
  const style = document.createElement("style");
  style.textContent = `
  .ai-fab{position:fixed;right:26px;bottom:96px;width:52px;height:52px;border-radius:26px;background:#0c1618;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(0,0,0,.15);cursor:pointer;z-index:1200}
  .ai-fab:hover{transform:translateY(-1px)}
  .ai-panel{position:fixed;right:26px;bottom:160px;width:320px;max-height:60vh;background:#fff;border:1px solid #e2e2e2;border-radius:10px;box-shadow:0 12px 30px rgba(0,0,0,.12);display:flex;flex-direction:column;overflow:hidden;z-index:1200}
  .ai-header{padding:10px 12px;background:#0c1618;color:#fff;display:flex;align-items:center;justify-content:space-between;font-size:14px}
  .ai-body{padding:10px;overflow:auto;display:flex;flex-direction:column;gap:8px}
  .ai-msg{padding:8px 10px;border-radius:8px;max-width:85%;font-size:14px;line-height:1.4}
  .ai-msg.user{align-self:flex-end;background:#0c1618;color:#fff}
  .ai-msg.bot{align-self:flex-start;background:#f1f5f9;color:#0c1618}
  .ai-input{display:flex;gap:6px;padding:10px;border-top:1px solid #eee}
  .ai-input input{flex:1;padding:8px 10px;border:1px solid #ccc;border-radius:6px}
  .ai-input button{padding:8px 12px;border-radius:6px;border:1px solid #0c1618;background:#0c1618;color:#fff;cursor:pointer}
  @media (max-width:480px){.ai-panel{right:12px;width:92vw}}
  `;
  document.head.appendChild(style);

  // Floating action button
  const fab = document.createElement("button");
  fab.className = "ai-fab";
  fab.title = "Chat with Asmita's AI";
  fab.innerHTML = "<span style='font-size:18px'>💬</span>";

  // Panel
  const panel = document.createElement("div");
  panel.className = "ai-panel";
  panel.style.display = "none";
  panel.innerHTML = `
    <div class="ai-header">
      <strong>Ask about my work</strong>
      <button id="aiClose" title="Close" style="background:transparent;border:none;color:#fff;cursor:pointer">✕</button>
    </div>
    <div class="ai-body" id="aiBody"></div>
    <div class="ai-input">
      <input id="aiInput" type="text" placeholder="Ask about projects, skills…" />
      <button id="aiSend">Send</button>
    </div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  const body = panel.querySelector("#aiBody");
  const input = panel.querySelector("#aiInput");
  const send = panel.querySelector("#aiSend");
  const close = panel.querySelector("#aiClose");

  function push(role, text) {
    const div = document.createElement("div");
    div.className = `ai-msg ${role}`;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  async function botReply(q) {
    // Try Netlify function first
    try {
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: q })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.reply) {
          push('bot', data.reply);
          return;
        }
      }
    } catch (e) {
      // fall back to local canned replies below
    }

    // Local fallback
    const canned = `I’m Asmita’s AI. I can summarize projects, skills (Python, SQL, Tableau, ML basics), and how to contact her. Ask things like “Show me dashboard projects” or “What ML have you done?”.`;
    let reply = canned;
    const ql = q.toLowerCase();
    if (ql.includes('project') || ql.includes('dashboard')) {
      reply = 'Recent projects include: E‑Kart Customer Retention (ML/EDA), Football DB SQL Querying, OpenCV Resume Builder, Meteorological Data Analysis, Cyclone Analysis, and IPL Data Viz. Want a short summary of any?';
    } else if (ql.includes('skill') || ql.includes('stack') || ql.includes('tech')) {
      reply = 'Core skills: Python, SQL & database design, Tableau & visualization, plus ML foundations (supervised/unsupervised, scikit‑learn, evaluation).';
    } else if (ql.includes('contact') || ql.includes('email')) {
      reply = 'You can reach Asmita at asmita.chhabra@flame.edu.in or via LinkedIn (links in header/footer).';
    }
    setTimeout(() => push('bot', reply), 150);
  }

  function handleSend() {
    const q = (input.value || "").trim();
    if (!q) return;
    push("user", q);
    input.value = "";
    botReply(q);
  }

  fab.addEventListener("click", () => {
    const visible = panel.style.display !== "none";
    panel.style.display = visible ? "none" : "flex";
    if (!visible && body.childElementCount === 0) {
      push("bot", "Hi! I’m an AI helper for this portfolio. Ask me about projects, skills, or how to get in touch.");
    }
  });
  close.addEventListener("click", () => (panel.style.display = "none"));
  send.addEventListener("click", handleSend);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSend();
  });
}

function typewriterInit() {
  const el = document.getElementById("typewriter");
  if (!el) return;
  let phrases;
  try {
    phrases = JSON.parse(el.getAttribute("data-phrases")) || [];
  } catch {
    phrases = [];
  }
  if (!phrases.length) return;

  let i = 0;
  let j = 0;
  let deleting = false;
  const speed = 80;
  const pause = 1200;

  function tick() {
    const current = phrases[i % phrases.length];
    if (!deleting) {
      el.textContent = current.slice(0, j + 1);
      j++;
      if (j === current.length) {
        deleting = true;
        setTimeout(tick, pause);
        return;
      }
    } else {
      el.textContent = current.slice(0, j - 1);
      j--;
      if (j === 0) {
        deleting = false;
        i++;
      }
    }
    setTimeout(tick, speed);
  }
  tick();
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    mountChatWidget();
    typewriterInit();
  } catch (e) {
    // fail silently for any unexpected errors in optional widget
    console.error(e);
  }
});

// Expose basic flag controls for quick testing in console
window.featureFlags = {
  get: getFlag,
  set: setFlag,
};
