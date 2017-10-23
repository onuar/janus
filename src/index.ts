import BattleField from './battlefield';
import getHeroMock from '../tests/fakes/herobase-fake';
import getBattlefieldMock from '../tests/fakes/battlefield-fake';
import AttackToHeroContext from './attack-to-hero-context';

var battlefield: BattleField = getBattlefieldMock();
var attack1: AttackToHeroContext = new AttackToHeroContext(battlefield.hero1, battlefield.hero2);
battlefield.attackToHero(attack1);