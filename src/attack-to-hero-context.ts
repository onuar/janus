import HeroBase from './herobase';
import CardContainer from './card-container';

export default class AttackToHeroContext {
    public pawn: CardContainer;

    constructor(pawn: CardContainer) {
        this.pawn = pawn;
    }
}