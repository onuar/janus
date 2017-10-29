import { expect, assert } from 'chai';
import CardCollection from '../src/card-collection';
import Card from '../src/card';
import { InvalidManaException } from '../src/exceptions/invalid-mana';
import PawnFake from './fakes/pawn-fake';

describe('CardCollection', () => {

    it('should have max 10 mana', () => {
        var cards = new CardCollection();
        var elevenMana = new PawnFake(2, 2, 11);
        expect(() => cards.add(elevenMana)).to.throw(InvalidManaException);
    });
});