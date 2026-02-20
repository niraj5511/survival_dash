import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchScoresFromSnowflake } from "../services/apiService";

function Leaderboard() {
  const [lastScores, setLastScores] = useState([]);
  const [source, setSource] = useState(null); // 'snowflake' | 'local'
  const navigate = useNavigate();

  const loadScores = async () => {
    // Try Snowflake first; fall back to localStorage if the server is unreachable
    const snowflakeScores = await fetchScoresFromSnowflake();
    if (snowflakeScores) {
      setLastScores(snowflakeScores.slice(0, 10));
      setSource("snowflake");
    } else {
      const local = JSON.parse(localStorage.getItem("scores")) || [];
      setLastScores(local.slice(-10).reverse());
      setSource("local");
    }
  };

  useEffect(() => {
    loadScores();

    const handleStatsUpdate = () => loadScores();
    window.addEventListener("statsUpdated", handleStatsUpdate);

    const handleFocus = () => loadScores();
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("statsUpdated", handleStatsUpdate);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const highestScore = lastScores.reduce((max, entry) => Math.max(max, entry.score), 0);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #111 0%, #222 100%)",
        color: "#ffcc00",
        fontFamily: "sans-serif",
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          marginBottom: "0.5rem",
          textShadow: "0 0 15px #00ffcc, 0 0 25px #00ffcc",
        }}
      >
        Last 10 Scores
      </h1>
      {source && (
        <p style={{ fontSize: "0.8rem", color: source === "snowflake" ? "#00ffcc" : "#888", marginBottom: "1.5rem" }}>
          {source === "snowflake" ? "Live from Snowflake" : "Offline — local data"}
        </p>
      )}

      {lastScores.length === 0 ? (
        <p style={{ fontSize: "1.2rem", color: "#aaa" }}>No scores yet. Play a game first!</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            background: "rgba(255,255,255,0.05)",
            padding: "20px 30px",
            borderRadius: "12px",
            minWidth: "350px",
          }}
        >
          {lastScores.map((entry, index) => {
            const isHighest = entry.score === highestScore;
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  background: isHighest
                    ? "rgba(0, 255, 204, 0.2)"
                    : "rgba(255, 255, 255, 0.05)",
                  boxShadow: isHighest ? "0 0 10px #00ffcc, 0 0 20px #00ffcc" : "none",
                  transition: "all 0.3s ease",
                  cursor: "default",
                  fontWeight: isHighest ? "bold" : "normal",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <span>Score: {entry.score}</span>
                <span style={{ fontSize: "0.85rem", color: "#aaa" }}>
                  {formatDate(entry.date)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "2rem",
          padding: "12px 30px",
          fontSize: "1.2rem",
          borderRadius: "8px",
          border: "none",
          background: "#00ffcc",
          color: "#111",
          cursor: "pointer",
          boxShadow: "0 0 10px #00ffcc, 0 0 20px #00ffcc",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      >
        Back to Home
      </button>
    </div>
  );
}

export default Leaderboard;
