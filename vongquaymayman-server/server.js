const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const prizes = [10, 20, 30, 50, 100];

// Giả lập database lưu user đã quay
const spunUsers = {};

// Route test
app.get("/", (req, res) => {
  res.send("Backend đang chạy 🚀");
});

// API quay
app.post("/spin", (req, res) => {
  const userId = req.body.userId;

  if (!userId) {
    return res.status(400).json({ error: "Thiếu userId" });
  }

  if (spunUsers[userId]) {
    return res.json({ error: "Bạn đã quay rồi!" });
  }

  const randomIndex = Math.floor(Math.random() * prizes.length);
  const prize = prizes[randomIndex];

  spunUsers[userId] = prize;

  res.json({ prize });
});

// ⚠️ QUAN TRỌNG: dùng PORT của Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server chạy tại cổng " + PORT);
});