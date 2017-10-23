import AttackContext from './attack-context';
import HeroBase from './herobase';

export default class AttackToHeroContext extends AttackContext {
    constructor(whoAttacks: HeroBase, whoGotAttacked: HeroBase) {
        super(whoAttacks, whoGotAttacked);

    }
}