import sqlite3 from 'sqlite3';
import fs from 'fs';
import Logger from '../logger';

const logger = new Logger("sqlite");
let initialized = false;

const initializeDatabase = () => {
    const db = new sqlite3.Database(`./data.db`);

    const sqlScript = fs.readFileSync('./src/utils/database/base.sql', 'utf8');
    db.serialize(() => {
        db.exec(sqlScript, (err) => {
            if (err) {
                logger.error('Error initializing database:', err.message);
            } else {
                initialized = true;
                logger.info('Database initialized.');
            }
        });
    });

    db.close();
};

const waitForInitialization = (): Promise<void> => {
    return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
            if (initialized) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 100);
    });
};

const executeStatement = async (sql: string, params: any[] = []): Promise<number | undefined> => {
    if (!initialized) await waitForInitialization();

    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(`./data.db`);
        db.run(sql, params, function (err) {
            if (err) {
                logger.error('Error executing SQL statement:', err);
                reject(err);
            } else {
                logger.success('SQL statement executed successfully.');
                resolve(this.lastID || this.changes);
            }
        });
        db.close();
    });
};

interface Statement {
    sql: string;
    params?: any[];
}

const executeTransaction = async (statements: Statement[]): Promise<boolean> => {
    if (!initialized) await waitForInitialization();

    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(`./data.db`);
        db.serialize(() => {
            db.run('BEGIN TRANSACTION;');
            statements.forEach(({ sql, params = [] }) => {
                db.run(sql, params, function (err) {
                    if (err) {
                        logger.error('Error executing SQL statement:', err);
                        db.run('ROLLBACK;');
                        reject(err);
                        return;
                    }
                });
            });
            db.run('COMMIT;', function (err) {
                if (err) {
                    logger.error('Error committing transaction:', err);
                    db.run('ROLLBACK;');
                    reject(err);
                    return;
                }
                logger.success('Transaction committed successfully.');
                resolve(true);
            });
        });
        db.close();
    });
};

const executeQuery = async (sql: string, params: any[] = [], type: 'get' | 'all' = 'get'): Promise<any> => {
    if (!initialized) await waitForInitialization();

    if (type !== 'get' && type !== 'all') {
        logger.warn('Incorrect argument for executeQuery type argument');
        return Promise.reject('Invalid query type');
    }
    
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(`./data.db`);
        db[type](sql, params, function (err, row) {
            if (err) {
                logger.error('Error executing SQL statement:', err);
                reject(err);
            } else {
                logger.success('SQL statement executed successfully.');
                resolve(row);
            }
        });
        db.close();
    });
};

export {
    initializeDatabase,
    executeStatement,
    executeTransaction,
    executeQuery
};
