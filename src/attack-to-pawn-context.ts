import HeroBase from './herobase';
import CardContainer from './card-container';

export default class AttackToPawnContext {
    public readonly attackingPawn: CardContainer;
    public readonly defencingPawn: CardContainer;

    constructor(attacking: CardContainer, defencing: CardContainer) {
        this.attackingPawn = attacking;
        this.defencingPawn = defencing;
    }
}