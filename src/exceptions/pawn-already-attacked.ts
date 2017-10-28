export class PawnAlreadyAttackedException extends Error {
    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, PawnAlreadyAttackedException.prototype);
    }
}