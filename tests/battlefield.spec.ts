import { expect, assert } from 'chai';
import BattleField from '../src/battlefield';
import HeroBase from '../src/herobase';
import Player from '../src/player';
import getHeroMock from './fakes/herobase-fake';
import getBattlefieldMock from './fakes/battlefield-fake';
import AttackToHeroContext from '../src/attack-to-hero-context';
import {
    NotStartedException, InvalidAttackException,
    InsufficientManaException, PawnWaitingException
} from '../src/exceptions/';
import CardContainer from '../src/card-container';
import BasicWarrior from '../src/pawns/basic-warrior';
import AttackToPawnContext from '../src/attack-to-pawn-context';

describe('Battlefield', () => {

    it('should have two hero', () => {
        var battlefield: BattleField = getBattlefieldMock();
        assert.isNotNull(battlefield.hero1);
        assert.isNotNull(battlefield.hero2);
    });

    it('should pass health point to hero', () => {
        var hero1: HeroBase = getHeroMock();
        var hero2: HeroBase = getHeroMock();
        var battlefield: BattleField = new BattleField(hero1, hero2, 35);
        battlefield.start();
        assert.equal(battlefield.hero1.hero.health, 35);
        assert.equal(battlefield.hero2.hero.health, 35);
    });

    it('should not allow hero-2 to start at the beginning', () => {
        var battlefield: BattleField = getBattlefieldMock();
        battlefield.start();
        var hero2Hand = battlefield.getHero2Hand();
        var attack1: AttackToHeroContext = new AttackToHeroContext(hero2Hand.getItem(0));
        expect(() => battlefield.attackToHero(attack1)).to.throw(InvalidAttackException);
    });

    it('should allow hero-2 to play after hero-1 attacked', () => {
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
        assert.equal(attackResult.OpponentHealth, 29);
    });
});

describe('Battlefield health point', () => {

    it('should be 30 by default', () => {
        var battlefield: BattleField = getBattlefieldMock();
        assert.equal(battlefield.health, 30);
    });

    it('should be overridable', () => {
        var hero1: HeroBase = getHeroMock();
        var hero2: HeroBase = getHeroMock();
        var battlefield: BattleField = new BattleField(hero1, hero2, 45);
        assert.equal(battlefield.health, 45);
    });

    it('should be above zero', () => {
        var hero1: HeroBase = getHeroMock();
        var hero2: HeroBase = getHeroMock();
        var battlefield: BattleField = new BattleField(hero1, hero2, -1);
        assert.equal(battlefield.health, 30);
    });
});

describe('Battlefield start', () => {

    it('should be called before getHero1Hand', () => {
        var battlefield: BattleField = getBattlefieldMock();
        expect(() => battlefield.getHero1Hand()).to.throw(NotStartedException);
    });

    it('should be called before getHero2Hand', () => {
        var battlefield: BattleField = getBattlefieldMock();
        expect(() => battlefield.getHero2Hand()).to.throw(NotStartedException);
    });

    it('should be called before deploy', () => {
        var battlefield: BattleField = getBattlefieldMock();
        var pawn = new CardContainer('GUID', new BasicWarrior());
        expect(() => battlefield.deploy(pawn)).to.throw(NotStartedException);
    });

    it('should be called before attackToHero', () => {
        var battlefield: BattleField = getBattlefieldMock();
        var attack1: AttackToHeroContext = new AttackToHeroContext(new CardContainer("GUID", new BasicWarrior()));
        expect(() => battlefield.attackToHero(attack1)).to.throw(NotStartedException);
    });

    it('should be called before attackToPawn', () => {
        var battlefield: BattleField = getBattlefieldMock();
        var attack1: AttackToPawnContext = new AttackToPawnContext();
        expect(() => battlefield.attackToPawn(attack1)).to.throw(NotStartedException);
    });

    it('should be called before pass', () => {
        var battlefield: BattleField = getBattlefieldMock();
        var attack1: AttackToPawnContext = new AttackToPawnContext();
        expect(() => battlefield.pass()).to.throw(NotStartedException);
    });
});

describe('Battlefield heroes', () => {

    it('should have same health point', () => {
        var hero1: HeroBase = getHeroMock();
        var hero2: HeroBase = getHeroMock();
        var battlefield: BattleField = new BattleField(hero1, hero2, 35);
        assert.equal(battlefield.hero1.hero.health, battlefield.hero2.hero.health);
    });
});

describe('Battlefield attackToHero', () => {

    it('should reduce opponent s health', () => {
        // attack from hero1 to hero2
        var hero1: HeroBase = getHeroMock();
        var hero2: HeroBase = getHeroMock();
        var battlefield: BattleField = new BattleField(hero1, hero2);
        battlefield.start();

        // hero 1 turn
        var hero1Hand = battlefield.getHero1Hand();
        var pawn1 = hero1Hand.getItem(0);
        var hero1Current = battlefield.deploy(pawn1);
        battlefield.pass();

        // hero 2 turn
        battlefield.pass();

        // hero 1 turn
        var attacker1 = hero1Current.CurrentGround.getItem(0);
        var attack1: AttackToHeroContext = new AttackToHeroContext(attacker1);
        battlefield.attackToHero(attack1);

        assert.equal(battlefield.hero2.health, battlefield.hero2.hero.health - attacker1.card.power);
    });

    it('should throw PawnWaitingException if played card is waiting', () => {
        var battlefield = getBattlefieldMock();
        battlefield.start();
        var hero1Hand = battlefield.getHero1Hand();
        var pawn1 = hero1Hand.getItem(0);
        var hero1Current = battlefield.deploy(pawn1);

        var waitingPawn = hero1Current.CurrentGround.getItem(0);
        var attack1 = new AttackToHeroContext(waitingPawn);
        expect(() => battlefield.attackToHero(attack1)).to.throw(PawnWaitingException);
    });
});

describe('Battlefield deploy', () => {

    it('should throw InsufficientManaException if remaining mana is not enough', () => {
        var battlefield: BattleField = getBattlefieldMock();
        battlefield.start();
        var hero1Hand = battlefield.getHero1Hand();
        var attackerPawn = hero1Hand.getItem(0);
        battlefield.deploy(attackerPawn);
        battlefield.pass();//hero 1 to hero 2
        battlefield.pass();//hero 2 to hero 1
        var hero1Hand = battlefield.getHero1Hand();
        attackerPawn = hero1Hand.getItem(0);
        var current = battlefield.deploy(attackerPawn);
        attackerPawn = current.CurrentHand.getItem(0);
        current = battlefield.deploy(attackerPawn);
        assert.equal(current.CurrentGround.count(), 3);
        assert.equal(current.CurrentHand.count(), 2);
        attackerPawn = current.CurrentHand.getItem(0);
        expect(() => battlefield.deploy(attackerPawn)).to.throw(InsufficientManaException);
    });

    it('should return a valid Current Hand', () => {
        var battlefield: BattleField = getBattlefieldMock();
        battlefield.start();
        var hero1Hand = battlefield.getHero1Hand();
        var attackerPawn = hero1Hand.getItem(0);
        battlefield.deploy(attackerPawn);
        battlefield.pass();//hero 1 to hero 2
        battlefield.pass();//hero 2 to hero 1
        var hero1Hand = battlefield.getHero1Hand();
        attackerPawn = hero1Hand.getItem(0);
        var current = battlefield.deploy(attackerPawn);
        attackerPawn = current.CurrentHand.getItem(0);
        current = battlefield.deploy(attackerPawn);
        assert.equal(current.CurrentHand.count(), 2);
    });

    it('should return a valid Current Ground', () => {
        var battlefield: BattleField = getBattlefieldMock();
        battlefield.start();
        var hero1Hand = battlefield.getHero1Hand();
        var attackerPawn = hero1Hand.getItem(0);
        battlefield.deploy(attackerPawn);
        battlefield.pass();//hero 1 to hero 2
        battlefield.pass();//hero 2 to hero 1
        var hero1Hand = battlefield.getHero1Hand();
        attackerPawn = hero1Hand.getItem(0);
        var current = battlefield.deploy(attackerPawn);
        attackerPawn = current.CurrentHand.getItem(0);
        current = battlefield.deploy(attackerPawn);
        assert.equal(current.CurrentGround.count(), 3);
    });

    it('should deploy waiting pawn after pawn is deployed', () => {
        var battlefield = getBattlefieldMock();
        battlefield.start();
        var hero1Hand = battlefield.getHero1Hand();
        var pawn1 = hero1Hand.getItem(0);
        var hero1Current = battlefield.deploy(pawn1);

        var waitingPawn = hero1Current.CurrentGround.getItem(0);
        assert.equal(waitingPawn.deployingRound, 1);
    });
});

describe('Battlefield mana', () => {

    it('should increase after every each player played', () => {
        var battlefield: BattleField = getBattlefieldMock();
        battlefield.start();
        var firstRound = battlefield.manaRound();
        assert.equal(firstRound, 1);
        battlefield.pass(); // hero 1 to hero 2
        battlefield.pass(); // hero 2 to hero 1
        var secondRound = battlefield.manaRound();
        assert.equal(secondRound, 2);
        battlefield.pass(); // hero 1 to hero 2
        battlefield.pass(); // hero 2 to hero 1
        var thirdRound = battlefield.manaRound();
        assert.equal(thirdRound, 3);
    });

    it('should be max 10', () => {
        var battlefield: BattleField = getBattlefieldMock();
        battlefield.start();
        var roundCounter = 1;
        for (var index = 0; index < 20; index++) {
            battlefield.pass();
        }
        assert.equal(battlefield.manaRound(), 10);
        battlefield.pass();
        battlefield.pass();
        assert.equal(battlefield.manaRound(), 10);
    });
});

