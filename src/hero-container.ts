import HeroBase from './herobase';
import Collection from './foundation/generic-collection';
import CardContainer from './card-container';
import Guid from './foundation/guid';
import { InvalidDeployException, InsufficientManaException, HeroContainerNotPreparedException } from './exceptions';
import CardCollection from './card-collection';
import CardContainerCollection from './card-container-collection';

export default class HeroContainer {
    public hero: HeroBase;

    public hand: CardContainerCollection;
    public ground: CardContainerCollection;
    public dead: CardContainerCollection;
    public deck: CardContainerCollection;

    private initHandCount: number;
    private _prepared: boolean = false;
    private _health: number;

    constructor(hero: HeroBase, initHandCount: number = 4) {
        this.hero = hero;
        this.initHandCount = initHandCount;
        this._health = hero.health;
    }

    prepare(): void {
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
        let picked = this.deck.GetItem(0);
        this.hand.Add(picked);
        this.deck.Delete(0);
    }

    // deploys a pawn to on the ground
    deploy(pawn: CardContainer, mana: number): boolean {
        var index = this.validHandCardCheck(pawn.id);
        if (index == -1) {
            throw new InvalidDeployException();
        }

        if (pawn.card.mana > mana) {
            throw new InsufficientManaException(`Pawn mana: ${pawn.card.mana} - Remaining Mana: ${mana}`);
        }

        this.ground.Add(pawn);
        this.hand.Delete(index);
        return true;
    }

    // returns current health by damage power
    damage(attack: number): number {
        this._health -= attack;
        return this._health;
    }

    deadCheck(): boolean {
        this.checkPrepared();
        return false;
    }

    // returns the index of the found pawn. if not, returns -1.
    validGroundCardCheck(id: string): number {
        this.checkPrepared();
        for (var index = 0; index < this.ground.Count(); index++) {
            var element = this.ground.GetItem(index);
            if (element.id == id) {
                return index;
            }
        }

        return -1;
    }

    // returns the index of the found pawn. if not, returns -1.
    validHandCardCheck(id: string): number {
        this.checkPrepared();
        for (var index = 0; index < this.hand.Count(); index++) {
            var element = this.hand.GetItem(index);
            if (element.id == id) {
                return index;
            }
        }

        return -1;
    }

    get health(): number {
        return this._health;
    }

    private prepareDeck(): void {
        for (var index = 0; index < this.hero.cards.Count(); index++) {
            var element = this.hero.cards.GetItem(index);
            var id = Guid.newGuid();
            let cardContainer: CardContainer = new CardContainer(id, element);
            this.deck.Add(cardContainer);
        }
    }

    private shuffleCards(): void {
        // todo: shuffle this.deck
    }

    private takeCardsToHand(): void {
        for (var index = 0; index < this.initHandCount; index++) {
            var element = this.deck.GetItem(index);
            this.hand.Add(element);
        }
        for (var index = 0; index < this.initHandCount; index++) {
            var element = this.deck.GetItem(index);
            this.deck.Delete(index);
        }
    }

    private checkPrepared(): void {
        if (!this._prepared) {
            throw new HeroContainerNotPreparedException();
        }
    }
}