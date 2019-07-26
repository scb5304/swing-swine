import {VidyaGame} from './VidyaGame';
import {MenuScene} from "./scenes/MenuScene";

export class Booter {
    private game: VidyaGame;

    constructor() {
        this.game = new VidyaGame();
        this.game.scene.add('MenuScene', MenuScene, true)
    }
}

//Start
new Booter();