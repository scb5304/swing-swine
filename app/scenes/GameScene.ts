import * as Phaser from 'phaser';
import Scene = Phaser.Scene;
import Image = Phaser.GameObjects.Image;

export class GameScene extends Scene {

    private centerPoint: Phaser.Geom.Point;
    private topCoinPoint: Phaser.Geom.Point;
    private rightCoinPoint: Phaser.Geom.Point;
    private bottomCoinPoint: Phaser.Geom.Point;
    private leftCoinPoint: Phaser.Geom.Point;

    private sky: Image;
    private whirlwind: Image;
    private pig: Image;
    private coins: Image[] = [];

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
        //this.bottomCoinPoint = new Phaser.Geom.Point(this.centerPoint.x, this.sys.canvas.height / 5);
        //this.leftCoinPoint = new Phaser.Geom.Point(this.centerPoint.x, this.sys.canvas.height / 5);

        this.sky = this.add.image(this.centerPoint.x, this.centerPoint.y, 'sky');

        this.whirlwind = this.add.image(this.centerPoint.x, this.centerPoint.y, 'whirlwind');
        this.whirlwind.setScale(0.5, 0.5);
        this.whirlwind.setAlpha(0.5)

        this.pig = this.add.image(this.centerPoint.x, this.centerPoint.y, 'pig');
        this.initPoints();
        this.coins.push(this.add.image(this.topCoinPoint.x, this.topCoinPoint.y, 'silverCoin'));
        this.coins.push(this.add.image(this.rightCoinPoint.x, this.rightCoinPoint.y, 'silverCoin'));
        this.coins.push(this.add.image(this.bottomCoinPoint.x, this.bottomCoinPoint.y, 'silverCoin'));
        this.coins.push(this.add.image(this.leftCoinPoint.x, this.leftCoinPoint.y, 'silverCoin'));
    }

    private initPoints(): void {
        let pigHeight = this.pig.displayHeight;
        let coinDistanceFromOrigin = pigHeight * .71;
        this.topCoinPoint = new Phaser.Geom.Point(this.pig.x, this.pig.y - coinDistanceFromOrigin);
        this.rightCoinPoint = new Phaser.Geom.Point(this.pig.x + coinDistanceFromOrigin, this.pig.y);
        this.bottomCoinPoint = new Phaser.Geom.Point(this.pig.x, this.pig.y + coinDistanceFromOrigin);
        this.leftCoinPoint = new Phaser.Geom.Point(this.pig.x - coinDistanceFromOrigin, this.pig.y);
    }

    //@Override
    public update(): void {
        let pigHeight = this.pig.displayHeight;
        let pigWidth = this.pig.displayWidth;
        this.pig.setDisplayOrigin(pigWidth / 2, pigHeight);
        this.pig.setRotation(this.pig.rotation + 0.01);
        this.whirlwind.setRotation(this.whirlwind.rotation + 0.0025)
    }
}