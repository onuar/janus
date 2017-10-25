import HeroBase from './herobase';

export default abstract class AttackContext {
    public whoAttacks: HeroBase;
    public whoGotAttacked: HeroBase;

    constructor(whoAttacks: HeroBase, whoGotAttacked: HeroBase) {
        this.whoAttacks = whoAttacks;
        this.whoGotAttacked = whoGotAttacked;
    }
}