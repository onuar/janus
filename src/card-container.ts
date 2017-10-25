import Card from './card';
export default class CardContainer {
    public id: string;
    public card: Card;

    constructor(id: string, card: Card) {
        this.id = id;
        this.card = card;
    }
}