import HeroBase from './herobase';
export default class AttackToHeroResult {
    private readonly _opponentHealth: number;
    private _winner: HeroBase;

    constructor(opponentHealth: number) {
        this._opponentHealth = opponentHealth;
    }

    get OpponentHealth(): number {
        return this._opponentHealth;
    }

    get Winner(): HeroBase {
        return this._winner;
    }

    setWinner(hero: HeroBase): void {
        this._winner = hero;
    }
}