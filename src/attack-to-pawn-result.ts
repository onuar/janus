import CardContainerCollection from './card-container-collection';


export default class AttackToPawnResult {
    public readonly dead: boolean;
    public readonly defencerGround: CardContainerCollection;

    constructor(dead: boolean, defencerGround: CardContainerCollection) {
        this.dead = dead;
        this.defencerGround = defencerGround;
    }
}