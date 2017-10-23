import BattleField from './battlefield';
import getHeroMock from '../tests/fakes/herobase-fake';


let hero1 = getHeroMock();
let hero2 = getHeroMock();
let battleField = new BattleField(hero1, hero2);