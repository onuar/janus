import Card from './card';
export default class CardContainer {
    public id: string;
    public card: Card;
    public deployingRound: number;
    public lastAttackRound: number;

    private _health: number;

    constructor(id: string, card: Card) {
        this.id = id;
        this.card = card;
        this.deployingRound = -1;
        this.lastAttackRound = -1;

        this._health = card.health;
    }

    damage(power: number): number {
        this._health -= power;
        return this._health;
    }

    get Health(): number {
        return this._health;
    }
}