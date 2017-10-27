export class InvalidManaException extends Error {
    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, InvalidManaException.prototype);
    }
}