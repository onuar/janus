import BattleField from './battlefield';
import getHeroMock from '../tests/fakes/herobase-fake';
import getBattlefieldMock from '../tests/fakes/battlefield-fake';
import AttackToHeroContext from './attack-to-hero-context';
import HeroBase from './herobase';
import Player from './player';
import Collection from './foundation/generic-collection';
import BasicWarrior from './pawns/basic-warrior';
import { assert } from 'chai';

var hero1: HeroBase = getHeroMock();
var hero2: HeroBase = getHeroMock();
var battlefield: BattleField = new BattleField(hero1, hero2);
battlefield.start();

var hero1Hand = battlefield.getHero1Hand();
var attackerPawn = hero1Hand.GetItem(0);
battlefield.deploy(attackerPawn);
var attack1 = new AttackToHeroContext(attackerPawn);
battlefield.attackToHero(attack1);
battlefield.pass();

var hero2Hand = battlefield.getHero2Hand();
var attackerPawn2 = hero2Hand.GetItem(0);
battlefield.deploy(attackerPawn2);
var attack2 = new AttackToHeroContext(attackerPawn2);
battlefield.attackToHero(attack2);

// assert.equal(battlefield.hero1.health, battlefield.hero2.health);