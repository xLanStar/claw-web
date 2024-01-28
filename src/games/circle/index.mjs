import Phaser from "phaser";
import GameScene from "./scenes/game.scene.mjs";

export default class Game extends Phaser.Game {
  constructor(parent) {
    super({
      type: Phaser.AUTO,
      scale: {
        parent,
        // mode: Phaser.Scale.FIT,
        width: 540,
        height: 960,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      backgroundColor: "#000000",
      parent,
      scene: [GameScene],
    });
  }
}
