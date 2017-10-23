import BattleField from './battlefield';
import getHeroMock from '../tests/fakes/herobase-fake';

// export const hello = () => 'Hello world!';

let hero1 = getHeroMock();
let hero2 = getHeroMock();
let battleField = new BattleField(hero1, hero2);