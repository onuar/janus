import CardBase from './cardbase';

export default abstract class Card extends CardBase {
    public readonly power: number;
    public readonly health: number;

    constructor(power: number, health: number) {
        super();
        this.power = power;
        this.health = health;
    }
}