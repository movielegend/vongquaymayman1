const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const prizes = [10, 20, 30, 50, 100];

// Giả lập database lưu IP đã quay
const spunUsers = {};

app.post("/spin", (req, res) => {
  const userId = req.body.userId;

  if (spunUsers[userId]) {
    return res.json({ error: "Bạn đã quay rồi!" });
  }

  const randomIndex = Math.floor(Math.random() * prizes.length);
  const prize = prizes[randomIndex];

  spunUsers[userId] = prize;

  res.json({ prize });
});

app.listen(5000, () => {
  console.log("Server chạy tại http://localhost:5000");
});