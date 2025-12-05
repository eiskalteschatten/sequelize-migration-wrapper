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

This module is tested with Node.js 14. It might work with Node.js >= 12, but is not tested.


## Install

```
npm install --save sequelize-migration-wrapper
```

## Usage

### Initialization

```js
import { setupMigration } from 'sequelize-migration-wrapper'; // TypeScript
const { setupMigration } = require('sequelize-migration-wrapper'); // CommonJS

const sequelize = new Sequelize({...});

setupMigration({
  sequelize,
  glob: 'path/to/migration/scripts/*.{js,ts}',
});
```

#### Options

- sequelize (no default, must be a Sequelize instance; required),
- glob (no default; required),



## API

### migrate()

Runs through all migration scripts in the configured folder. Umzug automatically saves which migration scripts have already been run, so it will not re-run those.

```js
await migrateDb.migrate();
```

### getStatus()

Get the current status of the migration

```js
const status = await migrateDb.getStatus();
```

### migrateNext()

Iteratively run through migration scripts.

```js
for (const i in numberOfScriptsOrSomething) {
  await migrateDb.migrateNext();
}
```

### reset()

Undo the last migration using Umzug's `down` function. This will only work if your migration scripts provide a `down` function. See [Umzug's documentation](https://github.com/sequelize/umzug#migrations) for more details.

```js
await migrateDb.reset();
```

### resetPrev()

Iteratively undo a migration. This will only work if your migration scripts provide a `down` function. See [Umzug's documentation](https://github.com/sequelize/umzug#migrations) for more details.

```js
for (const i in numberOfScriptsOrSomething) {
  await migrateDb.resetPrev();
}
```


## Release Notes

### 2.0.0

- Major update for `umzug`
- **Breaking Change:** a glob is now required instead of the `path`/`filePattern` combination
- Security updates

### 1.0.1

- Security updates


### 1.0.0

- Complete rewrite in TypeScript
- Support for Sequelize 6

### 0.1.1

- Update dependencies to fix security vulnerabilities

### 0.1.0

- Initial release


## Maintainer

This modules is maintained by Alex Seifert ([Website](https://www.alexseifert.com), [Github](https://github.com/eiskalteschatten)).
