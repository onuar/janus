import HeroBase from '../../src/herobase';
import Player from '../../src/player';
import Collection from '../../src/foundation/generic-collection';
import Card from '../../src/card';
import BasicWarrior from '../../src/pawns/basic-warrior';
import CardCollection from '../../src/card-collection';

function getHeroMock(): HeroBase {
    let player: Player = new Player();
    let cards = new CardCollection();

    for (var i = 0; i < 30; i++) {
        let c: Card = new BasicWarrior();
        cards.add(c);

    }
    return new HeroBase(player, cards);
}

export default getHeroMock;