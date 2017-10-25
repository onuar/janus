export class InvalidAttackException extends Error {
    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, InvalidAttackException.prototype);
    }
}