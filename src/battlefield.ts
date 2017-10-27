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

    private _turn: number;
    private _manaTurn: number;
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

        this._turn = 1;
        this._manaTurn = 0;
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

    discard(played: CardContainer): void {
        this.checkStart();
    }

    attackToHero(context: AttackToHeroContext): boolean {
        this.checkStart();
        var attacker = this.getAttacker();
        var defencer = this.getDefencer();

        let isValidPawn = attacker.validHandCardCheck(context.pawn.id);
        // todo: change with validGroundCardCheck
        if (!isValidPawn) {
            throw new InvalidAttackException();
        }
        defencer.damage(context.pawn.card.power);
        return true;
    }

    attackToPawn(context: AttackToPawnContext): boolean {
        this.checkStart();
        return true;
    }

    pass(): void {
        this.checkStart();
        this.changeTurn();
    }

    manaRound(): number {
        let i = this._manaTurn / 2;
        let mana = i + 1;
        return mana;
    }

    private checkStart(): void {
        if (!this._started) {
            throw new NotStartedException();
        }
    }

    private prepare(): void {
        this.hero1.prepare();
        this.hero2.prepare();
    }

    private changeTurn(): void {
        this._turn = this._turn == 1 ? 2 : 1;
        this._manaTurn += 1;
        var attacker = this.getAttacker();
        attacker.pick();
    }

    // ugly but works
    private getAttacker(): HeroContainer {
        var attacker = this._turn == 1 ? this.hero1 : this.hero2;
        return attacker;
    }

    // ugly but works - 2
    private getDefencer(): HeroContainer {
        var defencer = this._turn == 1 ? this.hero2 : this.hero1;
        return defencer;
    }
}