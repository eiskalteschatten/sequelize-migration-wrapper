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

This module is tested with Node.js 8 and 9. It might work with Node.js 6 or 7, but is not tested.


## Install

```
npm install --save concatenate-js-middleware
```

## Usage

### For on-the-fly compiling

```js
const concatenateJs = require('concatenate-js-middleware');
const jsConfig = require('./config/jsConfig.js');

app.use('/js/:jsName', concatenateJs(jsConfig));
```

### For concatenating and saving as static JavaScript file

```js
const concatenateJs = require('concatenate-js-middleware');
const jsConfig = require('./config/jsConfig.js');

concatenateJs.concatenateJsAndSaveMultiple({
  originPath: path.join(__dirname, 'public/js/'),
  destinationPath: path.join(__dirname, 'public/js/'),
  files: ['libs.js'],
  minify: true,
  config: jsConfig
}).then(...).catch(...);
```

## API

### concatenateJs()

Returns the concatenated JavaScript as a string.

```js
const concatenateJs = require('concatenate-js-middleware');
const jsConfig = require('./config/jsConfig.js');

const jsString = concatenateJs.concatenateJs(jsConfig['libs']).then(...).catch(...);
```

### concatenateJsAndSave()

Concatenates the given JavaScript file.

```js
const concatenateJs = require('concatenate-js-middleware');
const jsConfig = require('./config/jsConfig.js');

concatenateJs.concatenateJsAndSave({
  originPath: path.join(__dirname, 'public/js/'),
  destinationPath: path.join(__dirname, 'public/js/'),
  file: 'libs.js',
  minify: true,
  config: jsConfig
}).then(...).catch(...);
```

### concatenateJsAndSaveMultiple()

Concatenates multiple JavaScript files defined in the "files" option.

```js
const concatenateJs = require('concatenate-js-middleware');
const jsConfig = require('./config/jsConfig.js');

concatenateJs.concatenateJsAndSaveMultiple({
  originPath: path.join(__dirname, 'public/js/'),
  destinationPath: path.join(__dirname, 'public/js/'),
  files: ['libs.js'],
  minify: true,
  config: jsConfig
}).then(...).catch(...);
```

### setupCleanupOnExit()

Deletes the passed directory when the app is exited. The idea is to pass the directory where your compiled CSS files are, so that they can be deleted when the app is exited and recompiled when the app starts.

```js
const concatenateJs = require('concatenate-js-middleware');

process.on('SIGINT', () => {
  try {
    concatenateJs.setupCleanupOnExit({
      path: path.join(__dirname, 'public/js/'),
      files: ['libs.js']
    });
    process.exit(0);
  }
  catch(error) {
    process.exit(1);
  }
});
```


## Maintainer

This modules is maintained by Alex Seifert ([Website](https://www.alexseifert.com), [Github](https://github.com/eiskalteschatten)).
