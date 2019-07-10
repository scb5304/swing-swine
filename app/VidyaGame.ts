import Game = Phaser.Game;
import * as Phaser from 'phaser';
import GameConfig = Phaser.Types.Core.GameConfig;
import {GameScene} from "./scenes/GameScene";

export class VidyaGame extends Game {
    constructor() {
        let gameConfig: GameConfig = {
            type: Phaser.AUTO,
            width: 1080,
            height: 720,
            scene: [GameScene],
            input: true
        };
        super(gameConfig);
    }
}