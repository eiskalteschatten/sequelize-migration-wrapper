import path from 'path';
import Umzug, { Migration } from 'umzug';
import { Sequelize } from 'sequelize';

let umzug: Umzug.Umzug;

function logUmzugEvent(eventName: string): any {
  return (name: string): void => {
    console.log(`${name} ${eventName}`);
  };
}

/*
  OPTIONS: {
    sequelize (no default, must be a Sequelize instance; required),
    path (no default; required),
    filePattern (default: /\.js$/)
  }
*/

export interface SetupOptions {
  sequelize: Sequelize;
  path: string;
  filePattern: RegExp;
}

export default function setup(options: SetupOptions): void {
  const filePattern = options.filePattern || /\.js$/;

  if (!options.sequelize) {
    console.error('sequelize-migration-wrapper requires an instance of Sequelize.');
    return;
  }

  if (!options.path) {
    console.error('No path to any migrations scripts was given.');
    return;
  }

  const sequelize = options.sequelize;

  umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize,
    },
    migrations: {
      params: [
        sequelize.getQueryInterface(),
        sequelize.constructor,
        () => {
          throw new Error('Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.');
        }
      ],
      path: options.path,
      pattern: filePattern
    },
    logging: () => {
      console.log.apply(null, arguments);
    },
  });

  umzug.on('migrating', logUmzugEvent('migrating'));
  umzug.on('migrated', logUmzugEvent('migrated'));
  umzug.on('reverting', logUmzugEvent('reverting'));
  umzug.on('reverted', logUmzugEvent('reverted'));
}

interface ExtendedMigration extends Migration {
  name?: string;
}

export interface Status {
  executed: ExtendedMigration[];
  pending: ExtendedMigration[];
}

export async function getStatus(): Promise<Status> {
  let executed: ExtendedMigration[] = await umzug.executed();
  let pending: ExtendedMigration[] = await umzug.pending();

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
}

export function migrate(): Promise<Migration[]> {
  return umzug.up();
}

export async function migrateNext(): Promise<Migration[]> {
  const { pending } = await getStatus();

  if (pending.length === 0) {
    return Promise.reject(new Error('No pending migrations'));
  }

  const next = pending[0].name;
  
  return umzug.up({ to: next });
}

export function reset(): Promise<Migration[]> {
  return umzug.down({ to: 0 });
}

export async function resetPrev(): Promise<Migration[]> {
  const { executed } = await getStatus();

  if (executed.length === 0) {
    return Promise.reject(new Error('Already at initial state'));
  }

  const prev = executed[executed.length - 1].name;
  
  return umzug.down({ to: prev });
}
