import { useEffect, useRef, useState } from "react";
import "./App.css";

// 🎯 Mệnh giá
const prizes = [10, 20, 50, 100, 200, 500];
const colors = ["#e53935", "#1e88e5", "#43a047", "#fdd835"];

function App() {
  const wheelRef = useRef(null);

  const [result, setResult] = useState("");
  const [hasSpun, setHasSpun] = useState(false);
  const [phone, setPhone] = useState("");
  const [orderId, setOrderId] = useState("");

  const segmentAngle = 360 / prizes.length;

  // 🎨 Vẽ màu vòng quay
  useEffect(() => {
    const wheel = wheelRef.current;

    let gradient = "conic-gradient(";
    prizes.forEach((_, i) => {
      const color = colors[i % colors.length];
      gradient += `${color} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg,`;
    });
    gradient = gradient.slice(0, -1) + ")";

    wheel.style.background = gradient;
  }, []);

  const handleSpin = async () => {
    if (hasSpun) return;

    if (!phone || !orderId) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const res = await fetch(
      "https://vongquaymayman1.onrender.com/spin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, orderId }),
      }
    );

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      setHasSpun(true);
      return;
    }

    const prize = data.prize;
    const index = prizes.indexOf(prize);

    const rotateTo =
      360 * 8 + (360 - index * segmentAngle - segmentAngle / 2);

    wheelRef.current.style.transform = `rotate(${rotateTo}deg)`;

    setTimeout(() => {
      setResult(`🎉 Bạn trúng: ${prize}k`);
      setHasSpun(true);
    }, 5000);
  };

  return (
    <div className="container">
      <h1>🎯 Vòng Quay May Mắn</h1>

      {/* FORM */}
      <div className="form">
        <input
          type="text"
          placeholder="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="text"
          placeholder="ID đơn hàng"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
      </div>

      {/* WHEEL */}
      <div className="wheel-wrapper">
        <div className="pointer"></div>

        <div className="wheel" ref={wheelRef}>
          {prizes.map((prize, i) => {
            const angle = i * segmentAngle + segmentAngle / 2;
            return (
              <div
                key={i}
                className="segment-text"
                style={{
                  transform: `
                    rotate(${angle}deg)
                    translateY(-130px)
                    rotate(-${angle}deg)
                  `,
                }}
              >
                {prize}k
              </div>
            );
          })}
        </div>

        <div className="center-circle"></div>
      </div>

      <button onClick={handleSpin} disabled={hasSpun}>
        Quay ngay
      </button>

      <div className="result">{result}</div>
    </div>
  );
}

export default App;