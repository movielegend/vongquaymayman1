import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const wheelRef = useRef(null);
  const [result, setResult] = useState("");
  const [hasSpun, setHasSpun] = useState(false);

  const prizes = [
    10, 20, 30, 50, 100,
    10, 20, 30, 50, 100,
    20, 30
  ];

  const colors = ["#e53935", "#1e88e5", "#43a047", "#fdd835"];
  const segmentAngle = 360 / prizes.length;

  // Tạo màu vòng quay
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

  // CHECK khi load trang
  useEffect(() => {
    const checkStatus = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await fetch("http://localhost:5000/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (data.hasSpun) {
        setHasSpun(true);
        setResult(`🎉 Bạn đã trúng: ${data.prize}k`);
      }
    };

    checkStatus();
  }, []);

  const handleSpin = async () => {
    if (hasSpun) return;

    const userId =
      localStorage.getItem("userId") || crypto.randomUUID();

    localStorage.setItem("userId", userId);

    const res = await fetch("http://localhost:5000/spin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

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

      <div className="wheel-wrapper">
        <div className="pointer"></div>

        <div className="wheel" ref={wheelRef}>
          {prizes.map((prize, i) => (
            <div
              key={i}
              className="segment-text"
              style={{
                transform: `
                  rotate(${i * segmentAngle + segmentAngle / 2}deg)
                  translate(170px)
                  rotate(-${i * segmentAngle + segmentAngle / 2}deg)
                `,
              }}
            >
              {prize}
            </div>
          ))}
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