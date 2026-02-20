import React from "react";
import "./PowerUp.css";

function PowerUp({ x, y, size, type }) {
  const colors = {
    shield: "#00ffff",
    double_score: "#ffcc00",
    speed_boost: "#ff33cc",
  };

  const icons = {
    shield: "🛡️",
    double_score: "2x",
    speed_boost: "⚡",
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        position: "absolute",
        borderRadius: "50%",
        backgroundColor: colors[type],
        boxShadow: `0 0 10px ${colors[type]}, 0 0 20px ${colors[type]}, 0 0 30px ${colors[type]}`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1rem",
        fontWeight: "bold",
        color: "#111",
        animation: "pulse 1.5s infinite",
      }}
    >
      {icons[type]}
    </div>
  );
}

export default PowerUp;
