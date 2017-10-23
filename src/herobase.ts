import Player from './player';
import Collection from './foundation/generic-collection';
import Card from './card';

export default class HeroBase {
    public player: Player;
    public health: number;
    public cards: Collection<Card>;

    constructor(player: Player, cards: Collection<Card>) {
        this.player = player;
        this.cards = cards;
    }
}