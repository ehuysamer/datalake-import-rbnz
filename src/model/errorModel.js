export const ERROR_VALIDATION = 'EValidation';
export const ERROR_DATABASE = 'EDatabase';
export const ERROR_TIMEOUT = 'ETimeout';
export const ERROR_STREAM_INPUT = 'EStreamInput';
export const ERROR_UNDEFINED = 'EUndefined'; // There is no error code for this
export const ERROR_PARAMETER = 'EParameter';
export const ERROR_AUTHORIZATION = 'EAuthorization';
export const ERROR_NOT_FOUND = 'ENotFound';

export default class ErrorModel extends Error {
    constructor(code, type, message, err, debugInfo) {
        super(message);

        this.name = 'ErrorModel';
        this.innerException = err;

        if (err?.isErrorModel === true) {
            this.code = code;
            this.message = message;
            this.debugInfo = debugInfo;
            this.err = err;
            this.type = type;
            return;
        }

        console.error(code, type, message);
        if (err !== null && err !== undefined) {
            console.error('Error thrown', err);
        }
        if (debugInfo !== null && debugInfo !== undefined) {
            console.debug('Debug info', debugInfo);
        }

        this.type = type;
        this.code = code;
        this.message = message;
        this.debugInfo = debugInfo;
        this.err = err;

        this.isErrorModel = true;
    }

    toString() {
        return this.message;
    }
}
