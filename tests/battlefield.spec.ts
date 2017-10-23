import { expect, assert } from 'chai';
import BattleField from '../src/battlefield';
import HeroBase from '../src/herobase';
import HeroNullException from '../src/exceptions/hero-null';

describe('Battlefield constructor', () => {

    it('should be two hero', () => {
        var hero1: HeroBase = new HeroBase();
        var hero2: HeroBase = new HeroBase();
        var battlefield: BattleField = new BattleField(hero1, hero2);
        assert.isNotNull(battlefield.hero1);
        assert.isNotNull(battlefield.hero2);
    });
});

describe('Health point', () => {

    it('should be 30 if it is not assigned', () => {
        var hero1: HeroBase = new HeroBase();
        var hero2: HeroBase = new HeroBase();
        var battlefield: BattleField = new BattleField(hero1, hero2);
        assert.equal(battlefield.health, 30);
    });

    it('should be overridable', () => {
        var hero1: HeroBase = new HeroBase();
        var hero2: HeroBase = new HeroBase();
        var battlefield: BattleField = new BattleField(hero1, hero2, 45);
        assert.equal(battlefield.health, 45);
    });

    it('should be above zero', () => {
        var hero1: HeroBase = new HeroBase();
        var hero2: HeroBase = new HeroBase();
        var battlefield: BattleField = new BattleField(hero1, hero2, -1);
        assert.equal(battlefield.health, 30);
    });
});

describe('Battlefield', () => {

    it('should pass health value to hero', () => {
        var hero1: HeroBase = new HeroBase();
        var hero2: HeroBase = new HeroBase();
        var battlefield: BattleField = new BattleField(hero1, hero2, 35);
        assert.equal(battlefield.hero1.health,35);
        assert.equal(battlefield.hero2.health,35);
    });
});