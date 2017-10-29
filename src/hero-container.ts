import HeroBase from './herobase';
import Collection from './foundation/generic-collection';
import CardContainer from './card-container';
import Guid from './foundation/guid';
import {
    InvalidDeployException, InsufficientManaException,
    HeroContainerNotPreparedException, InvalidAttackException,
    PawnWaitingException, PawnAlreadyAttackedException,
    InsufficientPawnException
} from './exceptions';
import CardCollection from './card-collection';
import CardContainerCollection from './card-container-collection';

export default class HeroContainer {
    public hero: HeroBase;

    public hand: CardContainerCollection;
    public ground: CardContainerCollection;
    public dead: CardContainerCollection;
    public deck: CardContainerCollection;

    private _initHandCount: number;
    private _prepared: boolean = false;
    private _health: number;

    constructor(hero: HeroBase, initHandCount: number = 4) {
        this.hero = hero;
        this._initHandCount = initHandCount;
        this._health = hero.health;
    }

    prepare(): void {
        if (this.hero.cards.count() < this._initHandCount) {
            throw new InsufficientPawnException(`Pawn count (${this.hero.cards.count()}) must be greater than init hand pawn count(${this._initHandCount})`);
        }

        this.deck = new CardContainerCollection();
        this.hand = new CardContainerCollection();
        this.dead = new CardContainerCollection();
        this.ground = new CardContainerCollection();

        this.prepareDeck();
        this.shuffleCards();
        this.takeCardsToHand();

        this._prepared = true;
    }

    // pick a card from top of the deck to hand
    pick(): void {
        if (this.deck.count() > 0) {
            let picked = this.deck.getItem(0);
            this.hand.add(picked);
            this.deck.delete(0);
        }
    }

    // deploys a pawn to on the ground
    deploy(pawn: CardContainer, mana: number, round: number): boolean {
        var index = this.validHandCardCheck(pawn.id);
        if (index == -1) {
            throw new InvalidDeployException();
        }

        if (pawn.card.mana > mana) {
            throw new InsufficientManaException(`Pawn mana: ${pawn.card.mana} - Remaining Mana: ${mana}`);
        }
        pawn.deployingRound = round;
        this.ground.add(pawn);
        this.hand.delete(index);
        return true;
    }

    setAsAttacked(pawn: CardContainer, round: number): void {
        var item = this.ground.getItemById(pawn.id);
        if (item != undefined) {
            item.lastAttackRound = round;
        }
    }

    // returns current health by damage power
    damage(pawn: CardContainer, round: number): number {
        this._health -= pawn.card.power;
        return this._health;
    }

    deadCheck(): boolean {
        this.checkPrepared();
        return false;
    }

    // returns the index of the found pawn. if not, throws exceptions.
    validGroundCardCheck(id: string, round: number): number {
        this.checkPrepared();
        for (var index = 0; index < this.ground.count(); index++) {
            var element = this.ground.getItem(index);
            if (element.id == id) {
                if (element.deployingRound == round) {
                    throw new PawnWaitingException();
                }

                if (element.lastAttackRound == round) {
                    throw new PawnAlreadyAttackedException();
                }

                return index;
            }
        }

        throw new InvalidAttackException();
    }

    get health(): number {
        return this._health;
    }

    // returns the index of the found pawn. if not, returns -1.
    private validHandCardCheck(id: string): number {
        this.checkPrepared();
        for (var index = 0; index < this.hand.count(); index++) {
            var element = this.hand.getItem(index);
            if (element.id == id) {
                return index;
            }
        }

        return -1;
    }

    private prepareDeck(): void {
        for (var index = 0; index < this.hero.cards.count(); index++) {
            var element = this.hero.cards.getItem(index);
            var id = Guid.newGuid();
            let cardContainer: CardContainer = new CardContainer(id, element);
            this.deck.add(cardContainer);
        }
    }

    private shuffleCards(): void {
        // todo: shuffle this.deck
    }

    private takeCardsToHand(): void {
        for (var index = 0; index < this._initHandCount; index++) {
            var element = this.deck.getItem(index);
            this.hand.add(element);
        }
        for (var index = 0; index < this._initHandCount; index++) {
            var element = this.deck.getItem(index);
            this.deck.delete(index);
        }
    }

    private checkPrepared(): void {
        if (!this._prepared) {
            throw new HeroContainerNotPreparedException();
        }
    }
}