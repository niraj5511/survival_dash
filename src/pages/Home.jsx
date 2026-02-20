import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getGameStats } from "../services/statsService";

function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(getGameStats());

  const refreshStats = () => setStats(getGameStats());

  useEffect(() => {
  // Load initial stats
  setStats(getGameStats());

  // Listen to GameCanvas updates
  const handler = () => setStats(getGameStats());
  window.addEventListener("statsUpdated", handler);

  return () => window.removeEventListener("statsUpdated", handler);
}, []);


  const avgScore = stats.gamesPlayed ? (stats.totalScore / stats.gamesPlayed).toFixed(1) : 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #111 0%, #333 100%)",
        color: "#00ffcc",
        fontFamily: "sans-serif",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem", textShadow: "0 0 10px #00ffcc" }}>
        Survival Dash
      </h1>

      <div style={{ marginBottom: "2rem" }}>
        <button
          onClick={() => navigate("/game")}
          style={{
            padding: "12px 30px",
            fontSize: "1.2rem",
            borderRadius: "8px",
            border: "none",
            background: "#00ffcc",
            color: "#111",
            cursor: "pointer",
            boxShadow: "0 0 10px #00ffcc",
            marginRight: "1rem",
          }}
        >
          Play Game
        </button>

        <button
          onClick={() => navigate("/leaderboard")}
          style={{
            padding: "12px 30px",
            fontSize: "1.2rem",
            borderRadius: "8px",
            border: "none",
            background: "#ff5555",
            color: "#111",
            cursor: "pointer",
            boxShadow: "0 0 10px #ff5555",
          }}
        >
          Score History
        </button>
      </div>

      <div
        style={{
          background: "rgba(0,0,0,0.4)",
          padding: "20px 30px",
          borderRadius: "12px",
          textAlign: "left",
          minWidth: "300px",
        }}
      >
        <h2 style={{ marginBottom: "1rem", color: "#ffcc00" }}>Your Stats</h2>
        <p>Total Games Played: {stats.gamesPlayed}</p>
        <p>Highest Score: {stats.highestScore}</p>
        <p>Average Score: {avgScore}</p>
        <p>Longest Time Survived: {stats.longestTime.toFixed(1)}s</p>
        <p>Total Objects Dodged: {stats.totalObjectsDodged}</p>
        <p>Total Powerups Collected: {stats.totalPowerups}</p>
      </div>
    </div>
  );
}

export default Home;
