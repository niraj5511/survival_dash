import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Player from "./Player";
import FallingObject from "./FallingObject";
import PowerUp from "../PowerUp/PowerUp";
import StatsBoard from "../ui/StatsBoard";
import GameOverScreen from "../ui/GameOverScreen";
import { checkCollision } from "../../engine/collision";
import { getSpeed } from "../../engine/difficulty";
import { logEvent } from "../../analytics/eventDispatcher";
import { saveGameStats } from "../../services/statsService";
import { saveScoreToSnowflake } from "../../services/apiService";
import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  OBJECT_SIZE,
  POWERUP_SIZE,
  POWERUP_TYPES,
  GAME_WIDTH,
  GAME_HEIGHT,
} from "../../engine/constants";

function GameCanvas() {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [tick, setTick] = useState(0);
  const [playerX, setPlayerX] = useState(GAME_WIDTH / 2);

  const playerY = GAME_HEIGHT - PLAYER_HEIGHT;
  const objectsRef = useRef([]);
  const powerupsRef = useRef([]);
  const requestRef = useRef();
  const startTimeRef = useRef(Date.now());

  const [timeSurvived, setTimeSurvived] = useState(0);
  const [objectsDodged, setObjectsDodged] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [powerupsCollected, setPowerupsCollected] = useState(0);

  const [shieldActive, setShieldActive] = useState(false);
  const [doubleScoreActive, setDoubleScoreActive] = useState(false);
  const [speedBoostActive, setSpeedBoostActive] = useState(false);

  const [playerSpeed, setPlayerSpeed] = useState(8);
  const navigate = useNavigate();

  // Player movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      setPlayerX((prev) => {
        let next = prev;
        const speed = playerSpeed;
        if (e.key === "ArrowLeft") next = Math.max(0, prev - speed);
        if (e.key === "ArrowRight") next = Math.min(GAME_WIDTH - PLAYER_WIDTH, prev + speed);
        return next;
      });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerSpeed]);

  // Activate powerups
  const activatePowerup = (type) => {
    if (type === "shield") {
      setShieldActive(true);
      setTimeout(() => setShieldActive(false), 3000);
    } else if (type === "double_score") {
      setDoubleScoreActive(true);
      setTimeout(() => setDoubleScoreActive(false), 5000);
    } else if (type === "speed_boost") {
      setSpeedBoostActive(true);
      setPlayerSpeed(14);
      setTimeout(() => {
        setSpeedBoostActive(false);
        setPlayerSpeed(8);
      }, 3000);
    }
  };

  // Restart game
  const restart = () => {
    objectsRef.current = [];
    powerupsRef.current = [];
    setScore(0);
    setGameOver(false);
    setObjectsDodged(0);
    setCurrentStreak(0);
    setPowerupsCollected(0);
    setTimeSurvived(0);
    setShieldActive(false);
    setDoubleScoreActive(false);
    setSpeedBoostActive(false);
    setPlayerSpeed(8);
    startTimeRef.current = Date.now();
    setTick((prev) => prev + 1);

    logEvent("game_restart");
  };

  // End game
  const endGame = () => {
    const finalScore = Math.floor(score);
    setGameOver(true);

    // Save score to localStorage
    saveGameStats({
      score: finalScore,
      time: timeSurvived,
      dodged: objectsDodged,
      streak: currentStreak,
      powerups: powerupsCollected,
    });

    // Save last 10 scores for leaderboard (local fallback)
    const scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.push({ score: finalScore, date: new Date().toISOString() });
    localStorage.setItem("scores", JSON.stringify(scores.slice(-10)));

    // Persist score to Snowflake (fire-and-forget — game continues regardless)
    saveScoreToSnowflake({
      score: finalScore,
      timeSurvived,
      objectsDodged,
    });

    // Notify listeners (Leaderboard, PlayerStatsPanel)
    window.dispatchEvent(new Event("statsUpdated"));

    logEvent("game_over", {
      score: finalScore,
      timeSurvived,
      dodged: objectsDodged,
      streak: currentStreak,
    });
  };

  const gameLoop = () => {
    if (gameOver) return;

    // Move objects
    objectsRef.current = objectsRef.current
      .map((obj) => ({ ...obj, y: obj.y + getSpeed(score) }))
      .filter((obj) => {
        if (obj.y >= GAME_HEIGHT) {
          setObjectsDodged((prev) => prev + 1);
          setCurrentStreak((prev) => prev + 1);
          logEvent("object_dodged", { type: obj.type || "hazard" });
          return false;
        }
        return true;
      });

    // Spawn objects randomly
    if (Math.random() < 0.02) {
      const shapes = ["circle", "square", "triangle"];
      const obj = {
        x: Math.random() * (GAME_WIDTH - OBJECT_SIZE),
        y: 0,
        size: OBJECT_SIZE,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      };
      objectsRef.current.push(obj);
      logEvent("object_spawned", { x: obj.x, y: obj.y, shape: obj.shape });
    }

    // Move powerups
    powerupsRef.current = powerupsRef.current
      .map((p) => ({ ...p, y: p.y + 1.5 }))
      .filter((p) => p.y < GAME_HEIGHT);

    // Spawn powerups occasionally
    if (Math.random() < 0.005) {
      const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
      const p = { x: Math.random() * (GAME_WIDTH - POWERUP_SIZE), y: 0, size: POWERUP_SIZE, type };
      powerupsRef.current.push(p);
      logEvent("powerup_spawned", { type, x: p.x });
    }

    // Collision detection with objects
    for (let obj of objectsRef.current) {
      if (
        !shieldActive &&
        checkCollision({ x: playerX, y: playerY, width: PLAYER_WIDTH, height: PLAYER_HEIGHT }, obj)
      ) {
        endGame();
        return;
      }
    }

    // Collision detection with powerups
    powerupsRef.current = powerupsRef.current.filter((p) => {
      if (
        checkCollision({ x: playerX, y: playerY, width: PLAYER_WIDTH, height: PLAYER_HEIGHT }, p)
      ) {
        setPowerupsCollected((prev) => prev + 1);
        logEvent("powerup_collected", { type: p.type });
        activatePowerup(p.type);
        setScore((prev) => prev + (p.type === "double_score" && doubleScoreActive ? 20 : 10));
        return false;
      }
      return true;
    });

    // Increment score/time
    setScore((prev) => prev + (doubleScoreActive ? 0.1 : 0.05));
    setTimeSurvived((Date.now() - startTimeRef.current) / 1000);

    setTick((prev) => prev + 1);
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    logEvent("game_start");
    return () => cancelAnimationFrame(requestRef.current);
  }, [tick, gameOver]);

  return (
    <div
      style={{
        position: "relative",
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        borderRadius: "15px",
        margin: "20px auto",
        overflow: "hidden",
        background: "linear-gradient(to bottom, #1a1a1a 0%, #111 100%)",
        boxShadow: "0 0 30px #00ffcc inset, 0 0 20px #ff4444 inset",
        border: "2px solid #00ffcc",
      }}
    >
      <StatsBoard
        score={score}
        time={timeSurvived}
        dodged={objectsDodged}
        streak={currentStreak}
        powerups={powerupsCollected}
      />

      <Player x={playerX} y={playerY} width={PLAYER_WIDTH} height={PLAYER_HEIGHT} shield={shieldActive} />

      {objectsRef.current.map((obj, i) => <FallingObject key={i} {...obj} />)}

      {powerupsRef.current.map((p, i) => <PowerUp key={i} {...p} />)}

      {gameOver && (
        <GameOverScreen
          score={Math.floor(score)}
          time={timeSurvived}
          dodged={objectsDodged}
          streak={currentStreak}
          powerups={powerupsCollected}
          restart={restart}
        />
      )}
    </div>
  );
}

export default GameCanvas;
