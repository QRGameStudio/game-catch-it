/// <reference path="./gameView.ts" />

interface IPosition {
  x: number;
  y: number;
  speed: number;
}
class Game {
  private gameView: GameView;
  private gameOver: () => void;
  private paddlePosition: IPosition;
  private fallers: IPosition[];
  private score: number;
  private nextSpawnProb: number;
  private running: boolean;
  private highScore: number;

  private readonly paddleSpeedModifier = 2;
  private readonly fallerSpeedModifier = 1.8;
  private readonly spawnModifier = 0.05;

  constructor(gameOver: () => void) {
    this.gameOver = gameOver;
    this.loadHighScore();
    this.fallers = [];
    this.paddlePosition = { x: 40, y: 92, speed: this.paddleSpeedModifier };
    this.score = 0;
    this.running = true;
    this.nextSpawnProb = 1;
    this.gameView = new GameView(this);
    this.gameView.draw();
  }

  private saveHighScore = () => {
    // @ts-ignore
    new GStorage("QRAliens").set("HS", Math.max(this.getScore(), this.highScore).toString());
  };

  private loadHighScore = () => {
    this.highScore = 999;
    // @ts-ignore
    new GStorage("QRAliens").get("HS", 0).then((h) => (this.highScore = parseInt(h)));
  };

  private moveFallers = () => {
    this.fallers = this.fallers.map((p) => {
      return { ...p, y: p.y + p.speed };
    });
  };

  private spawnFaller = () => {
    if (Math.random() < this.nextSpawnProb) {
      this.nextSpawnProb = 0;
      this.fallers.push({ x: Math.floor(92 * Math.random()), y: 0, speed: Math.random() * this.fallerSpeedModifier });
    } else {
      this.nextSpawnProb += this.spawnModifier;
    }
  };

  private handleCollisions = () => {
    this.handlePaddleFallersCollisions();
    this.handleFloorFallersCollisions();
  };

  private handlePaddleFallersCollisions = () => {
    for (let i = 0; i < this.fallers.length; i++) {
      if (
        this.fallers[i].y >= 88 &&
        this.fallers[i].x >= this.paddlePosition.x &&
        this.fallers[i].x + 8 <= this.paddlePosition.x + 22
      ) {
        this.gameView.hideFaller(i);
        this.fallers[i] = { x: -10, y: -10, speed: 0 };
        this.score += 1;
        // @ts-ignore
        new GSongLib().play("good");
        if (this.score > this.highScore) {
          this.highScore = this.score;
          this.saveHighScore();
        }
      }
    }
  };

  private handleFloorFallersCollisions = () => {
    for (let i = 0; i < this.fallers.length; i++) {
      if (this.fallers[i].y >= 96) {
        this.gameView.hideFaller(i);
        this.fallers[i] = { x: -10, y: -10, speed: 0 };
        this.score -= 1;
      }
    }
  };

  getFallers = () => [...this.fallers];

  getPaddle = () => {
    return { ...this.paddlePosition };
  };

  getScore = () => this.score;

  getHighScore = () => this.highScore;

  changeDirection = () => (this.paddlePosition.speed *= -1);

  movePaddle = () => {
    this.paddlePosition.x += this.paddlePosition.speed;
    if (this.paddlePosition.x <= 0) this.paddlePosition.speed = Math.abs(this.paddlePosition.speed);
    if (this.paddlePosition.x >= 78) this.paddlePosition.speed = -Math.abs(this.paddlePosition.speed);
  };

  refresh = () => {
    if (this.running) {
      this.moveFallers();
      this.movePaddle();
      this.handleCollisions();
      this.spawnFaller();
      // if (this.score >= 32) {
      //   this.running = false;
      //   this.gameOver();
      // }
      this.gameView.draw();
    }
  };
}
