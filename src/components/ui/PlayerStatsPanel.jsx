import { useState, useEffect } from "react";
import { getGameStats } from "../../services/statsService";

function PlayerStatsPanel() {
  const [stats, setStats] = useState(getGameStats());

  useEffect(() => {
    const handler = () => setStats(getGameStats());
    window.addEventListener("statsUpdated", handler);

    return () => window.removeEventListener("statsUpdated", handler);
  }, []);

  const avgScore = stats.gamesPlayed
    ? (stats.totalScore / stats.gamesPlayed).toFixed(1)
    : 0;

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        color: "#ffcc00",
        fontFamily: "sans-serif",
        background: "rgba(0,0,0,0.4)",
        padding: "10px 14px",
        borderRadius: "8px",
        fontSize: "0.9rem",
        lineHeight: "1.4rem",
      }}
    >
      <div>Total Games: {stats.gamesPlayed}</div>
      <div>Highest Score: {stats.highestScore}</div>
      <div>Average Score: {avgScore}</div>
      <div>Best Streak: {stats.bestStreak}</div>
      <div>Longest Time: {stats.longestTime.toFixed(1)}s</div>
      <div>Total Objects Dodged: {stats.totalObjectsDodged}</div>
      <div>Total Powerups Collected: {stats.totalPowerups}</div>
    </div>
  );
}

export default PlayerStatsPanel;
