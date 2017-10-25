import BattleField from './battlefield';
import getHeroMock from '../tests/fakes/herobase-fake';
import getBattlefieldMock from '../tests/fakes/battlefield-fake';
import AttackToHeroContext from './attack-to-hero-context';
import HeroBase from './herobase';
import Player from './player';
import Collection from './foundation/generic-collection';
import BasicWarrior from './Pawns/basic-warrior';

var battlefield: BattleField = getBattlefieldMock();
var attack1: AttackToHeroContext = new AttackToHeroContext(battlefield.hero1.hero, battlefield.hero2.hero);
battlefield.start();
battlefield.attackToHero(attack1);
var attack2: AttackToHeroContext = new AttackToHeroContext(battlefield.hero2.hero, battlefield.hero1.hero);
battlefield.attackToHero(attack2);