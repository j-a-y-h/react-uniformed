const projectName = "react-uniformed";

export enum LoggingTypes {
    invalidArgument = "InvalidArgument",
    typeError = "TypeError",
    constraintError = "ConstraintError",
}
interface Logger {
    (message?: string, ...optionalParams: string[]): void;
}

// eslint-disable-next-line import/prefer-default-export
/* eslint-disable no-console */
function assertion(condition: boolean, type: LoggingTypes, message: string, logger: Logger): void {
    if (!condition) {
        logger(`${projectName}: [${type}] ${message}`);
    }
}

export const assert = {
    error(condition: boolean, type: LoggingTypes, message: string): void {
        assertion(condition, type, message, console.error);
    },
    warning(condition: boolean, type: LoggingTypes, message: string): void {
        assertion(condition, type, message, console.warn);
    },
};
