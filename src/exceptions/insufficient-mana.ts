
export class InsufficientManaException extends Error {
    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, InsufficientManaException.prototype);
    }
}