import { expect, assert } from 'chai';
import HeroContainer from '../src/hero-container';
import HeroBase from '../src/herobase';
import getHeroMock from './fakes/herobase-fake';
import {
    HeroContainerNotPreparedException, InsufficientPawnException
} from '../src/exceptions';

describe('Hero Container', () => {

    it('should have cardcontainers with different ids', () => {
        // todo: needs performance improvement. for HeroContainer.deck, maybe dictionary should be considered.
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

    it('should throw InsufficientPawnException if card count is less than initHandCount', () => {
        var hero = getHeroMock();
        var heroContainer = new HeroContainer(hero, 31);
        expect(() => heroContainer.prepare()).to.throw(InsufficientPawnException);

    });
});