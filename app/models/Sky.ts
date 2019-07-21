import Scene = Phaser.Scene;
import Point = Phaser.Geom.Point;

export default class Sky extends Phaser.GameObjects.Image {
    constructor(scene: Scene, point: Point) {
        super(scene, point.x, point.y, 'sky');
        scene.children.add(this);
    }
}