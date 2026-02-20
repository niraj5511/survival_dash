import React from "react";
import { useNavigate } from "react-router-dom";

function GameOverScreen({ score, time, dodged, streak, powerups, restart }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffcc00",
        fontFamily: "sans-serif",
        zIndex: 10,
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Game Over</h1>
      <p style={{ fontSize: "1.2rem" }}>Score: {Math.floor(score)}</p>
      <p style={{ fontSize: "1.2rem" }}>Time Survived: {time.toFixed(1)}s</p>
      <p style={{ fontSize: "1.2rem" }}>Objects Dodged: {dodged}</p>
      <p style={{ fontSize: "1.2rem" }}>Streak: {streak}</p>
      <p style={{ fontSize: "1.2rem" }}>Powerups Collected: {powerups}</p>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={restart}
          style={{
            padding: "10px 25px",
            fontSize: "1rem",
            borderRadius: "5px",
            border: "none",
            background: "#00ffcc",
            color: "#111",
            cursor: "pointer",
            boxShadow: "0 0 10px #00ffcc",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          Restart
        </button>

        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 25px",
            fontSize: "1rem",
            borderRadius: "5px",
            border: "none",
            background: "#ff5555",
            color: "#111",
            cursor: "pointer",
            boxShadow: "0 0 10px #ff5555",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default GameOverScreen;
