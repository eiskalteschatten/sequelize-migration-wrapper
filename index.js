'use strict';

const path = require('path');
const Umzug = require('umzug');

let umzug;

function logUmzugEvent(eventName) {
    return function(name) {
        console.log(`${name} ${eventName}`);
    };
}

/*
  OPTIONS: {
    sequelize (no default, must be a Sequelize instance; required),
    path (default: path.join(__dirname, 'migrations')),
    filePattern (default: /\.js$/)
  }
*/

function setup(options) {
    const pathToScripts = options.path || path.join(__dirname, 'migrations');
    const filePattern = options.filePattern || /\.js$/;

    if (!options.sequelize) {
        console.error('sequelize-migration-wrapper requires an instance of Sequelize.');
        return;
    }

    umzug = new Umzug({
        storage: 'sequelize',
        storageOptions: {
            sequelize: options.sequelize,
        },
        migrations: {
            params: [
                db.getQueryInterface(),
                db.constructor,
                function() {
                    throw new Error('Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.');
                }
            ],
            path: pathToScripts,
            pattern: filePattern
        },
        logging: () => {
            console.log.apply(null, arguments);
        },
    });

    umzug.on('migrating', logUmzugEvent('migrating'));
    umzug.on('migrated',  logUmzugEvent('migrated'));
    umzug.on('reverting', logUmzugEvent('reverting'));
    umzug.on('reverted',  logUmzugEvent('reverted'));
}

function getStatus() {
    const result = {};

    return umzug.executed()
        .then(executed => {
            result.executed = executed;
            return umzug.pending();
        }).then(pending => {
            result.pending = pending;
            return result;
        }).then(({ executed, pending }) => {
            executed = executed.map(m => {
                m.name = path.basename(m.file, '.js');
                return m;
            });

            pending = pending.map(m => {
                m.name = path.basename(m.file, '.js');
                return m;
            });

            const current = executed.length > 0 ? executed[0].file : '<NO_MIGRATIONS>';
            const status = {
                current: current,
                executed: executed.map(m => m.file),
                pending: pending.map(m => m.file),
            };

            console.log(JSON.stringify(status, null, 2));

            return { executed, pending };
        });
}

function migrate() {
    return umzug.up();
}

function migrateNext() {
    return getStatus()
        .then(({ pending }) => {
            if (pending.length === 0) {
                return Promise.reject(new Error('No pending migrations'));
            }
            const next = pending[0].name;
            return umzug.up({ to: next });
        });
}

function reset() {
    return umzug.down({ to: 0 });
}

function resetPrev() {
    return getStatus()
        .then(({ executed }) => {
            if (executed.length === 0) {
                return Promise.reject(new Error('Already at initial state'));
            }
            const prev = executed[executed.length - 1].name;
            return umzug.down({ to: prev });
        });
}


module.exports = setup;
module.exports.getStatus = getStatus;
module.exports.migrate = migrate;
module.exports.migrateNext = migrateNext;
module.exports.reset = reset;
module.exports.resetPrev = resetPrev;
