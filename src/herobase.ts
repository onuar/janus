import Player from './player';
import Collection from './foundation/generic-collection';
import CardBase from './cardbase';

export default class HeroBase {
    public player: Player;
    public health: number;
    public cards: Collection<CardBase>;

    constructor(player: Player, cards: Collection<CardBase>) {
        this.player = player;
        this.cards = cards;
    }
}