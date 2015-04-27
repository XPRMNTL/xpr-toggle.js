(function() {
  'use strict';

  var xpr = window.xpr = window.xpr || {};

  xpr.XPRFeaturesList = XPRFeaturesList;

  function XPRFeaturesList() {}

  XPRFeaturesList.prototype.data = '<<<<<<<XPR Content>>>>>>>';

  XPRFeaturesList.prototype.createContainer = function() {

    if (this.$container) {
      document.body.removeChild(this.$container);
    }

    this.$container = document.createElement('div');
    this.$container.id = 'XPRMNTL-TOGGLERS';

    /**
     * Unhighlight on accidential double-click in list
     */
    this.$container.addEventListener('dblclick', function() {
      if (document.selection && document.selection.empty) {
        document.selection.empty();
      } else if (window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
      }
    });

    var $css = document.createElement('style');
    $css.textContent = '<<<<<<<CSS Content>>>>>>>';
    document.head.appendChild($css);

    this.createHeader();
    this.createList('app');
    this.createList('shared');
  };

  XPRFeaturesList.prototype.createHeader = function() {
    var $header = document.createElement('h4')
      , $actions = document.createElement('span')
      , $close = document.createElement('a')
      , $reset = document.createElement('a')
      , $wrapper;

    $header.textContent = ('XPRMNTL Features');

    $actions.className = 'actions';

    $wrapper = document.createElement('span');
    $reset.href = '#';
    $reset.textContent = 'reset';
    $reset.onclick = this.reset.bind(this);
    $wrapper.appendChild($reset);
    $actions.appendChild($wrapper);

    $wrapper = document.createElement('span');
    $close.href = '#';
    $close.textContent = 'close';
    $close.onclick = this.hide.bind(this);
    $wrapper.appendChild($close);
    $actions.appendChild($wrapper);

    $header.appendChild($actions);
    this.$container.appendChild($header);
  };

  XPRFeaturesList.prototype.createList = function(type) {
    var self = this;
    var items = this.data[type];

    if (! items) return;
    if (! Object.keys(items.features).length) return;

    var $list = document.createElement('ul');

    $list.addEventListener('change', function(event) {
      var target = event.target;

      if (! (target && target.nodeName === 'INPUT')) return;

      self.set(type, target.name, target.checked);
      xpr.saveExps(self.data.app.userId, self.data);
    });

    Object.keys(items.features).sort().map(function(key) {
      if (! items.features.hasOwnProperty(key)) return;

      var val = items.features[key]
        , $item = document.createElement('li')
        , $box = document.createElement('input')
        , $label = document.createElement('label');

      $item.appendChild($label);
      $label.textContent = key;

      $box.type = 'checkbox';
      $box.name = key;
      $box.checked = val;

      $list.appendChild($item);
      $label.insertBefore($box, $label.firstChild);
    });

    var $header = document.createElement('h5');
    $header.textContent = type + ' experiments';

    this.$container.appendChild($header);
    this.$container.appendChild($list);
  };

  XPRFeaturesList.prototype.get = function(name) {
    return this.data.app.features[name] || this.data.shared.features[name] || false;
  };

  XPRFeaturesList.prototype.hide = function() {
    this.$container.remove();
    this.shown = false;
    return false;
  };

  XPRFeaturesList.prototype.reload = function(cb) {
    var self = this;
    var xhr = new window.XMLHttpRequest();

    xhr.onload = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          return success(xhr.responseText);
        }

        return failure(new Error(xhr.statusText));
      }
    };
    xhr.onerror = function () {
      return failure(new Error(xhr.statusText));
    };

    xhr.open('GET', '/xprmntl/xpr-data.json', true);
    xhr.send();

    function success(res) {
      try {
        var data = JSON.parse(res);

        if (data.app) self.data.app = data.app;
        if (data.shared) self.data.shared = data.shared;

        self.createContainer();

        if (self.shown) {
          self.show();
        }

        xpr.trigger('update', self.data);

        if (cb) cb();
      } catch(e) {
        return failure(e);
      }
    }

    function failure(e) {
      return console.error(e);
    }

  };

  XPRFeaturesList.prototype.reset = function() {
    xpr.clearExps(function() {
      window.location.reload();
    });
    return false;
  };

  XPRFeaturesList.prototype.set = function(type, name, val) {
    this.data[type].features[name] = val;
    this.data[type].dirtyFeatures.push(name);
    this.data[type].dirtyFeatures = this.data[type].dirtyFeatures.filter(function(item, idx, list) {
      return list.indexOf(item) === idx;
    });
    xpr.trigger('update', this.data);
  };

  XPRFeaturesList.prototype.show = function() {
    if (! this.$container) this.createContainer();

    document.body.appendChild(this.$container);
    this.shown = true;
  };

  XPRFeaturesList.prototype.shown = false;

})();
