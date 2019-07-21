import * as Phaser from 'phaser';
import {GameScene} from "./GameScene";
import Scene = Phaser.Scene;
import Text = Phaser.GameObjects.Text;

export default class DefeatScene extends Scene {

    constructor() {
        super("DefeatScene");
    }

    public preload(): void {
        this.load.image('sky', 'assets/backdrop_sky.jpg');
    }

    public create(): void {
        this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'sky');
        let playAgainText: Text = this.add.text(50, 50, String("Play Again"), {
            fontSize: '34px'
        });
        this.input.enable(playAgainText);
        playAgainText.on('pointerdown', () => {
            this.game.scene.remove(this);
            this.game.scene.add('GameScene', GameScene, true);
        });
    }
}