import * as Phaser from 'phaser';
import {GameScene} from "./GameScene";
import {MenuScene} from "./MenuScene";
import Sky from "../models/Sky";
import Scene = Phaser.Scene;
import Text = Phaser.GameObjects.Text;
import Image = Phaser.GameObjects.Image;
import Point = Phaser.Geom.Point;

export default class DefeatScene extends Scene {

    private score: number;
    private highScore: number;
    private sky: Sky;
    private centerPoint: Point;
    private youGotText: Text;
    private playAgainText: Text;
    private mainMenuText: Text;

    constructor() {
        super("DefeatScene");
    }

    public preload(): void {
        this.load.image('sky', 'assets/backdrop_sky.jpg');
        this.load.image('piggyCoinCount', 'assets/piggy_coin_count.png');
        this.load.audio('highScore', 'assets/high_score.mp3');
    }

    public init(data: any): void {
        this.score = data.score || 0;
        this.highScore = Number(window.localStorage.getItem('highScore')) || 0;
        if (this.isHighScore()) {
            window.localStorage.setItem('highScore', String(this.score));
        }
    }

    public create(): void {
        this.centerPoint = new Phaser.Geom.Point(this.sys.canvas.width / 2, this.sys.canvas.height / 2);
        this.sky = new Sky(this, this.centerPoint);
        this.initPiggyBankScore();
        this.initYouGotText();
        this.initPlayAgainText();
        this.initHighScoreText();
        this.initMainMenuText();
        this.applyCommon();
    }

    private initPiggyBankScore(): void {
        let coinCountPiggy: Image = this.add.image(this.sys.canvas.width - 110, 110, 'piggyCoinCount');
        let scoreStyle = DefeatScene.commonStyle();
        scoreStyle.padding = 0;
        this.add.text(coinCountPiggy.x + 5, coinCountPiggy.y - 20, String(this.score), scoreStyle);
    }

    private initYouGotText(): void {
        let youGotStyle = DefeatScene.commonStyle();
        youGotStyle.fontStyle = 'bold';
        youGotStyle.fontSize = '85px';
        this.youGotText = this.add.text(this.centerPoint.x, this.centerPoint.y - 175, "You got " + this.score + "!", youGotStyle);
        this.youGotText.setShadow(-0.5, -0.5, '#000', 2, true, true);
    }

    private initHighScoreText(): void {
        let highScoreStyle = DefeatScene.commonStyle();
        highScoreStyle.fontSize = '45px';
        let highScoreTextContent = "";
        if (this.isHighScore()) {
            highScoreTextContent = "New High Score!!!"
            this.sound.play('highScore');
        } else {
            highScoreTextContent = "(High Score: " + (this.highScore) + ")";
        }
        this.add.text(this.centerPoint.x, this.youGotText.y + 100, highScoreTextContent, highScoreStyle);
    }

    private initPlayAgainText(): void {
        this.playAgainText = this.add.text(this.centerPoint.x, this.centerPoint.y + 50, "Play Again", DefeatScene.commonStyle());
        this.playAgainText.on('pointerdown', () => {
            this.game.scene.remove(this);
            this.game.scene.add('GameScene', GameScene, true);
        });
        this.input.enable(this.playAgainText);
    }

    private initMainMenuText(): void {
        this.mainMenuText = this.add.text(this.centerPoint.x, this.playAgainText.y + 110, 'Main Menu', DefeatScene.commonStyle());
        this.mainMenuText.on('pointerdown', () => {
            this.game.scene.remove(this);
            this.game.scene.add('MenuScene', MenuScene, true);
        });
        this.input.enable(this.mainMenuText);
    }

    private isHighScore(): boolean {
        return this.score > 0 && this.score > this.highScore;
    }

    private applyCommon(): void {
        this.children.getChildren().forEach(child => {
            if (child instanceof Text) {
                DefeatScene.centerText(child);
                if (child !== this.youGotText) {
                    DefeatScene.applyShadow(child);
                }
            }
        });
    }

    private static centerText(text: Text): void {
        text.x -= text.displayWidth / 2;
    }

    private static applyShadow(text: Text): void {
        text.setShadow(-0.5, -0.5, '#000', 1, true, true);
    }

    private static commonStyle(): any {
        return {
            fontFamily: 'Roboto',
            padding: 10,
            fontSize: '55px',
        };
    }
}