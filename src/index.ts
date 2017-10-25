import BattleField from './battlefield';
import getHeroMock from '../tests/fakes/herobase-fake';
import getBattlefieldMock from '../tests/fakes/battlefield-fake';
import AttackToHeroContext from './attack-to-hero-context';
import HeroBase from './herobase';
import Player from './player';
import Collection from './foundation/generic-collection';
import BasicWarrior from './Pawns/basic-warrior';

var battlefield: BattleField = getBattlefieldMock();
battlefield.start();

var initHero1Hand = battlefield.getHero1Hand();
var attack1: AttackToHeroContext = new AttackToHeroContext(initHero1Hand.GetItem(0));
battlefield.attackToHero(attack1);

var hero2Hand = battlefield.getHero2Hand();
var attack2: AttackToHeroContext = new AttackToHeroContext(hero2Hand.GetItem(0));
battlefield.attackToHero(attack2);
