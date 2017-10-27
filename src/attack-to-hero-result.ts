export default class AttackToHeroResult {
    private readonly _opponentHealth: number;

    constructor(opponentHealth: number) {
        this._opponentHealth = opponentHealth;
    }

    get OpponentHealth(): number {
        return this._opponentHealth;
    }
}