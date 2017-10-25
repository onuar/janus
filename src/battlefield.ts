import HeroBase from './herobase';
import AttackToHeroContext from './attack-to-hero-context';
import AttackToPawnContext from './attack-to-pawn-context';
import { HeroNullException, NotStartedException, InvalidAttackException } from "./exceptions";;
import HeroContainer from './hero-container';
import Collection from './foundation/generic-collection';
import CardContainer from './card-container';


export default class BattleField {
    public hero1: HeroContainer;
    public hero2: HeroContainer;
    public health: number;
    private _turn: HeroContainer;
    private _started: boolean;

    constructor(hero1: HeroBase, hero2: HeroBase, health?: number) {
        if (hero1 == null || hero2 == null) {
            throw new HeroNullException();
        }

        this.health = (health == null || health < 0 ? 30 : health);
        hero1.health = this.health;
        hero2.health = this.health;

        this.hero1 = new HeroContainer(hero1);
        this.hero2 = new HeroContainer(hero2);

        this._turn = this.hero1;
    }

    start(): boolean {
        this._started = true;
        this.prepare();
        return this._started;
    }

    getHero1Hand(): Collection<CardContainer> {
        this.checkStart();
        return this.hero1.hand;
    }

    getHero2Hand(): Collection<CardContainer> {
        this.checkStart();
        return this.hero2.hand;
    }

    checkStart(): void {
        if (!this._started) {
            throw new NotStartedException();
        }
    }

    attackToHero(context: AttackToHeroContext): boolean {
        this.checkStart();
        let isValidPawn = this._turn.validHandCardCheck(context.pawn.id);
        if (!isValidPawn) {
            throw new InvalidAttackException();
        }

        this.changeTurn();
        return true;
    }

    attackToPawn(context: AttackToPawnContext): boolean {
        this.checkStart();
        return true;
    }

    get turn(): HeroBase {
        return this._turn.hero;
    }

    private prepare(): void {
        this.hero1.prepare();
        this.hero2.prepare();
    }

    private changeTurn(): void {
        this._turn = (this._turn.hero == this.hero1.hero ? this.hero2 : this.hero1);
    }
}