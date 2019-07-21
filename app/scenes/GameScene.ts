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
    private rotateAmount = 0.02;

    constructor() {
        super("GameScene");
    }

    public preload(): void {
        this.load.image('sky', 'assets/backdrop_sky.jpg');
        this.load.image('piggySilver', 'assets/piggy_silver.png');
        this.load.image('piggyGold', 'assets/piggy_gold.png');
        this.load.image('whirlwind', 'assets/whirlwind.png');
        this.load.image('coinSilver', 'assets/coin_silver.png');
        this.load.image('coinGold', 'assets/coin_gold.png');
        this.load.image('coinArrow', 'assets/coin_arrow.png');
    }

    public create(): void {
        this.centerPoint = new Phaser.Geom.Point(this.sys.canvas.width / 2, this.sys.canvas.height / 2);
        this.sky = new Sky(this, this.centerPoint);
        this.whirlwind = new Whirlwind(this, this.centerPoint);
        this.pig = new Pig(this.matter.world, this.centerPoint);

        this.coinDistanceFromOrigin = this.pig.displayHeight * .71;
        this.coins = [null, this.newCoinForPosition(Position.RIGHT), this.newCoinForPosition(Position.BOTTOM), this.newCoinForPosition(Position.LEFT)];

        this.scoreText = this.add.text(50, 50, String(this.score), {
            fontSize: '34px'
        });
        this.matter.world.on('collisionstart', this.onCollisionStart.bind(this));

        this.input.on('pointerdown', this.onPointerDown.bind(this));
        this.input.on('pointerup', this.onPointerUp.bind(this));
        this.input.on('pointerupoutside', this.onPointerUp.bind(this));
    }

    public update(): void {
        if (!this.gameOver) {
            this.pig.setRotation(this.pig.rotation + this.rotateAmount);
            this.whirlwind.setRotation(this.whirlwind.rotation + 0.0025);
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
            this.pig.flipX = !this.pig.flipX;
            this.rotateAmount = -this.rotateAmount;
        }
    }

    private onValidCoinCollision(coin: Coin, indexOfCoin: number): void {
        this.increaseScore();
        this.spawnNewCoinAfterCollision(indexOfCoin);
        coin.destroy();
        if (this.rotateAmount < 0) {
            this.rotateAmount -= 0.001;
        } else {
            this.rotateAmount += 0.001;
        }
    }

    private onInvalidCoinCollision(coin: Coin): void {
        // @ts-ignore
        coin.body.isStatic = true;
        this.gameOver = true;
        setTimeout(() => {
            this.game.scene.remove(this);
            this.game.scene.add('DefeatScene', DefeatScene, true);
        }, 1000);
    }

    private spawnNewCoinAfterCollision(indexOfCollisionCoin: number): void {
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
}