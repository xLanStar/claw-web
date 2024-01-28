import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
  }

  preload() {
    // this.load.image("ball", "assets/ball.png");
  }

  create() {
    // this.add.image(400, 300, "ball");
    this.start = performance.now();
  }

  update() {
    console.log(
      "update",
      (this.game.getFrame() / (performance.now() - this.start)) * 1000,
      (this.game.getFrame() / this.game.getTime()) * 1000
    );
  }
}
