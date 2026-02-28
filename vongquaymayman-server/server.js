const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🎯 Tỷ lệ trúng
const weightedPrizes = [
  { prize: 10, weight: 31.33 },
  { prize: 20, weight: 31.33 },
  { prize: 30, weight: 31.34 },
  { prize: 50, weight: 5 },
  { prize: 100, weight: 1 },
];

// Hàm random theo tỷ lệ
function getRandomPrize() {
  const totalWeight = weightedPrizes.reduce(
    (sum, item) => sum + item.weight,
    0
  );

  const random = Math.random() * totalWeight;

  let cumulative = 0;

  for (let item of weightedPrizes) {
    cumulative += item.weight;
    if (random < cumulative) {
      return item.prize;
    }
  }
}

// Giả lập database
const spunUsers = {};

app.post("/spin", (req, res) => {
  const userId = req.body.userId;

  if (spunUsers[userId]) {
    return res.json({ error: "Bạn đã quay rồi!" });
  }

  const prize = getRandomPrize();

  spunUsers[userId] = prize;

  res.json({ prize });
});

app.post("/check", (req, res) => {
  const userId = req.body.userId;

  if (spunUsers[userId]) {
    return res.json({
      hasSpun: true,
      prize: spunUsers[userId],
    });
  }

  res.json({ hasSpun: false });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server chạy tại cổng ${PORT}`);
});