import HeroBase from './herobase';
import HeroNullException from './exceptions/hero-null';

export default class BattleField {
    public hero1: HeroBase;
    public hero2: HeroBase;
    public health: number;

    constructor(hero1: HeroBase, hero2: HeroBase, health?: number) {
        if (hero1 == null || hero2 == null) {
            throw new HeroNullException();
        }

        this.health = (health == null || health < 0 ? 30 : health);
        this.hero1 = hero1;
        this.hero2 = hero2;
        this.hero1.health = this.health;
        this.hero2.health = this.health;
    }
}