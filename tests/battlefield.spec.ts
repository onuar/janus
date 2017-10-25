import { expect, assert } from 'chai';
import BattleField from '../src/battlefield';
import HeroBase from '../src/herobase';
import Player from '../src/player';
import getHeroMock from './fakes/herobase-fake';
import getBattlefieldMock from './fakes/battlefield-fake';
import AttackToHeroContext from '../src/attack-to-hero-context';
import { InvalidAttackerException, NotStartedException } from '../src/exceptions/';

describe('Battlefield constructor', () => {

    it('should be two hero', () => {

        var battlefield: BattleField = getBattlefieldMock();
        assert.isNotNull(battlefield.hero1);
        assert.isNotNull(battlefield.hero2);
    });
});

describe('Health point', () => {

    it('should be 30 if it is not assigned', () => {
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

describe('Battlefield', () => {
    it('should be started at least once before attack', () => {
        var battlefield: BattleField = getBattlefieldMock();
        var attack1: AttackToHeroContext = new AttackToHeroContext(battlefield.hero2.hero, battlefield.hero1.hero);
        expect(() => battlefield.attackToHero(attack1)).to.throw(NotStartedException);
    });

    it('should pass health point to hero', () => {
        var hero1: HeroBase = getHeroMock();
        var hero2: HeroBase = getHeroMock();
        var battlefield: BattleField = new BattleField(hero1, hero2, 35);
        battlefield.start();
        assert.equal(battlefield.hero1.hero.health, 35);
        assert.equal(battlefield.hero2.hero.health, 35);
    });

    it('should allow hero-1 to start at the beginning', () => {
        var battlefield: BattleField = getBattlefieldMock();
        battlefield.start();
        var attack1: AttackToHeroContext = new AttackToHeroContext(battlefield.hero2.hero, battlefield.hero1.hero);
        expect(() => battlefield.attackToHero(attack1)).to.throw(InvalidAttackerException);
    });

    it('should allow hero-2 to play after hero-1 attacked', () => {
        var battlefield: BattleField = getBattlefieldMock();
        battlefield.start();
        var attack1: AttackToHeroContext = new AttackToHeroContext(battlefield.hero1.hero, battlefield.hero2.hero);
        battlefield.attackToHero(attack1);
        var attack2: AttackToHeroContext = new AttackToHeroContext(battlefield.hero2.hero, battlefield.hero1.hero);
        assert.equal(battlefield.attackToHero(attack2), true);
    });
});

describe('Battlefield heroes', () => {

    it('should have same health point', () => {
        var hero1: HeroBase = getHeroMock();
        var hero2: HeroBase = getHeroMock();
        var battlefield: BattleField = new BattleField(hero1, hero2, 35);
        assert.equal(battlefield.hero1.hero.health, battlefield.hero2.hero.health);
    });

    it('should attack eachothers', () => {
        var battlefield: BattleField = getBattlefieldMock();

    });
});
