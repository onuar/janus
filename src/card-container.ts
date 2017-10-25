import Card from './card';
export default class CardContainer {
    public id: number;
    public card: Card;

    constructor(id: number, card: Card) {
        this.id = id;
        this.card = card;
    }
}