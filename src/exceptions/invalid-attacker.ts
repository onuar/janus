export default class InvalidAttackerException extends Error {
    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, InvalidAttackerException.prototype);
    }
}