import Collection from './foundation/generic-collection';
import Card from './card';
import { InvalidManaException } from './exceptions/invalid-mana';
import CardContainer from './card-container';

export default class CardContainerCollection extends Collection<CardContainer>{
    getItemById(id: string): CardContainer | undefined {
        for (var index = 0; index < this.count(); index++) {
            var element = this.getItem(index);
            if (element.id == id) {
                return element;
            }
        }

        return undefined;
    }

    indexOfId(id: string): number {
        for (var index = 0; index < this.count(); index++) {
            var element = this.getItem(index);
            if (element.id == id) {
                return index;
            }
        }

        return -1;
    }
}