import Collection from './foundation/generic-collection';
import Card from './card';
import { InvalidManaException } from './exceptions/invalid-mana';

export default class CardCollection extends Collection<Card>{
    add(item: Card) {
        if (item.mana < 0 || item.mana > 10) {
            throw new InvalidManaException(`${item.mana}`);
        }
        super.add(item);
    }
}