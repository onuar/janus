export class HeroContainerNotPreparedException extends Error {
    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, HeroContainerNotPreparedException.prototype);
    }
}