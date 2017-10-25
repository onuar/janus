export class NotStartedException extends Error {
    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, NotStartedException.prototype);
    }
}