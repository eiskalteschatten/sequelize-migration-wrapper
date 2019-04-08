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

migrateDb.cmdMigrate().then(...).catch(...);
```

#### Options

- sequelize (no default, must be a Sequelize instance),
- path (default: path.join(__dirname, 'migrations')),
- filePattern (default: /\.js$/)


## API

Coming soon...


## Release Notes

### 0.1.0

- Initial release


## Maintainer

This modules is maintained by Alex Seifert ([Website](https://www.alexseifert.com), [Github](https://github.com/eiskalteschatten)).
