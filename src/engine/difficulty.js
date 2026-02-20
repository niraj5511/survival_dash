// src/engine/difficulty.js
import { DIFFICULTY_SPEED_BASE, DIFFICULTY_SPEED_INCREMENT } from "./constants";

export function getSpeed(score) {
  return DIFFICULTY_SPEED_BASE + score * DIFFICULTY_SPEED_INCREMENT;
}
