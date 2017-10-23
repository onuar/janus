import { expect, assert } from 'chai';
import HeroBase from '../src/herobase';
import Player from '../src/player';
import getHeroMock from './fakes/herobase-fake';

describe('Hero', () => {

    it('should have a player', () => {
        let hero: HeroBase = getHeroMock();
        assert.isNotNull(hero.player);
    });
});

