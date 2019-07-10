import {GameScene} from './scenes/GameScene';
import {VidyaGame} from './VidyaGame';

export class Booter {
    private game: VidyaGame;

    constructor() {
        this.game = new VidyaGame();
        this.game.scene.start('GameScene')
    }
}

//Start
new Booter();