import Scene = Phaser.Scene;
import Point = Phaser.Geom.Point;

export class Whirlwind extends Phaser.GameObjects.Image {
    constructor(scene: Scene, point: Point) {
        super(scene, point.x, point.y, 'whirlwind');
        this.setScale(0.5, 0.5);
        this.setAlpha(0.5);
        scene.children.add(this);
    }
}