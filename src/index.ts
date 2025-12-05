import path from 'path';
import { Umzug, SequelizeStorage, LogFn, MigrationMeta } from 'umzug';
import { Sequelize } from 'sequelize';

let umzug: Umzug;

function logUmzugEvent(eventName: string): any {
  return (name: string): void => {
    console.log(`${name} ${eventName}`);
  };
}

export interface SetupOptions {
  sequelize: InstanceType<typeof Sequelize>;
  path: string;
  filePattern?: RegExp;
  logger?: Record<'info' | 'warn' | 'error' | 'debug', LogFn>
}

export function setupMigration(options: SetupOptions): void {
  const filePattern = options.filePattern || /\.js$/;

  if (!options.sequelize) {
    console.error('sequelize-migration-wrapper requires an instance of Sequelize.');
    return;
  }

  if (!options.path) {
    console.error('No path to any migrations scripts was given.');
    return;
  }

  const { sequelize } = options;
  const path = options.path.endsWith('/') ? options.path.slice(0, -1) : options.path;

  umzug = new Umzug({
    storage: new SequelizeStorage({ sequelize }),
    context: sequelize.getQueryInterface(),
    migrations: {
      glob: `${path}/${filePattern}`,
    },
    logger: options.logger || console,
  });

  umzug.on('migrating', logUmzugEvent('migrating'));
  umzug.on('migrated', logUmzugEvent('migrated'));
  umzug.on('reverting', logUmzugEvent('reverting'));
  umzug.on('reverted', logUmzugEvent('reverted'));
}

export default setupMigration;

  export interface Status {
  executed: MigrationMeta[];
  pending: MigrationMeta[];
}

export async function getStatus(): Promise<Status> {
  let executed: MigrationMeta[] = await umzug.executed();
  let pending: MigrationMeta[] = await umzug.pending();

  executed = executed.map((migration: MigrationMeta) => {
    migration.name = path.basename(migration.name, '.js');
    return migration;
  });

  pending = pending.map((migration: MigrationMeta) => {
    migration.name = path.basename(migration.name, '.js');
    return migration;
  });

  const current = executed.length > 0 ? executed[0].name : '<NO_MIGRATIONS>';
  const status = {
    current: current,
    executed: executed.map(m => m.name),
    pending: pending.map(m => m.name),
  };

  console.log(JSON.stringify(status, null, 2));

  return { executed, pending };
}

export function migrate(): Promise<MigrationMeta[]> {
  return umzug.up();
}

export async function migrateNext(): Promise<MigrationMeta[]> {
  const { pending } = await getStatus();

  if (pending.length === 0) {
    return Promise.reject(new Error('No pending migrations'));
  }

  const next = pending[0].name;
  return umzug.up({ to: next });
}

export function reset(): Promise<MigrationMeta[]> {
  return umzug.down({ to: '0' });
}

export async function resetPrev(): Promise<MigrationMeta[]> {
  const { executed } = await getStatus();

  if (executed.length === 0) {
    return Promise.reject(new Error('Already at initial state'));
  }

  const prev = executed[executed.length - 1].name;
  return umzug.down({ to: prev });
}
