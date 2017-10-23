import BattleField from '../../src/battlefield';
import HeroBase from '../../src/herobase';
import getHeroMock from './herobase-fake';

function getBattlefieldMock(): BattleField {
    var hero1: HeroBase = getHeroMock();
    var hero2: HeroBase = getHeroMock();
    var battlefield: BattleField = new BattleField(hero1, hero2);
    return battlefield;
}

export default getBattlefieldMock;