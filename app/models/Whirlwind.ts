import Scene = Phaser.Scene;
import Point = Phaser.Geom.Point;

export default class Whirlwind extends Phaser.GameObjects.Image {
    constructor(scene: Scene, point: Point) {
        super(scene, point.x, point.y, 'whirlwind');
        this.setScale(0.7, 0.7);
        this.setAlpha(0.38);
        scene.children.add(this);
    }
}