const colors = require('colors/safe');

class Logger {
    constructor(origin) {
        this.origin = origin
    }

    info(...message) {
        console.log(`${colors.gray((new Date()).toLocaleString())} ${(colors.cyan(`[INFO]`)+`    [${colors.blue(this.origin)}]`).padEnd(50, ' ')}`, ...message);
    }

    success(...message) {
        console.log(`${colors.gray((new Date()).toLocaleString())} ${(colors.green(`[SUCCESS]`)+` [${colors.blue(this.origin)}]`).padEnd(50, ' ')}`, ...message);
    }

    warn(...message) {
        console.warn(`${colors.gray((new Date()).toLocaleString())} ${(colors.yellow(`[WARN]`)+`    [${colors.blue(this.origin)}]`).padEnd(50, ' ')}`, ...message);
    }

    error(...message) {
        console.error(`${colors.gray((new Date()).toLocaleString())} ${(colors.red(`[ERROR]`)+`   [${colors.blue(this.origin)}]`).padEnd(50, ' ')}`, ...message);
    }
}

module.exports = Logger;