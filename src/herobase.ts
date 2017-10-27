import Player from './player';
import Collection from './foundation/generic-collection';
import Card from './card';
import CardCollection from './card-collection';

export default class HeroBase {
    public player: Player;
    public health: number;
    public cards: CardCollection;

    constructor(player: Player, cards: CardCollection) {
        this.player = player;
        this.cards = cards;
    }
}