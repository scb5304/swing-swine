import Point = Phaser.Geom.Point;
import Coin from "./Coin";

export default class Pig extends Phaser.Physics.Matter.Image {

    public color: string;

    constructor(world: Phaser.Physics.Matter.World, point: Point) {
        let pigBodyOffset = 250;
        super(world, point.x, point.y - pigBodyOffset, 'piggySilver');
        this.color = 'Silver';

        let pigRect: any = this.setRectangle(50, 100, null);
        pigRect.body.isStatic = true;
        pigRect.body.position.y += pigBodyOffset;
        pigRect.body.name = "piggy";
        this.setDisplayOrigin(this.displayWidth / 2, this.displayHeight);
        world.scene.children.add(this);
    }

    setColor(color: string) {
        this.color = color;
        this.setTexture('piggy' + this.color);
    }

    acceptsCoin(coin: Coin): boolean {
        return coin.color === "Arrow" || this.color === coin.color;
    }
}