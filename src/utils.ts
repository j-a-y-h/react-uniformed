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
function assertion(condition: boolean, type: LoggingTypes, message: string, logger: Logger): void {
    if (!condition) {
        /* eslint-disable no-console */
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
