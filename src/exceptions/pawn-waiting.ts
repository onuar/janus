export class PawnWaitingException extends Error {
    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, PawnWaitingException.prototype);
    }
}