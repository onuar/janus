import { expect, assert } from 'chai';
import CardCollection from '../src/card-collection';
import Card from '../src/card';
import { InvalidManaException } from '../src/exceptions/invalid-mana';

describe('CardCollection', () => {

    it('should have max 10 mana', () => {
        var cards = new CardCollection();
        var elevenMana = new InvalidManaPawn();
        expect(() => cards.add(elevenMana)).to.throw(InvalidManaException);
    });
});

class InvalidManaPawn extends Card {
    constructor() {
        super(2, 2, 11);
    }
}