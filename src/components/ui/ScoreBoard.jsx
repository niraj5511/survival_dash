function ScoreBoard({ score }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: "#00ffcc",
        textShadow: "0 0 5px #00ffcc",
      }}
    >
      Score: {score}
    </div>
  );
}

export default ScoreBoard;
