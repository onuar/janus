import { expect, assert } from 'chai';
import HeroContainer from '../src/hero-container';
import HeroBase from '../src/herobase';
import getHeroMock from './fakes/herobase-fake';
import {
    HeroContainerNotPreparedException, InsufficientPawnException
} from '../src/exceptions';
import CardContainer from '../src/card-container';
import PawnFake from './fakes/pawn-fake';
import Player from '../src/player';
import CardCollection from '../src/card-collection';
import Card from '../src/card';
import BasicWarrior from '../src/pawns/basic-warrior';

describe('Hero Container', () => {

    it('should have cardcontainers with different ids', () => {
        // needs performance improvement. for HeroContainer.deck, maybe dictionary should be considered.
        var hero = getHeroMock();
        var heroContainer = new HeroContainer(hero);
        heroContainer.prepare();

        for (var i = 0; i < heroContainer.deck.count(); i++) {
            var parent = heroContainer.deck.getItem(i);
            var count: number = 0;
            for (var k = 0; k < heroContainer.deck.count(); k++) {
                var inner = heroContainer.deck.getItem(k);
                if (parent.id == inner.id) {
                    count++;
                }
            }

            assert.equal(count, 1);
        }
    });
});

describe('Hero Container prepare', () => {

    it('should be called before deadCheck', () => {
        var hero = getHeroMock();
        var heroContainer = new HeroContainer(hero);
        expect(() => heroContainer.deadCheck()).to.throw(HeroContainerNotPreparedException);
    });

    it('should be called before validGroundCardCheckForAttack', () => {
        var hero = getHeroMock();
        var heroContainer = new HeroContainer(hero);
        expect(() => heroContainer.validGroundCardCheckForAttack('GUID', 1)).to.throw(HeroContainerNotPreparedException);
    });

    it('should be called before validGroundCardCheckForDefence', () => {
        var hero = getHeroMock();
        var heroContainer = new HeroContainer(hero);
        expect(() => heroContainer.validGroundCardCheckForDefence('GUID')).to.throw(HeroContainerNotPreparedException);
    });

    it('should throw InsufficientPawnException if card count is less than initHandCount', () => {
        var hero = getHeroMock();
        var heroContainer = new HeroContainer(hero, 31);
        expect(() => heroContainer.prepare()).to.throw(InsufficientPawnException);
    });
});

describe('Hero Container damageToPawn', () => {

    it('should reduce pawn\'s health', () => {
        // prepare
        var tank = new PawnFake(9, 9, 9);
        var cardCollection = new CardCollection();
        cardCollection.add(tank);
        var hero = new HeroBase(new Player(), cardCollection);
        var heroContainer = new HeroContainer(hero, 1);
        heroContainer.prepare();

        // deploy
        var pawn = heroContainer.hand.getItem(0);
        heroContainer.deploy(pawn, 10, 1);
        var tankContainer = heroContainer.ground.getItem(0);

        // attack
        var damager = new BasicWarrior();
        var damagerContainer = new CardContainer('GUID', damager);
        heroContainer.damageToPawn(damagerContainer, tankContainer);
        assert.equal(tankContainer.Health, 8);
    });

    it('should remove the pawn from ground when the pawn is dead', () => {
        // prepare
        var hero = getHeroMock();
        var heroContainer = new HeroContainer(hero);
        heroContainer.prepare();

        // deploy
        var pawn = heroContainer.hand.getItem(0);
        heroContainer.deploy(pawn, 10, 1);
        var defencerContainer = heroContainer.ground.getItem(0);

        // attack
        var damager = new BasicWarrior();
        var damagerContainer = new CardContainer('GUID', damager);
        assert.equal(heroContainer.ground.count(), 1);
        heroContainer.damageToPawn(damagerContainer, defencerContainer);
        assert.equal(heroContainer.dead.count(), 1);
        assert.equal(heroContainer.ground.count(), 0);
    });
});

describe('Hero Container damage', () => {

    it('should reduce hero\'s health', () => {
        // prepare
        var hero = getHeroMock();
        var heroContainer = new HeroContainer(hero);
        heroContainer.prepare();

        // attack
        var tank = new PawnFake(9, 9, 9);
        var tankContainer = new CardContainer('GUID', tank);
        heroContainer.damage(tankContainer);
        assert.equal(heroContainer.health, hero.health - tank.power);
    });
});