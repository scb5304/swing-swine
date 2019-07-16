import * as Phaser from 'phaser';
import Scene = Phaser.Scene;
import Image = Phaser.GameObjects.Image;
import {Position} from "../models/Position";
import GameObject = Phaser.GameObjects.GameObject;

export class GameScene extends Scene {

    private centerPoint: Phaser.Geom.Point;
    private sky: Image;
    private whirlwind: Image;
    private pig: Phaser.Physics.Matter.Image;
    private coinDistanceFromOrigin: number;
    private scoreText: Phaser.GameObjects.Text;
    private score: number = 0;
    private coins: GameObject[] = [];

    //@Override
    public preload(): void {
        this.load.image('sky', 'assets/backdrop_sky.jpg');
        this.load.image('pig', 'assets/piggy_silver.png');
        this.load.image('whirlwind', 'assets/whirlwind.png');
        this.load.image('silverCoin', 'assets/coin_silver.png');
    }

    //@Override
    public create(): void {
        this.centerPoint = new Phaser.Geom.Point(this.sys.canvas.width / 2, this.sys.canvas.height / 2);
        this.sky = this.add.image(this.centerPoint.x, this.centerPoint.y, 'sky');

        this.whirlwind = this.add.image(this.centerPoint.x, this.centerPoint.y, 'whirlwind');
        this.whirlwind.setScale(0.5, 0.5);
        this.whirlwind.setAlpha(0.5);

        let pigBodyOffset = 250;
        this.pig = this.matter.add.image(this.centerPoint.x, this.centerPoint.y - pigBodyOffset, 'pig');
        this.pig.name = "piggy";
        let pigRect: any = this.pig.setRectangle(50, 100, null);
        pigRect.body.isStatic = true;
        pigRect.body.position.y += pigBodyOffset;
        pigRect.body.name = "piggy";

        let pigHeight = this.pig.displayHeight;
        let pigWidth = this.pig.displayWidth;
        this.pig.setDisplayOrigin(pigWidth / 2, pigHeight);

        this.initCoins();
        this.scoreText = this.add.text(50, 50, String(this.score));
        this.matter.world.on('collisionstart', this.onCollisionStart.bind(this));
    }

    private onCollisionStart(event: any, body1: any, body2: any): void {
        let coin: Phaser.GameObjects.GameObject;
        if (body1.name != "piggy") {
            coin = body1.gameObject;
        } else {
            coin = body2.gameObject;
        }

        let indexOfCoin: number = this.coins.indexOf(coin);
        if (indexOfCoin != -1) {
            this.onCoinCollision(coin, indexOfCoin);
        }
    }

    private onCoinCollision(coin: GameObject, indexOfCoin: number): void {
        coin.destroy();
        this.score++;
        this.scoreText.setText(String(this.score));

        switch (indexOfCoin) {
            case Position.TOP:
                this.coins[Position.LEFT] = this.newLeftCoinImage();
                break;
            case Position.RIGHT:
                this.coins[Position.TOP] = (this.newTopCoinImage());
                break;
            case Position.BOTTOM:
                this.coins[Position.RIGHT] = (this.newRightCoinImage());
                break;
            case Position.LEFT:
                this.coins[Position.BOTTOM] = (this.newBottomCoinImage());
                break;
        }
    }

    private initCoins(): void {
        this.coinDistanceFromOrigin = this.pig.displayHeight * .71;
        this.coins = [null, this.newRightCoinImage(), this.newBottomCoinImage(), this.newLeftCoinImage()];
    }

    private newTopCoinImage(): Phaser.Physics.Matter.Image {
        return this.matter.add.image(this.pig.x, this.pig.y - this.coinDistanceFromOrigin, 'silverCoin');
    }

    private newRightCoinImage(): Phaser.Physics.Matter.Image {
        return this.matter.add.image(this.pig.x + this.coinDistanceFromOrigin, this.pig.y, 'silverCoin');
    }

    private newBottomCoinImage(): Phaser.Physics.Matter.Image {
        return this.matter.add.image(this.pig.x, this.pig.y + this.coinDistanceFromOrigin, 'silverCoin');
    }

    private newLeftCoinImage(): Phaser.Physics.Matter.Image {
        return this.matter.add.image(this.pig.x - this.coinDistanceFromOrigin, this.pig.y, 'silverCoin');
    }

    //@Override
    public update(): void {
        this.pig.setRotation(this.pig.rotation + .02);
        this.whirlwind.setRotation(this.whirlwind.rotation + 0.0025)
    }
}