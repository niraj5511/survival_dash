import React from "react";

function StatsBoard({ score, time, dodged, streak, powerups }) {
  return (
    <div
  style={{
    position: "absolute",
    top: 10,
    left: 10,
    color: "#00ffcc",
    fontFamily: "'Press Start 2P', sans-serif",
    zIndex: 1000,
    background: "rgba(0,0,0,0.5)",
    padding: "10px 15px",
    borderRadius: "10px",
    boxShadow: "0 0 10px #00ffcc, 0 0 20px #00ffcc",
    textShadow: "0 0 5px #00ffcc",
    fontSize: "0.8rem",
  }}
>
  <div>Score: {Math.floor(score)}</div>
  <div>Time: {time.toFixed(1)}s</div>
  <div>Dodged: {dodged}</div>
  <div>Streak: {streak}</div>
  <div>Powerups: {powerups}</div>
</div>

  );
}

export default StatsBoard;
