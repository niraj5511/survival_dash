// Save a game’s stats to persistent storage
export const saveGameStats = ({
  score,
  time,
  dodged,
  streak,
  powerups,
}) => {
  const stats = JSON.parse(localStorage.getItem("gameStats")) || {
    gamesPlayed: 0,
    highestScore: 0,
    totalScore: 0,
    bestStreak: 0,
    longestTime: 0,
    totalObjectsDodged: 0,
    totalPowerups: 0,
  };

  stats.gamesPlayed += 1;
  stats.totalScore += score;
  stats.highestScore = Math.max(stats.highestScore, score);
  stats.bestStreak = Math.max(stats.bestStreak, streak);
  stats.longestTime = Math.max(stats.longestTime, time);
  stats.totalObjectsDodged += dodged;
  stats.totalPowerups += powerups;

  localStorage.setItem("gameStats", JSON.stringify(stats));

  // Notify UI components to refresh instantly
  window.dispatchEvent(new Event("statsUpdated"));
};

// Retrieve all stats
export const getGameStats = () => {
  return (
    JSON.parse(localStorage.getItem("gameStats")) || {
      gamesPlayed: 0,
      highestScore: 0,
      totalScore: 0,
      bestStreak: 0,
      longestTime: 0,
      totalObjectsDodged: 0,
      totalPowerups: 0,
    }
  );
};
