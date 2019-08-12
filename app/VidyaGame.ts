import Game = Phaser.Game;
import GameConfig = Phaser.Types.Core.GameConfig;
import * as Phaser from 'phaser';

export class VidyaGame extends Game {
    constructor() {
        let gameConfig: GameConfig = {
            type: Phaser.AUTO,
            input: true,
            autoFocus: true,
            width: 640,
            height: 960,
            render: {
                transparent: true
            },
            transparent: true,
            scale: {
                autoCenter: Phaser.Scale.CENTER_BOTH,
                mode: Phaser.Scale.ScaleModes.FIT
            },
            disableContextMenu: false,
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