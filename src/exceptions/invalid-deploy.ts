export class InvalidDeployException extends Error {
    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, InvalidDeployException.prototype);
    }
}