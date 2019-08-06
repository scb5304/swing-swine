import * as Phaser from 'phaser';
import Position from "../models/Position";
import Sky from "../models/Sky";
import Whirlwind from "../models/Whirlwind";
import Pig from "../models/Pig";
import Coin from "../models/Coin";
import DefeatScene from "./DefeatScene";
import Scene = Phaser.Scene;
import Point = Phaser.Geom.Point;

export class GameScene extends Scene {

    private centerPoint: Phaser.Geom.Point;
    private sky: Sky;
    private whirlwind: Whirlwind;
    private pig: Pig;
    private coins: Coin[] = [];

    private coinDistanceFromOrigin: number;
    private scoreText: Phaser.GameObjects.Text;
    private score: number = 0;
    private gameOver: boolean = false;
    private rotateAmount = 0.012;

    constructor() {
        super("GameScene");
    }

    public preload(): void {
        this.load.image('sky', 'assets/images/backdrop_sky.jpg');
        this.load.image('piggySilver', 'assets/images/piggy_silver.png');
        this.load.image('piggyGold', 'assets/images/piggy_gold.png');
        this.load.image('whirlwind', 'assets/images/whirlwind.png');
        this.load.image('coinSilver', 'assets/images/coin_silver.png');
        this.load.image('coinGold', 'assets/images/coin_gold.png');
        this.load.image('coinArrow', 'assets/images/coin_arrow.png');

        this.load.audio('soundCoinCollect', 'assets/sounds/coin_collect.mp3');
        this.load.audio('soundCoinClash', 'assets/sounds/coin_clash.mp3');
        this.load.audio('soundCoinArrow', 'assets/sounds/coin_arrow.mp3');
        this.load.audio('soundPiggyFlip', 'assets/sounds/piggy_flip.mp3');
        this.load.audio('soundPiggyOink', 'assets/sounds/piggy_oink.mp3');
    }

    public create(): void {
        this.centerPoint = new Phaser.Geom.Point(this.sys.canvas.width / 2, this.sys.canvas.height / 2);
        this.sky = new Sky(this, this.centerPoint);
        this.whirlwind = new Whirlwind(this, this.centerPoint);
        this.pig = new Pig(this.matter.world, this.centerPoint);

        this.coinDistanceFromOrigin = this.pig.displayHeight * .71;
        this.coins = [null, this.newCoinForPosition(Position.RIGHT), this.newCoinForPosition(Position.BOTTOM), this.newCoinForPosition(Position.LEFT)];

        this.scoreText = this.add.text(60, 50, String(this.score), {
            fontFamily: 'Roboto',
            fontSize: '72px'
        });
        this.scoreText.alpha = 0.6;
        this.matter.world.on('collisionstart', this.onCollisionStart.bind(this));

        this.input.on('pointerdown', this.onPointerDown.bind(this));
        this.input.on('pointerup', this.onPointerUp.bind(this));
        this.input.on('pointerupoutside', this.onPointerUp.bind(this));
    }

    public update(): void {
        if (!this.gameOver) {
            this.pig.setRotation(this.pig.rotation + this.rotateAmount);
            this.whirlwind.setRotation(this.whirlwind.rotation + (this.rotateAmount / 4));
        }
    }

    private onPointerDown(): void {
        this.pig.setColor("Gold");
    }

    private onPointerUp(): void {
        this.pig.setColor("Silver");
    }

    private newCoinForPosition(position: number): Coin {
        let coin: Coin = new Coin(this.matter.world, new Point(this.pig.x, this.pig.y), position, this.coinDistanceFromOrigin);
        this.children.add(coin);
        if (coin.isArrow()) {
            this.playCoinArrowSpawnSound();
        }
        return coin;
    }

    private onCollisionStart(event: any, body1: any, body2: any): void {
        let coin: Coin;
        coin = (body1.gameObject instanceof Coin) ? body1.gameObject : body2.gameObject;
        let indexOfCoin: number = this.coins.indexOf(coin);
        if (indexOfCoin != -1) {
            this.onCoinCollision(coin, indexOfCoin);
        }
    }

    private onCoinCollision(coin: Coin, indexOfCoin: number): void {
        if (this.pig.acceptsCoin(coin)) {
            this.onValidCoinCollision(coin, indexOfCoin);
        } else {
            this.onInvalidCoinCollision(coin);
        }
        if (coin.isArrow()) {
            this.playPigFlipSound();
            this.pig.flipX = !this.pig.flipX;
            this.rotateAmount = -this.rotateAmount;
        }
    }

    private onValidCoinCollision(coin: Coin, indexOfCoin: number): void {
        this.increaseScore();
        this.playCoinCollectSound();
        this.spawnNewCoinAfterCollision(coin, indexOfCoin);
        coin.destroy();

        let rotateAmountIncrement = 0.00003 / Math.abs(this.rotateAmount);
        if (this.rotateAmount < 0) {
            this.rotateAmount -= rotateAmountIncrement;
        } else {
            this.rotateAmount += rotateAmountIncrement;
        }
        this.scoreText.alpha += 0.008;
    }

    private onInvalidCoinCollision(coin: Coin): void {
        // @ts-ignore
        coin.body.isStatic = true;
        this.gameOver = true;
        this.playCoinClashSound();
        setTimeout(() => {
            this.game.scene.add('DefeatScene', DefeatScene, true, {
                score: this.score
            });
            this.game.scene.remove(this);
        }, 1000);
    }

    private spawnNewCoinAfterCollision(coin: Coin, indexOfCollisionCoin: number): void {
        if (coin.isArrow()) {
            this.coins[indexOfCollisionCoin] = this.newCoinForPosition(indexOfCollisionCoin);
            return;
        }
        if (indexOfCollisionCoin === Position.TOP) {
            if (this.rotateAmount > 0) {
                this.coins[Position.LEFT] = this.newCoinForPosition(Position.LEFT);
            } else {
                this.coins[Position.RIGHT] = this.newCoinForPosition(Position.RIGHT);
            }
        } else if (indexOfCollisionCoin === Position.RIGHT) {
            if (this.rotateAmount > 0) {
                this.coins[Position.TOP] = this.newCoinForPosition(Position.TOP);
            } else {
                this.coins[Position.BOTTOM] = this.newCoinForPosition(Position.BOTTOM);
            }
        } else if (indexOfCollisionCoin === Position.BOTTOM) {
            if (this.rotateAmount > 0) {
                this.coins[Position.RIGHT] = this.newCoinForPosition(Position.RIGHT);
            } else {
                this.coins[Position.LEFT] = this.newCoinForPosition(Position.LEFT);
            }
        } else {
            if (this.rotateAmount > 0) {
                this.coins[Position.BOTTOM] = this.newCoinForPosition(Position.BOTTOM);
            } else {
                this.coins[Position.TOP] = this.newCoinForPosition(Position.TOP);
            }
        }
    }

    private increaseScore(): void {
        this.score++;
        this.scoreText.setText(String(this.score));
        this.scoreText.y -= 4;
        setTimeout(() => this.scoreText.y += 4, 25);
    }

    private playCoinCollectSound(): void {
        this.sound.play('soundCoinCollect');
    }

    private playCoinClashSound(): void {
        this.sound.play('soundCoinClash');
    }

    private playCoinArrowSpawnSound(): void {
        this.sound.play('soundCoinArrow');
    }

    private playPigFlipSound(): void {
        this.sound.play('soundPiggyFlip');
    }
}