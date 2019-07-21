import Point = Phaser.Geom.Point;
import {Position} from "./Position";

export default class Coin extends Phaser.Physics.Matter.Image {

    public color: string;

    constructor(world: Phaser.Physics.Matter.World, piggyPoint: Point, position: Position, distanceFromOrigin: number) {
        let pointX = piggyPoint.x;
        let pointY = piggyPoint.y;

        switch (position) {
            case Position.TOP:
                pointY -= distanceFromOrigin;
                break;
            case Position.RIGHT:
                pointX += distanceFromOrigin;
                break;
            case Position.BOTTOM:
                pointY += distanceFromOrigin;
                break;
            case Position.LEFT:
                pointX -= distanceFromOrigin;
                break;
        }
        let color = Coin.randomColor();
        super(world, pointX, pointY, 'coin' + color);
        this.color = color;
    }

    private static randomColor(): string {
        let random = Math.round(Math.random() * 100);
        if (random < 10) {
            return 'Arrow';
        } else if (random < 55) {
            return 'Silver';
        } else {
            return 'Gold';
        }
    }

    public isArrow(): boolean {
        return this.color === "Arrow";
    }
}