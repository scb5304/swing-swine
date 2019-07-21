import Game = Phaser.Game;
import GameConfig = Phaser.Types.Core.GameConfig;
import * as Phaser from 'phaser';

export class VidyaGame extends Game {
    constructor() {
        let gameConfig: GameConfig = {
            type: Phaser.AUTO,
            width: 720,
            height: 1080,
            input: true,
            autoFocus: true,
            disableContextMenu: true,
            physics: {
                default: 'matter',
                matter: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
        };
        super(gameConfig);
    }
}