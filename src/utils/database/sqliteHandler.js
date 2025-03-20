const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const log = new require('../logger.js')
const logger = new log("sqlite")

let initialized = false;

/**
 * Initializes the SQLite database by executing the base schema SQL script.
 *
 * Reads and executes `base.sql` to create necessary tables and structures.
 * Logs success or errors during initialization.
 *
 * @returns {void}
 */
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

initializeDatabase();

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

/**
 * Executes a SQL statement on the SQLite database.
 *
 * Opens a connection, runs the statement with optional parameters,
 * and returns either the last inserted ID or number of affected rows.
 *
 * @async
 * @param {string} sql - The SQL query string to execute (e.g., INSERT, UPDATE, DELETE).
 * @param {Array<any>} [params=[]] - Optional parameters to bind to the SQL statement.
 * @returns {Promise<number>} - Resolves with `lastID` (for INSERT) or `changes` (for UPDATE/DELETE).
 */
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

/**
 * Executes multiple SQL statements in a single SQLite transaction.
 *
 * Each statement is executed sequentially. If any statement fails, the transaction is rolled back.
 *
 * @async
 * @param {Array<{ sql: string, params?: Array<any> }>} statements - An array of SQL statements with optional parameters to execute as a single transaction.
 * @returns {Promise<boolean>} - Resolves with `true` if the transaction is committed successfully.
 */
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

/**
 * Executes a SQL SELECT query on the SQLite database.
 *
 * Supports retrieving either a single row (`get`) or multiple rows (`all`).
 *
 * @async
 * @param {string} sql - The SQL SELECT query to execute.
 * @param {Array<any>} [params=[]] - Optional parameters to bind to the SQL query.
 * @param {'get'|'all'} [type='get'] - The type of query result: `'get'` for a single row or `'all'` for an array of rows.
 * @returns {Promise<any|any[]>} - Resolves with a single row object (for `'get'`) or an array of row objects (for `'all'`).
 */
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
