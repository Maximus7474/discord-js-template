import colors from 'colors/safe';

class Logger {
    private origin: string;

    constructor(origin: string) {
        this.origin = origin;
    }

    private formatMessage(level: string): string {
        const timestamp = colors.gray((new Date()).toLocaleString());
        const levelColor = level === 'INFO' ? colors.cyan : 
                           level === 'SUCCESS' ? colors.green : 
                           level === 'WARN' ? colors.yellow : 
                           colors.red;
        return `${timestamp} ${levelColor(`[${this.origin}] [${level}]`)}`;
    }

    info(...args: any[]): void {
        console.log(this.formatMessage('INFO'), args);
    }

    success(...args: any[]): void {
        console.log(this.formatMessage('SUCCESS'), args);
    }

    warn(...args: any[]): void {
        console.warn(this.formatMessage('WARN'), args);
    }

    error(...args: any[]): void {
        console.error(this.formatMessage('ERROR'), args);
    }
}

export default Logger;
