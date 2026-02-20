import React from "react";
import "./Player.css";

function Player({ x, y, width, height, shield }) {
  return (
    <div
      className={`player ${shield ? "shield-active" : ""}`}
      style={{
        left: x,
        top: y,
        width,
        height,
        position: "absolute",
        borderRadius: "10px",
        backgroundColor: "#ffffff",
        boxShadow: shield
          ? "0 0 15px #51ff00, 0 0 30px #09ff00, 0 0 45px #3cff00"
          : "0 0 5px #2bff00, 0 0 10px #48ff00",
        transition: "left 0.05s linear", // smooth horizontal movement
      }}
    />
  );
}

export default Player;
