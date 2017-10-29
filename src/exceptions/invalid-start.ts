export class InvalidStartException extends Error {
    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, InvalidStartException.prototype);
    }
}