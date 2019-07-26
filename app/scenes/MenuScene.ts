import Scene = Phaser.Scene;
import Point = Phaser.Geom.Point;
import Text = Phaser.GameObjects.Text;
import Image = Phaser.GameObjects.Image;
import * as Phaser from "phaser";
import {GameScene} from "./GameScene";

export class MenuScene extends Scene {

    private centerPoint: Point;
    private playText: Text;
    private optionsText: Text;
    private howToPlayText: Text;
    private piggyMarketText: Text;
    private piggy: Image;
    private rotateAmount = 0.002;

    constructor() {
        super("MenuScene");
    }

    public preload(): void {
        this.load.image('sky', 'assets/backdrop_sky.jpg');
        this.load.image('logo', 'assets/logo.png');
        this.load.image('piggy', 'assets/piggy_plain.png');
    }

    public create(): void {
        this.centerPoint = new Phaser.Geom.Point(this.sys.canvas.width / 2, this.sys.canvas.height / 2);
        this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'sky');
        let logo: Image = this.add.image(this.sys.canvas.width / 2, 170, 'logo');
        logo.setAngle(-7);

        this.piggy = this.add.image((logo.x - (logo.displayWidth/2)) + 25, logo.y + logo.displayHeight / 2, 'piggy');
        this.piggy.setDisplayOrigin(this.piggy.displayWidth / 2, 0);

        this.children.bringToTop(logo);
        this.playText = this.add.text(this.centerPoint.x, this.centerPoint.y - 170, "Play", MenuScene.commonStyle());
        this.playText.on('pointerdown', () => {
            this.game.scene.remove(this);
            this.game.scene.add('GameScene', GameScene, true);
        });
        this.input.enable(this.playText);

        this.optionsText = this.add.text(this.centerPoint.x, this.playText.y + 110, "Options", MenuScene.commonStyle());
        this.howToPlayText = this.add.text(this.centerPoint.x, this.optionsText.y + 110, "How to Play", MenuScene.commonStyle());
        this.piggyMarketText = this.add.text(this.centerPoint.x, this.howToPlayText.y + 110, "Piggy Market", MenuScene.commonStyle());

        this.children.getChildren().forEach(child => {
            if (child instanceof Text) {
                MenuScene.centerText(child);
                MenuScene.applyShadow(child);
            }
        });
    }

    public update(): void {
        let isOutOfBounds = this.piggy.rotation > 0.06 || this.piggy.rotation < -0.04;
        if (isOutOfBounds) {
            this.rotateAmount = -this.rotateAmount;
        }

        let shouldSlowDown = this.piggy.rotation > 0.05 || this.piggy.rotation < -0.03;
        if (shouldSlowDown) {
            this.piggy.setRotation(this.piggy.rotation + (this.rotateAmount/1.8));
        } else {
            this.piggy.setRotation(this.piggy.rotation + this.rotateAmount);
        }
    }

    private static commonStyle(): any {
        return {
            fontFamily: 'Roboto',
            padding: 10,
            fontSize: '55px',
        };
    }

    private static centerText(text: Text): void {
        text.x -= text.displayWidth / 2;
    }

    private static applyShadow(text: Text): void {
        text.setShadow(-0.5, -0.5, '#000', 1, true, true);
    }
}