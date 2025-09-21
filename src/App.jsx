import React, { useEffect, useRef } from "react";

const App = () => {
  const cols = 20;
  const rows = 15;
  const activeWidth = 6;

  const boardRef = useRef(null);
  const currentRef = useRef(0);
  const directionRef = useRef(1);
  const colorIndexRef = useRef(0);

  const colorSets = [
    ["#66ff66", "#009900"],
    ["#66ff66", "#007a00"],
    ["#66ff66", "#004d00"],
    ["#66ff66", "#003300"],
    ["#00cc00", "#66ccff"],
    ["#009900", "#3399cc"],
    ["#006600", "#1a4d80"],
    ["#004d00", "#0d3359"],
    ["#66ccff", "#0033cc"],
    ["#3399ff", "#002080"],
    ["#1a4d99", "#00134d"],
    ["#0d3359", "#000d33"],
    ["#0000cc", "#cc66ff"],
    ["#000099", "#9933cc"],
    ["#00004d", "#661a80"],
    ["#000033", "#4d1366"],
    ["#4d1366", "#660066"],
    ["#290933", "#400040"],
    ["#1a0626", "#2e002e"],
  ];

  function interpolateColor(c1, c2, factor) {
    let r1 = parseInt(c1.substr(1, 2), 16),
      g1 = parseInt(c1.substr(3, 2), 16),
      b1 = parseInt(c1.substr(5, 2), 16);
    let r2 = parseInt(c2.substr(1, 2), 16),
      g2 = parseInt(c2.substr(3, 2), 16),
      b2 = parseInt(c2.substr(5, 2), 16);
    let r = Math.round(r1 + factor * (r2 - r1));
    let g = Math.round(g1 + factor * (g2 - g1));
    let b = Math.round(b1 + factor * (b2 - b1));
    return `rgb(${r},${g},${b})`;
  }

  useEffect(() => {
    const board = boardRef.current;
    const columns = [];

    // generate grid
    for (let c = 0; c < cols; c++) {
      const col = document.createElement("div");
      col.className = "flex flex-col gap-[2px]";
      for (let r = 0; r < rows; r++) {
        const sq = document.createElement("div");
        sq.style.width = `clamp(12px, 2vw, 28px)`;
        sq.style.height = `clamp(12px, 2vw, 28px)`;
        sq.className =
          "bg-black border border-gray-700 transition-colors duration-300";
        col.appendChild(sq);
      }
      board.appendChild(col);
      columns.push(col);
    }

    function highlightColumns() {
      columns.forEach((c) => {
        [...c.children].forEach((sq) => (sq.style.background = "#000"));
      });

      const [light, dark] = colorSets[colorIndexRef.current];

      for (let i = 0; i < activeWidth; i++) {
        const idx = currentRef.current + i;
        if (idx >= 0 && idx < cols) {
          const squares = [...columns[idx].children];
          let factor;
          if (directionRef.current === 1) {
            factor = i / (activeWidth - 1);
          } else {
            factor = 1 - i / (activeWidth - 1);
          }
          const color = interpolateColor(dark, light, factor);
          squares.forEach((sq) => (sq.style.background = color));
        }
      }

      currentRef.current += directionRef.current;

      if (currentRef.current > cols - activeWidth) {
        currentRef.current = cols - activeWidth;
        directionRef.current = -1;
        colorIndexRef.current =
          (colorIndexRef.current + 1) % colorSets.length;
      } else if (currentRef.current < 0) {
        currentRef.current = 0;
        directionRef.current = 1;
        colorIndexRef.current =
          (colorIndexRef.current + 1) % colorSets.length;
      }
    }

    const interval = setInterval(highlightColumns, 100);
    highlightColumns();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Heading */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-400 mb-6 text-center">
        FOG GAMING WAVE PROJECT BY : PALAK
      </h1>

      {/* Main Wrapper Box */}
      <div className="bg-[#3a3a3a] p-[20px] rounded-lg shadow-lg border border-gray-600">
        <div
          ref={boardRef}
          className="flex gap-[2px] bg-black p-2 rounded-lg flex-nowrap"
          style={{ justifyContent: "center" }}
        ></div>
      </div>
    </div>
  );
};

export default App;
