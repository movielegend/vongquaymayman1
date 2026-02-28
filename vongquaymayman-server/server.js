const express = require("express");
const cors = require("cors");
const fs = require("fs");
const XLSX = require("xlsx");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const DATA_FILE = "data.json";

// ===============================
// 🎯 TỶ LỆ TRÚNG
// ===============================
const weightedPrizes = [
  { prize: 10, weight: 42 },
  { prize: 20, weight: 42 },
  { prize: 50, weight: 10 },
  { prize: 100, weight: 5 },
  { prize: 200, weight: 1 },
  { prize: 500, weight: 0 }, // không bao giờ trúng
];

// Random theo tỷ lệ
function getRandomPrize() {
  const totalWeight = weightedPrizes.reduce((s, i) => s + i.weight, 0);
  const random = Math.random() * totalWeight;

  let cumulative = 0;
  for (let item of weightedPrizes) {
    cumulative += item.weight;
    if (random < cumulative) return item.prize;
  }
}

// ===============================
// 📂 Đọc & Ghi file
// ===============================
function readData() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ===============================
// 🎡 SPIN
// ===============================
app.post("/spin", (req, res) => {
  const { phone, orderId } = req.body;

  if (!phone || !orderId) {
    return res.json({ error: "Vui lòng nhập đầy đủ thông tin" });
  }

  let data = readData();

  // Kiểm tra đơn hàng đã quay chưa
  const existed = data.find(item => item.orderId === orderId);

  if (existed) {
    return res.json({ error: "Đơn hàng này đã quay rồi!" });
  }

  const prize = getRandomPrize();

  const record = {
    phone,
    orderId,
    prize,
    time: new Date().toLocaleString()
  };

  data.push(record);
  writeData(data);

  res.json({ prize });
});

// ===============================
// 📊 EXPORT EXCEL
// ===============================
app.get("/export", (req, res) => {
  const data = readData();

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

  const filePath = "results.xlsx";
  XLSX.writeFile(workbook, filePath);

  res.download(filePath);
});

// ===============================
app.listen(PORT, () => {
  console.log(`Server chạy tại cổng ${PORT}`);
});