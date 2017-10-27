import CardBase from './cardbase';

export default abstract class Card extends CardBase {
    public readonly power: number;
    public readonly health: number;
    public readonly mana: number;

    constructor(power: number, health: number, mana: number) {
        super();
        this.power = power;
        this.health = health;
        this.mana = mana;
    }
}