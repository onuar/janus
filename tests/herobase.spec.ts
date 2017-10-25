import { expect, assert } from 'chai';
import BattleField from '../src/battlefield';
import HeroBase from '../src/herobase';
import Player from '../src/player';
import getHeroMock from './fakes/herobase-fake';
import getBattlefieldMock from './fakes/battlefield-fake';

describe('Hero', () => {

    it('should have a player', () => {
        let hero: HeroBase = getHeroMock();
        assert.isNotNull(hero.player);
    });

    it('should have 30 card at the beginning', () => {
        let battlefield: BattleField = getBattlefieldMock();
        assert.equal(battlefield.hero1.hero.cards.Count(), 30);
    });
});