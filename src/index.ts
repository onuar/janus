import BattleField from './battlefield';
import getHeroMock from '../tests/fakes/herobase-fake';
import getBattlefieldMock from '../tests/fakes/battlefield-fake';
import AttackToHeroContext from './attack-to-hero-context';
import HeroBase from './herobase';
import Player from './player';
import Collection from './foundation/generic-collection';
import BasicWarrior from './pawns/basic-warrior';
import { assert } from 'chai';

const test1 = () => {
    var battlefield: BattleField = getBattlefieldMock();
    battlefield.start();

    // hero 1 turn
    var hero1Hand = battlefield.getHero1Hand();
    var pawn1 = hero1Hand.getItem(0);
    var hero1Current = battlefield.deploy(pawn1);
    battlefield.pass();

    // hero 2 turn
    var hero2Hand = battlefield.getHero2Hand();
    var pawn2 = hero2Hand.getItem(0);
    var hero2Current = battlefield.deploy(pawn2);
    battlefield.pass();

    // hero 1 turn
    var attacker1 = hero1Current.CurrentGround.getItem(0);
    var attack1: AttackToHeroContext = new AttackToHeroContext(attacker1);
    battlefield.attackToHero(attack1);
    battlefield.pass();

    //her 2 turn
    var attacker2 = hero2Current.CurrentGround.getItem(0);
    var attack2: AttackToHeroContext = new AttackToHeroContext(attacker2);
    var attackResult = battlefield.attackToHero(attack2);

}
const test2 = () => {
    var battlefield: BattleField = getBattlefieldMock();
    battlefield.start();
    var hero1Hand = battlefield.getHero1Hand();
    var attackerPawn = hero1Hand.getItem(0);
    battlefield.deploy(attackerPawn);
    battlefield.pass();
};

test1();
// assert.equal(battlefield.hero1.health, battlefield.hero2.health);