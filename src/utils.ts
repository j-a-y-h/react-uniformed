const projectName = "JustAnotherValidator";
/* eslint-disable no-console */
// eslint-disable-next-line import/prefer-default-export
export const log = {
    warning(type: string, message: string): void {
        console.warn(`${projectName}: [${type}] ${message}`);
    },
    debug(type: string, message: string): void {
        console.debug(`${projectName}: [${type}] ${message}`);
    },
};
