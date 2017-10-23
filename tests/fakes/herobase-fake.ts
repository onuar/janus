import HeroBase from '../../src/herobase';
import Player from '../../src/player';
import Collection from '../../src/foundation/generic-collection';
import CardBase from '../../src/cardbase';

function getHeroMock(): HeroBase {
    let player: Player = new Player();
    let cards: Collection<CardBase> = new Collection<CardBase>();

    for (var i = 0; i < 30; i++) {
        let c: CardBase = new CardBase();
        cards.Add(c);

    }
    return new HeroBase(player, cards);
}

export default getHeroMock;