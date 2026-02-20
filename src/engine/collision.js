export function checkCollision(player, object) {
  const playerLeft = player.x;
  const playerRight = player.x + player.width;
  const playerTop = player.y;
  const playerBottom = player.y + player.height;

  const objectLeft = object.x;
  const objectRight = object.x + (object.width || object.size); // object.size for square
  const objectTop = object.y;
  const objectBottom = object.y + (object.height || object.size);

  return !(
    playerBottom < objectTop || // player above object
    playerTop > objectBottom || // player below object
    playerRight < objectLeft || // player left of object
    playerLeft > objectRight // player right of object
  );
}
