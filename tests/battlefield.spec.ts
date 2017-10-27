import { expect, assert } from 'chai';
import BattleField from '../src/battlefield';
import HeroBase from '../src/herobase';
import Player from '../src/player';
import getHeroMock from './fakes/herobase-fake';
import getBattlefieldMock from './fakes/battlefield-fake';
import AttackToHeroContext from '../src/attack-to-hero-context';
import { NotStartedException, InvalidAttackException, InsufficientManaException } from '../src/exceptions/';
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
        var attack1: AttackToHeroContext = new AttackToHeroContext(hero2Hand.GetItem(0));
        expect(() => battlefield.attackToHero(attack1)).to.throw(InvalidAttackException);
    });

    it('should allow hero-2 to play after hero-1 attacked', () => {
        var battlefield: BattleField = getBattlefieldMock();
        battlefield.start();

        var hero1Hand = battlefield.getHero1Hand();
        var pawn1 = hero1Hand.GetItem(0);
        var attack1: AttackToHeroContext = new AttackToHeroContext(pawn1);
        battlefield.deploy(pawn1);
        battlefield.attackToHero(attack1);
        battlefield.pass();

        var hero2Hand = battlefield.getHero2Hand();
        var pawn2 = hero2Hand.GetItem(0);
        battlefield.deploy(pawn2);
        var attack2: AttackToHeroContext = new AttackToHeroContext(pawn2);
        assert.equal(battlefield.attackToHero(attack2), true);
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
        var hero1Hand = battlefield.getHero1Hand();
        var attackerPawn = hero1Hand.GetItem(0);
        battlefield.deploy(attackerPawn);
        var attack1 = new AttackToHeroContext(attackerPawn);
        battlefield.attackToHero(attack1);
        assert.equal(battlefield.hero2.health, battlefield.hero2.hero.health - attackerPawn.card.power);
    });
});

describe('Battlefield deploy', () => {

    it('should throw InsufficientManaException if remaining mana is not enough', () => {
        var battlefield: BattleField = getBattlefieldMock();
        battlefield.start();
        var hero1Hand = battlefield.getHero1Hand();
        var attackerPawn = hero1Hand.GetItem(0);
        battlefield.deploy(attackerPawn);
        battlefield.pass();//hero 1 to hero 2
        battlefield.pass();//hero 2 to hero 1
        var hero1Hand = battlefield.getHero1Hand();
        attackerPawn = hero1Hand.GetItem(0);
        var current = battlefield.deploy(attackerPawn);
        attackerPawn = current.CurrentHand.GetItem(0);
        current = battlefield.deploy(attackerPawn);
        assert.equal(current.CurrentGround.Count(), 3);
        assert.equal(current.CurrentHand.Count(), 2);
        attackerPawn = current.CurrentHand.GetItem(0);
        expect(() => battlefield.deploy(attackerPawn)).to.throw(InsufficientManaException);
    });

    it('should return a valid Current Hand', () => {
        var battlefield: BattleField = getBattlefieldMock();
        battlefield.start();
        var hero1Hand = battlefield.getHero1Hand();
        var attackerPawn = hero1Hand.GetItem(0);
        battlefield.deploy(attackerPawn);
        battlefield.pass();//hero 1 to hero 2
        battlefield.pass();//hero 2 to hero 1
        var hero1Hand = battlefield.getHero1Hand();
        attackerPawn = hero1Hand.GetItem(0);
        var current = battlefield.deploy(attackerPawn);
        attackerPawn = current.CurrentHand.GetItem(0);
        current = battlefield.deploy(attackerPawn);
        assert.equal(current.CurrentHand.Count(), 2);
    });

    it('should return a valid Current Ground', () => {
        var battlefield: BattleField = getBattlefieldMock();
        battlefield.start();
        var hero1Hand = battlefield.getHero1Hand();
        var attackerPawn = hero1Hand.GetItem(0);
        battlefield.deploy(attackerPawn);
        battlefield.pass();//hero 1 to hero 2
        battlefield.pass();//hero 2 to hero 1
        var hero1Hand = battlefield.getHero1Hand();
        attackerPawn = hero1Hand.GetItem(0);
        var current = battlefield.deploy(attackerPawn);
        attackerPawn = current.CurrentHand.GetItem(0);
        current = battlefield.deploy(attackerPawn);
        assert.equal(current.CurrentGround.Count(), 3);
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
});

