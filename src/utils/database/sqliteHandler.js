const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const log = new require('../logger.js')
const logger = new log("sqlite")

let initialized = false;

const initializeDatabase = () => {
    const db = new sqlite3.Database(`./data.db`);
    
    const sqlScript = fs.readFileSync('./src/utils/database/base.sql', 'utf8');
    db.serialize(() => {
        db.exec(sqlScript, function(err) {
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

const waitForInitialization = () => {
    return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
            if (initialized) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 100);
    });
};

const executeStatement = async (sql, params = []) => {
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

const executeTransaction = async (statements) => {
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

const executeQuery = async (sql, params = [], type = 'get') => {
    if (!initialized) await waitForInitialization();

    if (type !== 'get' && type !== 'all') return logger.warn('Incorrect argument for executeQuery type argument');
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

module.exports = {
    initializeDatabase,
    executeStatement,
    executeTransaction,
    executeQuery
};
