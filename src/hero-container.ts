import HeroBase from './herobase';
import Collection from './foundation/generic-collection';
import CardContainer from './card-container';
import Guid from './foundation/guid';

export default class HeroContainer {
    public hero: HeroBase;

    public hand: Collection<CardContainer>;
    public dead: Collection<CardContainer>;
    public deck: Collection<CardContainer>;

    private initHandCount: number;

    constructor(hero: HeroBase, initHandCount: number = 4) {
        this.hero = hero;
        this.initHandCount = initHandCount;
    }

    prepare(): void {
        this.deck = new Collection<CardContainer>();
        this.hand = new Collection<CardContainer>();
        this.dead = new Collection<CardContainer>();

        this.prepareDeck();
        this.shuffleCards();
        this.takeCardsToHand();
    }

    deadCheck(): boolean {
        return false;
    }

    validHandCardCheck(id: string): boolean {
        for (var index = 0; index < this.hand.Count(); index++) {
            var element = this.hand.GetItem(index);
            if (element.id == id) {
                return true;
            }
        }

        return false;
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
}