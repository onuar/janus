import Collection from './foundation/generic-collection';
import CardContainer from './card-container';

export default class DeployResultContext {
    private readonly _remainingMana: number;
    private readonly _currentHand: Collection<CardContainer>;
    private readonly _currentGround: Collection<CardContainer>;

    constructor(remainingMana: number, currentHand: Collection<CardContainer>, currentGround: Collection<CardContainer>) {
        this._remainingMana = remainingMana;
        this._currentHand = currentHand;
        this._currentGround = currentGround;
    }

    get RemainingMana(): number {
        return this._remainingMana;
    }

    get CurrentHand(): Collection<CardContainer> {
        return this._currentHand;
    }

    get CurrentGround(): Collection<CardContainer> {
        return this._currentGround;
    }
}