class GameView {
  private game: Game;
  private container: HTMLDivElement;
  private fallers: HTMLDivElement[];
  private paddle: HTMLDivElement;
  private scoreBox: HTMLDivElement;

  constructor(game: Game) {
    this.game = game;
    this.fallers = [];
    this.container = document.getElementById("gameContent") as HTMLDivElement;
    this.paddle = this.generatePaddle();
    this.scoreBox = this.generateScoreBox();
  }

  private generatePaddle = () => {
    const e = document.createElement("div");
    e.className = "paddle";
    this.container.appendChild(e);
    return e;
  };

  private generateScoreBox = () => {
    const e = document.createElement("div");
    e.className = "scoreBox";
    this.container.appendChild(e);
    return e;
  };

  private updateFallers = () => {
    this.game.getFallers().forEach((faller, i) => {
      if (i >= this.fallers.length) {
        const e = document.createElement("div");
        e.className = "faller";
        // @ts-ignore
        e.innerText = GUt.ud("8J+RvQ==");
        this.fallers.push(e);
        this.container.appendChild(e);
      }
      this.fallers[i].style.left = `${faller.x}%`;
      this.fallers[i].style.top = `${faller.y}%`;
    });
  };

  private updatePaddle = () => {
    this.paddle.style.left = `${this.game.getPaddle().x}%`;
    this.paddle.style.top = `${this.game.getPaddle().y}%`;
  };

  private updateScore = () => {
    this.scoreBox.innerHTML =
      this.game.getScore().toString() + `\n<span style="font-size: small">${this.game.getHighScore().toString()}</span>`;
  };

  hideFaller = (i: number) => {
    this.fallers[i].hidden = true;
  };

  draw = () => {
    this.updateFallers();
    this.updatePaddle();
    this.updateScore();
  };
}
