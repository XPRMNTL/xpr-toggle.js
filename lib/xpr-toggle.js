/**
 * XPRMNTL Feature-client.js Plugin:
 * XPR - Toggle
 *
 * Provides a UI for toggling experiments on/off
 * for the current user. Does not affect other
 * users.
 */

var read = require('fs').readFileSync
  , debug = require('debug')('XPRMNTL:toggle');

module.exports = XprmntlToggle;

var jsPaths = [
    './client/js/XPRFeatures.js',
    './client/js/client.js',
  ]
  , cssSource
  , jsSource;

function preload() {
  cssSource = read(require.resolve('./client/css/xpr-toggle.css'), 'utf-8');
  cssSource = cssSource.replace(/'/g, '\\\'').replace(/\s*\n\s*/g, ' ');

  jsSource = jsPaths.map(function(path) {
    return read(require.resolve(path), 'utf-8');
  }).join('\n');

  jsSource = jsSource.replace(/<<<<<<<CSS Content>>>>>>>/g, cssSource);
}
// var jsSource = read(require.resolve('./client.js'), 'utf-8');
// var cssSource = read(require.resolve('./stylesheet.css'), 'utf-8');

function XprmntlToggle(config) {

  if (! (this instanceof XprmntlToggle)) {
    return new XprmntlToggle(config);
  }

  if (! config) config = {};

  this.scriptUrl = config.scriptUrl || config.url || '/xprmntl/xpr-toggle.js';
  this.dataUrl = config.dataUrl || '/xprmntl/xpr-data.json';
  this.url = config.url || '/xprmntl/xpr-toggle.js';
  var defaultSave = (undefined === config.defaultSave) ? true : config.defaultSave;

  if (defaultSave) {
    jsPaths.unshift('./client/js/serialize.js');
  }

  preload();

  return (function init(client) {

    client.toggle = this.middleware.bind(this);
    this.cookieName = client.cookieName;

  }).bind(this);
}

XprmntlToggle.prototype.handleDataUrl = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  return res.json(req.features);
};

XprmntlToggle.prototype.handleScriptUrl = function(req, res) {
  // HACKHACKHACK DO NOT LEAVE THIS IN
  // preload();

  var src = jsSource.replace(/'<<<<<<<XPR Content>>>>>>>'/g, JSON.stringify(req.features, null, 2));

  src = src.replace('/xprmntl/xpr-data.json', this.dataUrl);
  src = src.replace(/<<<<<<<XPR CookieName>>>>>>>/g, this.cookieName);

  // var version = require('../package.json').version;
  // var etag = req.headers['if-none-match'];

  // if (etag && (etag === version)) {
  //   debug('serve client 304');
  //   return res.sendStatus(304);
  // }

  debug('serve client source');
  res.setHeader('Content-Type', 'application/javascript');
  // res.setHeader('ETag', version);
  res.writeHead(200);
  return res.end(src);
};

XprmntlToggle.prototype.middleware = function(req, res, next) {

  if (req.path.indexOf(this.dataUrl) === 0) return this.handleDataUrl(req, res);
  if (req.path.indexOf(this.scriptUrl) === 0) return this.handleScriptUrl(req, res);

  next();
};
