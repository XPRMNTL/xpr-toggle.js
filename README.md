[![XPRMNTL][logo-image]][logo-url]
# XPR-Toggle.js
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
[![Tips][gratipay-image]][gratipay-url]

This is a Node.js plugin for XPRMNTL [feature-client](https://github.com/XPRMNTL/feature-client.js).
It adds a new express4 middleware (`featureClient.toggle`) that serves client-side javascript for toggling features via the browser.

This library requires a `.features` object to exist on the express `req` object, as supplied by `xpr-express` and the default update of feature data is by serialization matching the same. If you have your own user->feature serialization/deserialization, you will need to configure both.

# Installation

```sh
$ npm install xpr-toggle
```

## API

#### Server

```js
var featureClient = require('feature-client');
var xprExpress = require('xpr-express');
var xprToggle = require('xpr-toggle');

featureClient.use(xprExpress());
featureClient.use(xprToggle());

app.use(featureClient.express);
app.use(featureClient.toggle);
```

#### Client
```html
<script src="/xprmntl/xpr-toggle.js"></script>
```


#### Toggles
To show the toggles, you must have the script tag on the page, and you may either:

1. Add a new query parameter of "`listEx`"
  - `[url]/[path]/?listEx`
  - `[url]/[path]/?query=val&query2=val&listEx`
2. From the JavaScript console, you may call `xpr.listEx()`

#### Configuration

You may pass in a config object during initalization:

```js
  featureClient.use(xprExpress(config));
```

  - `config.url` - The url from which you want to serve the client component
    - defaults to '/xprmntl/xpr-toggle.js'
  - `config.defaultSave` - Setting this to `false` will prevent creation of `xpr.saveExps` and `xpr.clearExps` on the client.
    - This will cause errors if you have not filled this gap properly.
    - `xpr.saveExps` shall be a function that accepts a userID, and an object in Experiment Format and is called when a toggle is changed:
    ```js
    {
      userID: userID,
      bucket: bucketNumber, // 0-99
      app: {
        userID: userID,
        bucket: bucketNumber, // May be different
        stamp: someHash, // Used to determine when out-of-date
        features: {}, // Key,value of what is already used for this user
        dirtyFeatures: {}, // Used to override library experiments with `this.features`
      },
      shared: {} // Same format as `this.app`
    }
    ```
    - `xpr.clearExps` accepts/returns nothing and is called when "Reset" is clicked

[logo-image]: https://raw.githubusercontent.com/XPRMNTL/XPRMNTL.github.io/master/images/ghLogo.png
[logo-url]: https://github.com/XPRMNTL/XPRMNTL.github.io
[npm-image]: https://img.shields.io/npm/v/xpr-toggle.svg
[npm-url]: https://www.npmjs.org/package/xpr-toggle
[downloads-image]: https://img.shields.io/npm/dm/xpr-toggle.svg
[downloads-url]: https://www.npmjs.org/package/xpr-toggle
[gratipay-image]: https://img.shields.io/gratipay/dncrews.svg
[gratipay-url]: https://www.gratipay.com/dncrews/
