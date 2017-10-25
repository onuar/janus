import HeroBase from './herobase';
import Collection from './foundation/generic-collection';
import CardContainer from './card-container';
import Guid from './foundation/guid';
import { HeroContainerNotPreparedException } from './exceptions/herocontainer-not-ready';

export default class HeroContainer {
    public hero: HeroBase;

    public hand: Collection<CardContainer>;
    public ground: Collection<CardContainer>;
    public dead: Collection<CardContainer>;
    public deck: Collection<CardContainer>;

    private initHandCount: number;
    private _prepared: boolean = false;
    private _health: number;

    constructor(hero: HeroBase, initHandCount: number = 4) {
        this.hero = hero;
        this.initHandCount = initHandCount;
        this._health = hero.health;
    }

    prepare(): void {
        this.deck = new Collection<CardContainer>();
        this.hand = new Collection<CardContainer>();
        this.dead = new Collection<CardContainer>();

        this.prepareDeck();
        this.shuffleCards();
        this.takeCardsToHand();

        this._prepared = true;
    }

    pick(): void {
        let picked = this.deck.GetItem(0);
        this.hand.Add(picked);
        this.deck.Delete(0);
    }

    // plays card to on the ground
    play(card: CardContainer): void {

    }

    // returns current health
    damage(attack: number): number {
        this._health -= attack;
        return this._health;
    }

    deadCheck(): boolean {
        this.checkPrepared();
        return false;
    }

    validGroundCardCheck(id: string): boolean {
        this.checkPrepared();
        for (var index = 0; index < this.ground.Count(); index++) {
            var element = this.ground.GetItem(index);
            if (element.id == id) {
                return true;
            }
        }

        return false;
    }

    validHandCardCheck(id: string): boolean {
        this.checkPrepared();
        for (var index = 0; index < this.hand.Count(); index++) {
            var element = this.hand.GetItem(index);
            if (element.id == id) {
                return true;
            }
        }

        return false;
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