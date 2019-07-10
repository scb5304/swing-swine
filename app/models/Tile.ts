import Image = Phaser.GameObjects.Image;

export class Tile {
    public image: Image;
    public traversable: boolean = true;

    constructor(tileConfig?: TileConfig) {
        if (tileConfig == undefined) {
            tileConfig = {};
        }
        if (tileConfig.traversable !== undefined) {
            this.traversable = tileConfig.traversable;
        }
        if (tileConfig.image !== undefined) {
            this.image = tileConfig.image;
        }
    }
}

export interface TileConfig {
    traversable?: boolean,
    image?: Image
}