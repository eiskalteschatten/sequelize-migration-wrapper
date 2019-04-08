# sequelize-migration-wrapper

> A wrapper for migrating databases using Sequelize and Umzug.


## Table of Contents

- <a href="#requirements">Requirements</a>
- <a href="#install">Install</a>
- <a href="#usage">Usage</a>
- <a href="#api">API</a>
- <a href="#release-notes">Release Notes</a>
- <a href="#maintainer">Maintainer</a>


## Requirements

This module is tested with Node.js 10 and 11. It might work with Node.js >= 9, but is not tested.


## Install

```
npm install --save sequelize-migration-wrapper
```

## Usage

### To run through all migration scripts

Umzug automatically saves which migration scripts have already been run, so it will not re-run those.

```js
const sequelize = new Sequelize({...});

const migration = require('sequelize-migration-wrapper');

const migrateDb = migration({
  sequelize,
  path: 'path/to/migration/scripts',
  filePattern: /\.js$/
});

await migrateDb.cmdMigrate();
```

#### Options

- sequelize (no default, must be a Sequelize instance),
- path (default: `path.join(__dirname, 'migrations')`),
- filePattern (default: `/\.js$/`)


## API

### cmdMigrate()

Runs through all migration scripts in the configured folder. Umzug automatically saves which migration scripts have already been run, so it will not re-run those.

```js
await migrateDb.cmdMigrate();
```

### cmdStatus()

Get the current status of the migration

```js
const status = await migrateDb.cmdStatus();
```

### cmdMigrateNext()

Iteratively run through migration scripts.

```js
for (const i in numberOfScriptsOrSomething) {
  await migrateDb.cmdMigrateNext();
}
```

### cmdReset()

Undo the last migration using Umzug's `down` function. This will only work if your migration scripts provide a `down` function. See [Umzug's documentation](https://github.com/sequelize/umzug#migrations) for more details.

```js
await migrateDb.cmdReset();
```

### cmdResetPrev()

Iteratively undo a migration. This will only work if your migration scripts provide a `down` function. See [Umzug's documentation](https://github.com/sequelize/umzug#migrations) for more details.

```js
for (const i in numberOfScriptsOrSomething) {
  await migrateDb.cmdResetPrev();
}
```


## Release Notes

### 0.1.0

- Initial release


## Maintainer

This modules is maintained by Alex Seifert ([Website](https://www.alexseifert.com), [Github](https://github.com/eiskalteschatten)).
