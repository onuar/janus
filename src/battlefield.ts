import HeroBase from './herobase';
import AttackToHeroContext from './attack-to-hero-context';
import AttackToPawnContext from './attack-to-pawn-context';
import { HeroNullException, NotStartedException, InvalidAttackException, InvalidDeployException, GameOverException } from "./exceptions";;
import HeroContainer from './hero-container';
import Collection from './foundation/generic-collection';
import CardContainer from './card-container';
import DeployResultContext from './deploy-result-context';
import AttackToHeroResult from './attack-to-hero-result';
import GameOptions from './game-options';
import { InvalidStartException } from './exceptions/invalid-start';
import AttackToPawnResult from './attack-to-pawn-result';

export default class BattleField {
    public hero1: HeroContainer;
    public hero2: HeroContainer;
    public readonly health: number = 30;

    private _turn: number;
    private _manaTurn: number;
    private _started: boolean;
    private _remainingMana: number;
    private _gameOver: boolean;
    private _winner: HeroBase;

    constructor(hero1: HeroBase, hero2: HeroBase, options?: GameOptions) {
        if (hero1 == undefined || hero2 == undefined) {
            throw new HeroNullException();
        }

        var initHandCount = 4;
        if (options != undefined) {
            this.health = options.health != undefined && options.health > 0 ? options.health : 30;
            initHandCount = options.initHandCount != undefined && options.initHandCount > 0 ? options.initHandCount : 4;
        }

        hero1.health = this.health;
        hero2.health = this.health;

        this.hero1 = new HeroContainer(hero1, initHandCount);
        this.hero2 = new HeroContainer(hero2, initHandCount);

        this._turn = 1;
        this._manaTurn = 0;
        this._gameOver = false;
    }

    start(): boolean {

        this._started = true;
        this.prepare();
        if (this.hero1.hero.cards.count() != this.hero2.hero.cards.count()) {
            throw new InvalidStartException(`Hero 1: ${this.hero1.hero.cards.count()} Hero 2: ${this.hero2.hero.cards.count()}`);
        }

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
            attacker.validGroundCardCheckForAttack(context.pawn.id, round);
        } catch (error) {
            throw error;
        }

        defencer.damage(context.pawn);
        attacker.setAsAttacked(context.pawn, round);

        let result = new AttackToHeroResult(defencer.health);
        if (defencer.health <= 0) {
            result.setWinner(attacker.hero);
            this._winner = attacker.hero;
            this.finishGame();
        }

        return result;
    }

    attackToPawn(context: AttackToPawnContext): AttackToPawnResult {
        this.checkStart();

        var attacker = this.getAttacker();
        var defencer = this.getDefencer();
        var round = this.manaRound();

        try {
            attacker.validGroundCardCheckForAttack(context.attackingPawn.id, round);
            defencer.validGroundCardCheckForDefence(context.defencingPawn.id);
        } catch (error) {
            throw error;
        }

        var dead = defencer.damageToPawn(context.attackingPawn, context.defencingPawn);
        attacker.setAsAttacked(context.attackingPawn, round);

        let result = new AttackToPawnResult(dead, defencer.ground);
        return result;
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