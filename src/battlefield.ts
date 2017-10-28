import HeroBase from './herobase';
import AttackToHeroContext from './attack-to-hero-context';
import AttackToPawnContext from './attack-to-pawn-context';
import { HeroNullException, NotStartedException, InvalidAttackException, InvalidDeployException, GameOverException } from "./exceptions";;
import HeroContainer from './hero-container';
import Collection from './foundation/generic-collection';
import CardContainer from './card-container';
import DeployResultContext from './deploy-result-context';
import AttackToHeroResult from './attack-to-hero-result';

export default class BattleField {
    public hero1: HeroContainer;
    public hero2: HeroContainer;
    public health: number;

    private _turn: number;
    private _manaTurn: number;
    private _started: boolean;
    private _remainingMana: number;
    private _gameOver: boolean;
    private _winner: HeroBase;

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
        this._gameOver = false;
    }

    start(): boolean {
        this._started = true;
        this.prepare();
        this._remainingMana = this.manaRound();
        return this._started;
    }

    deploy(pawn: CardContainer): DeployResultContext {
        this.checkStart();
        var attacker = this.getAttacker();
        var round = this.manaRound();
        try {
            var isDeployed = attacker.deploy(pawn, this._remainingMana, round);
        } catch (error) {
            throw error;
        }

        this._remainingMana = this._remainingMana - pawn.card.mana;
        let result = new DeployResultContext(this._remainingMana, attacker.hand, attacker.ground);
        return result;
    }

    attackToHero(context: AttackToHeroContext): AttackToHeroResult {
        this.checkStart();
        var attacker = this.getAttacker();
        var defencer = this.getDefencer();
        var round = this.manaRound();

        try {
            attacker.validGroundCardCheck(context.pawn.id, round);
        } catch (error) {
            throw error;
        }

        defencer.damage(context.pawn.card.power);
        let result = new AttackToHeroResult(defencer.health);
        if (defencer.health <= 0) {
            result.setWinner(attacker.hero);
            this._winner = attacker.hero;
            this.finishGame();
        }

        return result;
    }

    // todo: will return attackToPawnResult
    attackToPawn(context: AttackToPawnContext): boolean {
        // WIP
        this.checkStart();
        return true;
    }

    pass(): void {
        this.checkStart();
        this.changeTurn();
    }

    giveUp(): void {
        this.finishGame();
        var winnerContainer = this.getDefencer();
        this._winner = winnerContainer.hero;
    }

    finishGame(): void {
        this._gameOver = true;
    }

    manaRound(): number {
        let i = this._manaTurn / 2;
        let mana = i + 1;
        return mana;
    }

    getHero1Hand(): Collection<CardContainer> {
        this.checkStart();
        return this.hero1.hand;
    }

    getHero2Hand(): Collection<CardContainer> {
        this.checkStart();
        return this.hero2.hand;
    }

    getHero1Ground(): Collection<CardContainer> {
        this.checkStart();
        return this.hero1.ground;
    }

    getHero2Ground(): Collection<CardContainer> {
        this.checkStart();
        return this.hero2.ground;
    }

    get RemainingMana(): number {
        return this._remainingMana;
    }

    get Winner(): HeroBase {
        return this._winner;
    }

    private checkStart(): void {
        if (!this._started) {
            throw new NotStartedException();
        }
    }

    private checkGameOver(): void {
        if (this._gameOver) {
            throw new GameOverException();
        }
    }

    private prepare(): void {
        this.hero1.prepare();
        this.hero2.prepare();
    }

    private changeTurn(): void {
        this._turn = this._turn == 1 ? 2 : 1;
        if (this.manaRound() != 10) {
            this._manaTurn += 1;
        }
        var attacker = this.getAttacker();
        attacker.pick();
        this._remainingMana = this.manaRound();
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