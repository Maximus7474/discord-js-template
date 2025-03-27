import colors from 'colors/safe';

/**
 * Logger utility class to output formatted console logs with contextual origin and log levels.
 */
class Logger {
    private origin: string;

    /**
     * Create a new Logger instance.
     * @param origin - Identifier to indicate the source of the logs (e.g., module name).
     */
    constructor(origin: string) {
        this.origin = origin;
    }

    /**
     * Log an informational message to the console.
     * @param args - The arg(s) to log.
     */
    info(...args: any[]): void {
        console.log(`${colors.gray(new Date().toLocaleString())} ${colors.cyan(`[${this.origin}] [INFO]`)}`, ...args);
    }

    /**
     * Log a success message to the console.
     * @param args - The arg(s) to log.
     */
    success(...args: any[]): void {
        console.log(`${colors.gray(new Date().toLocaleString())} ${colors.green(`[${this.origin}] [SUCCESS]`)}`, ...args);
    }

    /**
     * Log a warning message to the console.
     * @param args - The arg(s) to log.
     */
    warn(...args: any[]): void {
        console.warn(`${colors.gray(new Date().toLocaleString())} ${colors.yellow(`[${this.origin}] [WARN]`)}`, ...args);
    }

    /**
     * Log an error message to the console.
     * @param args - The arg(s) to log.
     */
    error(...args: any[]): void {
        console.error(`${colors.gray(new Date().toLocaleString())} ${colors.red(`[${this.origin}] [ERROR]`)}`, ...args);
    }
}

export default Logger;
