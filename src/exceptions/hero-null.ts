export class HeroNullException extends Error {
    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, HeroNullException.prototype);
    }
}