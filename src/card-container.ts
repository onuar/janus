import Card from './card';
export default class CardContainer {
    public id: string;
    public card: Card;
    public deployingRound: number;

    constructor(id: string, card: Card) {
        this.id = id;
        this.card = card;
        this.deployingRound = -1;
    }
}