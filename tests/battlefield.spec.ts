import { expect, assert } from 'chai';
import BattleField from '../src/battlefield';
import HeroBase from '../src/herobase';
import Player from '../src/player';
import getHeroMock from './fakes/herobase-fake';
import getBattlefieldMock from './fakes/battlefield-fake';
import AttackToHeroContext from '../src/attack-to-hero-context';
import {
    NotStartedException, InvalidAttackException,
    InsufficientManaException, PawnWaitingException,
    InvalidDeployException, PawnAlreadyAttackedException,
    InvalidStartException
} from '../src/exceptions/';
import CardContainer from '../src/card-container';
import BasicWarrior from '../src/pawns/basic-warrior';
import AttackToPawnContext from '../src/attack-to-pawn-context';
import Card from '../src/card';
import CardCollection from '../src/card-collection';
import PawnFake from './fakes/pawn-fake';
import GameOptions from '../src/game-options';

describe('Battlefield', () => {

    it('should have two heroes', () => {
        var battlefield: BattleField = getBattlefieldMock();
        assert.isNotNull(battlefield.hero1);
        assert.isNotNull(battlefield.hero2);
    });

    it('should pass health point to hero', () => {
        var hero1: HeroBase = getHeroMock();
        var hero2: HeroBase = getHeroMock();
        var options = new GameOptions();
        options.health = 35;
        var battlefield: BattleField = new BattleField(hero1, hero2, options);
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
        var options = new GameOptions();
        options.health = 45;
        var battlefield: BattleField = new BattleField(hero1, hero2, options);
        assert.equal(battlefield.health, 45);
    });

    it('should be above zero', () => {
        var hero1: HeroBase = getHeroMock();
        var hero2: HeroBase = getHeroMock();
        var options = new GameOptions();
        options.health = -1;
        var battlefield: BattleField = new BattleField(hero1, hero2, options);
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
        var pawn = new CardContainer('GUID', new BasicWarrior());
        var attack1: AttackToPawnContext = new AttackToPawnContext(pawn, pawn);
        expect(() => battlefield.attackToPawn(attack1)).to.throw(NotStartedException);
    });

    it('should be called before pass', () => {
        var battlefield: BattleField = getBattlefieldMock();
        expect(() => battlefield.pass()).to.throw(NotStartedException);
    });

    it('should throw InvalidStartException if heroes\' health are not equal', () => {
        var pawn = new BasicWarrior();

        var cards = new CardCollection();
        cards.add(pawn);
        cards.add(pawn);
        var hero1 = new HeroBase(new Player(), cards);

        var cards2 = new CardCollection();
        cards2.add(pawn);
        var hero2 = new HeroBase(new Player(), cards2);

        var options = new GameOptions();
        options.initHandCount = 1;

        var battlefield = new BattleField(hero1, hero2, options);

        expect(() => battlefield.start()).to.throw(InvalidStartException);
    });
});

describe('Battlefield heroes', () => {

    it('should have same health point', () => {
        var hero1: HeroBase = getHeroMock();
        var hero2: HeroBase = getHeroMock();
        var options = new GameOptions();
        options.health = 35;
        var battlefield: BattleField = new BattleField(hero1, hero2, options);
        assert.equal(battlefield.hero1.hero.health, battlefield.hero2.hero.health);
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

    it('should throw InvalidDeployException if card is not in hand', () => {
        var invalidPawn = new CardContainer('INVALID GUID', new BasicWarrior());
        var battlefield = getBattlefieldMock();
        battlefield.start();
        expect(() => battlefield.deploy(invalidPawn)).to.throw(InvalidDeployException);

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
        // var battlefield = getBattlefieldMock();
        // battlefield.start();
        // var hero1Hand = battlefield.getHero1Hand();
        // var pawn1 = hero1Hand.getItem(0);
        // var hero1Current = battlefield.deploy(pawn1);

        // var waitingPawn = hero1Current.CurrentGround.getItem(0);
        // var attack1 = new AttackToHeroContext(waitingPawn);
        // expect(() => battlefield.attackToHero(attack1)).to.throw(PawnWaitingException);
    });

    it('should throw PawnAlreadyAttackedException if pawn is already attacked', () => {
        // var battlefield = getBattlefieldMock();
        // battlefield.start();

        // // hero 1 turn
        // var hero1Hand = battlefield.getHero1Hand();
        // var pawn1 = hero1Hand.getItem(0);
        // var hero1Current = battlefield.deploy(pawn1);
        // battlefield.pass();

        // // hero 2 turn
        // battlefield.pass();

        // // hero 1 turn
        // var pawn1 = hero1Current.CurrentGround.getItem(0);
        // var attack1 = new AttackToHeroContext(pawn1);
        // battlefield.attackToHero(attack1);
        // expect(() => battlefield.attackToHero(attack1)).to.throw(PawnAlreadyAttackedException);
    });

    it('should return a winner if defencer lost', () => {
        var boss = new PawnFake(30, 1, 1);

        var cards = new CardCollection();
        cards.add(boss);
        var hero1 = new HeroBase(new Player(), cards);

        var cards2 = new CardCollection();
        cards2.add(boss);
        var hero2 = new HeroBase(new Player(), cards2);

        var options = new GameOptions();
        options.health = 30;
        options.initHandCount = 1;

        var battlefield = new BattleField(hero1, hero2, options);
        battlefield.start();

        // hero 1 turn
        var hero1Hand = battlefield.getHero1Hand();
        var attackerPawn = hero1Hand.getItem(0);
        var current = battlefield.deploy(attackerPawn);
        battlefield.pass();

        // hero 2 turn
        battlefield.pass();

        // hero 1 turn
        var attack1 = new AttackToHeroContext(current.CurrentGround.getItem(0));
        var result = battlefield.attackToHero(attack1);
        assert.isNotNull(result.Winner);
    });
});

describe('Battlefield attackToPawn', () => {

    it('should reduce opponent pawn\'s health', () => {

        var destroyer = new PawnFake(1, 1, 1);
        var tank = new PawnFake(1, 3, 1);

        var cards = new CardCollection();
        cards.add(destroyer);
        var hero1 = new HeroBase(new Player(), cards);

        var cards2 = new CardCollection();
        cards2.add(tank);
        var hero2 = new HeroBase(new Player(), cards2);

        var options = new GameOptions();
        options.initHandCount = 1;

        var battlefield = new BattleField(hero1, hero2, options);
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
        var attacker = hero1Current.CurrentGround.getItem(0);
        var defencer = hero2Current.CurrentGround.getItem(0);
        var attack = new AttackToPawnContext(attacker, defencer);
        var result = battlefield.attackToPawn(attack);
        assert.equal(result.dead, false);
        assert.equal(result.defencerGround.getItem(0).Health, 2);
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

    it('should throw PawnAlreadyAttackedException if pawn is already attacked', () => {
        var battlefield = getBattlefieldMock();
        battlefield.start();

        // hero 1 turn
        var hero1Hand = battlefield.getHero1Hand();
        var pawn1 = hero1Hand.getItem(0);
        var hero1Current = battlefield.deploy(pawn1);
        battlefield.pass();

        // hero 2 turn
        battlefield.pass();

        // hero 1 turn
        var pawn1 = hero1Current.CurrentGround.getItem(0);
        var attack1 = new AttackToHeroContext(pawn1);
        battlefield.attackToHero(attack1);
        expect(() => battlefield.attackToHero(attack1)).to.throw(PawnAlreadyAttackedException);
    });

    it('should remove dead card from ground', () => {

        var destroyer = new PawnFake(1, 1, 1);
        var tank = new PawnFake(1, 1, 1);

        var cards = new CardCollection();
        cards.add(destroyer);
        var hero1 = new HeroBase(new Player(), cards);

        var cards2 = new CardCollection();
        cards2.add(tank);
        var hero2 = new HeroBase(new Player(), cards2);

        var options = new GameOptions();
        options.initHandCount = 1;

        var battlefield = new BattleField(hero1, hero2, options);
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
        var attacker = hero1Current.CurrentGround.getItem(0);
        var defencer = hero2Current.CurrentGround.getItem(0);
        var attack = new AttackToPawnContext(attacker, defencer);
        var result = battlefield.attackToPawn(attack);
        assert.equal(result.dead, true);
        assert.equal(result.defencerGround.count(), 0);
    });
});

describe('Battlefield give-up', () => {

    it('should return defencer as a winner', () => {
        var battlefield = getBattlefieldMock();
        battlefield.start();
        battlefield.giveUp();
        assert.equal(battlefield.Winner, battlefield.hero2.hero);
    });
});