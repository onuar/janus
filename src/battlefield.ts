import HeroBase from './herobase';
import HeroNullException from './exceptions/hero-null';
import AttackToHeroContext from './attack-to-hero-context';
import AttackToPawnContext from './attack-to-pawn-context';
import InvalidAttackerException from './exceptions/invalid-attacker';

export default class BattleField {
    public hero1: HeroBase;
    public hero2: HeroBase;
    public health: number;
    private _turn: HeroBase;

    get turn(): HeroBase {
        return this._turn;
    }

    constructor(hero1: HeroBase, hero2: HeroBase, health?: number) {
        if (hero1 == null || hero2 == null) {
            throw new HeroNullException();
        }

        this.health = (health == null || health < 0 ? 30 : health);
        this.hero1 = hero1;
        this.hero2 = hero2;
        this.hero1.health = this.health;
        this.hero2.health = this.health;

        this._turn = this.hero1;
    }

    attackToHero(context: AttackToHeroContext): boolean {
        if (context.whoAttacks != this._turn) {
            throw new InvalidAttackerException(`Turn owner: ${this._turn}`);
        }


        this._turn = context.whoGotAttacked;
        return true;
    }

    attackToPawn(context: AttackToPawnContext): boolean {

        return true;
    }
}