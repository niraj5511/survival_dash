import { useNavigate } from "react-router-dom";

function StartScreen() {
  const navigate = useNavigate();

  return (
    <div
  style={{
    width: "100%",
    height: "100vh",
    background: "linear-gradient(to bottom, #111, #222)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <h1 style={{ fontSize: "4rem", marginBottom: "2rem", color: "#00ffcc", textShadow: "0 0 10px #00ffcc" }}>
    Survival Dash
  </h1>
  <button
    style={{
      padding: "15px 40px",
      fontSize: "1.5rem",
      marginBottom: "1rem",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      background: "#00ffcc",
      color: "#111",
      boxShadow: "0 0 10px #00ffcc",
      transition: "transform 0.2s",
    }}
    onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
    onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
    onClick={() => navigate("/game")}
  >
    Start Game
  </button>
  <button
    style={{
      padding: "12px 30px",
      fontSize: "1.2rem",
      borderRadius: "8px",
      border: "none",
      background: "#ff5555",
      color: "#111",
      cursor: "pointer",
      boxShadow: "0 0 10px #ff5555",
      transition: "transform 0.2s",
    }}
    onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
    onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
    onClick={() => navigate("/leaderboard")}
  >
    Leaderboard
  </button>
</div>

  );
}

export default StartScreen;
