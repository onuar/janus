import HeroBase from '../../src/herobase';
import Player from '../../src/player';

function getHeroMock(): HeroBase {
    let player: Player = new Player();
    return new HeroBase(player);
}

export default getHeroMock;