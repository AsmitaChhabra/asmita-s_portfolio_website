// Netlify Function: Basic rule-based FAQ responder for Asmita's portfolio
// Deployed at /.netlify/functions/chat

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  let prompt = '';
  try {
    const body = JSON.parse(event.body || '{}');
    prompt = String(body.prompt || '').trim();
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  if (!prompt) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No prompt provided' }) };
  }

  const q = prompt.toLowerCase();

  let reply = "I’m Asmita’s AI helper. Ask me about skills, projects, contact, education, or location.";

  const answers = [
    {
      match: /(skill|stack|tech|tools|languages)/,
      reply:
        "Core skills: Python, SQL & database design, Tableau & data visualization, and ML foundations (supervised/unsupervised, scikit‑learn, evaluation).",
    },
    {
      match: /(project|work|portfolio|dashboard|repo)/,
      reply:
        "Projects: E‑Kart Customer Retention (ML/EDA), Football DB SQL Querying, OpenCV Resume Builder, Meteorological Data Analysis (ARIES), Cyclone Data Analysis (IBTrACS), IPL Data Analysis & Viz. Check the Projects section for links.",
    },
    {
      match: /(contact|email|reach|connect|linkedin)/,
      reply: "You can reach Asmita at asmita.chhabra@flame.edu.in or on LinkedIn: linkedin.com/in/asmitchhabra/",
    },
    {
      match: /(where|location|based|city|pune|india)/,
      reply: "Asmita is based in Pune, India.",
    },
    {
      match: /(education|degree|study|university|college)/,
      reply:
        "Asmita is a second‑year undergraduate focusing on Data Science at FLAME University.",
    },
  ];

  for (const a of answers) {
    if (a.match.test(q)) {
      reply = a.reply;
      break;
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply })
  };
}
