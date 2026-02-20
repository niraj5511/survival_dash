import React from "react";
import "./FallingObject.css";

function FallingObject({ x, y, size, shape }) {
  // shape can be "circle", "square", "triangle"
  const style = {
    left: x,
    top: y,
    position: "absolute",
    width: size,
    height: size,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 0 8px #ff4444, 0 0 15px #ff8888",
  };

  if (shape === "circle") style.borderRadius = "50%";
  if (shape === "square") style.borderRadius = "5px";
  if (shape === "triangle") {
    return (
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${size}px solid #ff4444`,
          position: "absolute",
          left: x,
          top: y,
          filter: "drop-shadow(0 0 5px #ff4444)",
        }}
      />
    );
  }

  style.backgroundColor = "#ff4444";
  return <div style={style} />;
}

export default FallingObject;
