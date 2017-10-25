import HeroBase from '../../src/herobase';
import Player from '../../src/player';
import Collection from '../../src/foundation/generic-collection';
import Card from '../../src/card';
import BasicWarrior from '../../src/pawns/basic-warrior';

function getHeroMock(): HeroBase {
    let player: Player = new Player();
    let cards: Collection<Card> = new Collection<Card>();

    for (var i = 0; i < 30; i++) {
        let c: Card = new BasicWarrior();
        cards.Add(c);

    }
    return new HeroBase(player, cards);
}

export default getHeroMock;