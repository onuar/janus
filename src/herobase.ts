import Player from './player';

export default class HeroBase {
    public player: Player;
    public health: number;

    constructor(player: Player) {
        this.player = player;
    }
}