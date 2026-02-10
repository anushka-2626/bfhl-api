import axios from "axios";

const EMAIL = "anushka1784.be23@chitkara.edu.in";

export default async function handler(req, res) {
  // -------- HEALTH --------
  if (req.method === "GET" && req.url === "/api/health") {
    return res.status(200).json({
      is_success: true,
      official_email: EMAIL
    });
  }

  // -------- BFHL --------
  if (req.method === "POST" && req.url === "/api/bfhl") {
    try {
      const body = req.body || {};
      const keys = Object.keys(body);

      if (keys.length !== 1) {
        return res.status(400).json({
          is_success: false,
          error: "Exactly one key is required"
        });
      }

      const key = keys[0];
      const value = body[key];
      let data;

      switch (key) {
        case "fibonacci":
          if (!Number.isInteger(value) || value < 0) return invalid(res);
          data = fibonacci(value);
          break;

        case "prime":
          if (!Array.isArray(value)) return invalid(res);
          data = value.filter(n => isPrime(n));
          break;

        case "lcm":
          if (!Array.isArray(value)) return invalid(res);
          data = value.reduce((a, b) => lcm(a, b));
          break;

        case "hcf":
          if (!Array.isArray(value)) return invalid(res);
          data = value.reduce((a, b) => gcd(a, b));
          break;

        case "AI":
          if (typeof value !== "string") return invalid(res);
          data = await aiAnswer(value);
          break;

        default:
          return res.status(400).json({
            is_success: false,
            error: "Invalid key"
          });
      }

      return res.status(200).json({
        is_success: true,
        official_email: EMAIL,
        data
      });

    } catch {
      return res.status(500).json({
        is_success: false,
        error: "Server error"
      });
    }
  }

  // -------- FALLBACK --------
  return res.status(404).json({ error: "Not Found" });
}

// ---------- HELPERS ----------
const invalid = (res) =>
  res.status(400).json({ is_success: false, error: "Invalid input" });

function fibonacci(n) {
  const arr = [0, 1];
  for (let i = 2; i < n; i++) arr.push(arr[i - 1] + arr[i - 2]);
  return arr.slice(0, n);
}

function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

async function aiAnswer(question) {
  try {
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await axios.post(url, {
      contents: [{ parts: [{ text: question }] }]
    });

    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return text.trim().split(/\s+/)[0];
  } catch {
    return "Unknown";
  }
}
