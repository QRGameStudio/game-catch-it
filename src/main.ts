/// <reference path="./game.ts" />

const game = new Game(() => {
  console.log("game won");
});

const startGame = () => {
  // @ts-ignore
  new GTheme().apply();
  let container = document.getElementById("plane") as HTMLDivElement;
  container.onclick = game.changeDirection;
  setTimeout(tick, 100);
};

const tick = () => {
  game.refresh();
  setTimeout(tick, 100);
};

startGame();
