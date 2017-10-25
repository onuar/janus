import { expect, assert } from 'chai';
import HeroContainer from '../src/hero-container';
import HeroBase from '../src/herobase';
import getHeroMock from './fakes/herobase-fake';

describe('hero-container', () => {
    it('should have cardcontainers with different ids', () => {
        // todo: needs performance improvement. for HeroContainer.deck, maybe dictionary should be considered.
        var hero = getHeroMock();
        var heroContainer = new HeroContainer(hero);
        heroContainer.prepare();

        for (var i = 0; i < heroContainer.deck.Count(); i++) {
            var parent = heroContainer.deck.GetItem(i);
            var count: number = 0;
            for (var k = 0; k < heroContainer.deck.Count(); k++) {
                var inner = heroContainer.deck.GetItem(k);
                if (parent.id == inner.id) {
                    count++;
                }
            }

            assert.equal(count, 1);
        }
    });
});