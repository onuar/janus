import HeroBase from './herobase';

export default abstract class AttackContext {
    public whoAttacks: HeroBase;
    public whoGotAttacked: HeroBase;

    constructor(whoAttacks: HeroBase, whoGotAttacked: HeroBase) {
        whoAttacks = whoAttacks;
        whoGotAttacked = whoGotAttacked;
    }
}