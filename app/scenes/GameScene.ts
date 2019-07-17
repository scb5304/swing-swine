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
    private gameOver: boolean = false;

    //@Override
    public preload(): void {
        this.load.image('sky', 'assets/backdrop_sky.jpg');
        this.load.image('piggySilver', 'assets/piggy_silver.png');
        this.load.image('piggyGold', 'assets/piggy_gold.png');
        this.load.image('whirlwind', 'assets/whirlwind.png');
        this.load.image('coinSilver', 'assets/coin_silver.png');
    }

    //@Override
    public create(): void {
        this.initWorld();
        this.initPig();
        this.initCoins();
        this.initInput();
        this.initScore();
    }

    private initWorld(): void {
        this.centerPoint = new Phaser.Geom.Point(this.sys.canvas.width / 2, this.sys.canvas.height / 2);
        this.matter.world.on('collisionstart', this.onCollisionStart.bind(this));
        this.sky = this.add.image(this.centerPoint.x, this.centerPoint.y, 'sky');

        this.whirlwind = this.add.image(this.centerPoint.x, this.centerPoint.y, 'whirlwind');
        this.whirlwind.setScale(0.5, 0.5);
        this.whirlwind.setAlpha(0.5);
    }

    private initPig(): void {
        let pigBodyOffset = 250;
        this.pig = this.matter.add.image(this.centerPoint.x, this.centerPoint.y - pigBodyOffset, 'piggySilver');
        let pigRect: any = this.pig.setRectangle(50, 100, null);
        pigRect.body.isStatic = true;
        pigRect.body.position.y += pigBodyOffset;
        pigRect.body.name = "piggy";

        let pigHeight = this.pig.displayHeight;
        let pigWidth = this.pig.displayWidth;
        this.pig.setDisplayOrigin(pigWidth / 2, pigHeight);
    }

    private initCoins(): void {
        this.coinDistanceFromOrigin = this.pig.displayHeight * .71;
        this.coins = [null, this.newRightCoinImage(), this.newBottomCoinImage(), this.newLeftCoinImage()];
    }

    private initInput(): void {
        this.input.on('pointerdown', this.onPointerDown.bind(this));
        this.input.on('pointerup', this.onPointerUp.bind(this));
        this.input.on('pointerupoutside', this.onPointerUp.bind(this));
    }

    private initScore(): void {
        this.scoreText = this.add.text(50, 50, String(this.score));
    }

    private onPointerDown(): void {
        // @ts-ignore
        this.pig.body.gameObject.setTexture('piggyGold');
    }

    private onPointerUp(): void {
        // @ts-ignore
        this.pig.body.gameObject.setTexture('piggySilver');
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
        if (this.isCoinPiggyMatch(coin)) {
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
        } else {
            // @ts-ignore
            coin.body.isStatic = true;
            this.gameOver = true;
        }
    }

    private isCoinPiggyMatch(coin: GameObject): boolean {
        let piggyImage = this.pigImage();
        let coinImage = GameScene.coinImage(coin);
        return (piggyImage.indexOf("silver") != -1 && coinImage.indexOf("silver") != -1) ||
            (piggyImage.indexOf("gold") != -1 && coinImage.indexOf("gold") != -1);
    }

    private pigImage(): String {
        // @ts-ignore
        return this.pig.body.gameObject.texture.key.toLowerCase();
    }

    private static coinImage(coin: GameObject): string {
        // @ts-ignore
        return coin.texture.key.toLowerCase();
    }

    private newCoinForPosition(position: number): Phaser.Physics.Matter.Image {
        let coin: any;
        if (position === Position.TOP) {
            coin = this.newTopCoinImage();
        } else if (position === Position.RIGHT) {
            coin = this.newRightCoinImage();
        } else if (position === Position.BOTTOM) {
            coin = this.newBottomCoinImage();
        } else {
            coin = this.newLeftCoinImage();
        }
        return coin;
    }

    private newTopCoinImage(): Phaser.Physics.Matter.Image {
        return this.matter.add.image(this.pig.x, this.pig.y - this.coinDistanceFromOrigin, 'coinSilver');
    }

    private newRightCoinImage(): Phaser.Physics.Matter.Image {
        return this.matter.add.image(this.pig.x + this.coinDistanceFromOrigin, this.pig.y, 'coinSilver');
    }

    private newBottomCoinImage(): Phaser.Physics.Matter.Image {
        return this.matter.add.image(this.pig.x, this.pig.y + this.coinDistanceFromOrigin, 'coinSilver');
    }

    private newLeftCoinImage(): Phaser.Physics.Matter.Image {
        return this.matter.add.image(this.pig.x - this.coinDistanceFromOrigin, this.pig.y, 'coinSilver');
    }

    //@Override
    public update(): void {
        if (!this.gameOver) {
            this.pig.setRotation(this.pig.rotation + .02);
            this.whirlwind.setRotation(this.whirlwind.rotation + 0.0025);
        }
    }
}