require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization,auth-token"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

app.get("/", (req, res) => {
  res.json({ data: "Backend Works" });
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  console.log("User Message:", message);

  try {
    const response = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo", 
      messages: [{ role: "user", content: message }],
    });

    console.log("OpenAI Reply:", response.choices[0].message.content); // Debugging
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API Error:", error);

    if (error.response && error.response.status === 429) {
      return res.status(429).json({ error: "Rate limit exceeded. Please wait or upgrade your plan." }); // Been happening with OpenAI
    }

    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
});

app.listen(port);

module.exports = app;
