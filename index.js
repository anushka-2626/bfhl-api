import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const EMAIL = "anushka1784.be23@chitkara.edu.in"; 

// ---------- HEALTH CHECK ----------
app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL
  });
});

// ---------- MAIN API ----------
app.post("/bfhl", async (req, res) => {
  try {
    const keys = Object.keys(req.body);

    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        error: "Exactly one key is required"
      });
    }

    const key = keys[0];
    const value = req.body[key];
    let data;

    switch (key) {
      case "fibonacci":
        if (!Number.isInteger(value) || value < 0) throw new Error();
        data = fibonacci(value);
        break;

      case "prime":
        if (!Array.isArray(value)) throw new Error();
        data = value.filter(isPrime);
        break;

      case "lcm":
        if (!Array.isArray(value)) throw new Error();
        data = value.reduce(lcm);
        break;

      case "hcf":
        if (!Array.isArray(value)) throw new Error();
        data = value.reduce(gcd);
        break;

      case "AI":
        if (typeof value !== "string") throw new Error();
        data = await aiAnswer(value);
        break;

      default:
        return res.status(400).json({
          is_success: false,
          error: "Invalid key"
        });
    }

    res.status(200).json({
      is_success: true,
      official_email: EMAIL,
      data
    });

  } catch (err) {
    res.status(400).json({
      is_success: false,
      error: "Invalid input"
    });
  }
});

// ---------- UTIL FUNCTIONS ----------
function fibonacci(n) {
  let arr = [0, 1];
  for (let i = 2; i < n; i++) {
    arr.push(arr[i - 1] + arr[i - 2]);
  }
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

// ---------- GEMINI AI ----------
async function aiAnswer(question) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const response = await axios.post(url, {
    contents: [
      {
        parts: [{ text: question }]
      }
    ]
  });

  const text = response.data.candidates[0].content.parts[0].text;
  return text.split(/\s+/)[0]; // single word
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
