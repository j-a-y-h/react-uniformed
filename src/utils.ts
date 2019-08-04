const projectName = "JustAnotherValidator";
export const log = {
    warning(type: string, message: string) {
        console.warn(`${projectName}: [${type}] ${message}`);
    },
    debug(type: string, message: string) {
        console.debug(`${projectName}: [${type}] ${message}`);
    }
}