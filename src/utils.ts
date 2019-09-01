const projectName = "react-uniformed";

export enum LoggingTypes {
    invalidArgument = "InvalidArgument",
    typeError = "TypeError",
    constraintError = "ConstraintError",
}
interface Logger {
    (type: LoggingTypes, message: string): void;
}

interface Log {
    readonly [key: string]: Logger;
}

/* eslint-disable no-console */
// eslint-disable-next-line import/prefer-default-export
const log: Log = {
    warning(type: LoggingTypes, message: string): void {
        console.warn(`${projectName}: [${type}] ${message}`);
    },
    debug(type: LoggingTypes, message: string): void {
        console.debug(`${projectName}: [${type}] ${message}`);
    },
    error(type: LoggingTypes, message: string): void {
        console.error(`${projectName}: [${type}] ${message}`);
    },
};

function assertion(condition: boolean, type: LoggingTypes, message: string, logger: Logger): void {
    if (!condition) {
        logger(type, message);
    }
}

export const assert = {
    error(condition: boolean, type: LoggingTypes, message: string): void {
        assertion(condition, type, message, log.error);
    },
    warning(condition: boolean, type: LoggingTypes, message: string): void {
        assertion(condition, type, message, log.warning);
    },
    debug(condition: boolean, type: LoggingTypes, message: string): void {
        assertion(condition, type, message, log.debug);
    },
};
