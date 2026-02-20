import { useEffect } from "react";

export function usePlayerMovement(setPlayerX, playerWidth, gameWidth) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      setPlayerX((prev) => {
        let nextX = prev;
        if (e.key === "ArrowLeft") nextX = Math.max(0, prev - 8);
        if (e.key === "ArrowRight") nextX = Math.min(gameWidth - playerWidth, prev + 8);
        return nextX;
      });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setPlayerX, playerWidth, gameWidth]);
}
