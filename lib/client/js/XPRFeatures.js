(function() {
  'use strict';

  var xpr = window.xpr = window.xpr || {};

  xpr.XPRFeaturesList = XPRFeaturesList;

  function XPRFeaturesList() {}

  XPRFeaturesList.prototype.buttons = {
    'clear': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAu0lEQVQ4T2NkoBAw4tIvXvfH/z/Df0OQ/P//DL9YmVlmPWtgfIOuHqcBovV/Jr9uZMkFaRBq+M/H/PdPzutm1ja8BojV/W6AKfjPwODAyMBwABv/HxPDgTcNrGA5DBeI1v3+jy9YGBkYGl81scItwmkASOF/BoZ6bPSoASMhEH/+YWBgYmZgYDjIwMBgj4Wued3E2gpLbBgJSaTudxfjv3+FDExMLOgp8j8D433Gf3/cX7dw3MZpAKm5GwDEjI4R0hkkYwAAAABJRU5ErkJggg==',
    'close': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACOUlEQVQ4T6XTb2gSYRwH8O+jd97tlKULqVeDvcjWqyAo6EUQUUGuIPOF9GeLbIGjuWW9aOQsXBNaL2QqYy/qjSsWrBXB7EUt6E34qljUBpPlgqaDSuew6V26u4szdjhcL8KDe3EP9/38eL4PD0GdD6kzjxrAwzAuPcNYBvP569V4H8t6tYSIAZ6/V72+CfBwnMvZ1RVhDAbqcTgcGcjlepSfbxkMPrvV6hcFQZ588/r2/aIQ2EBUQJns7O6OGFtbKYnnUUgm8SQaDZP19Yyt7YSf224ipCzg1/xnaWJm5s7QGgYVRAX6GxuD7W63hzGbIQkC5N88SstLkEu8zOobSHkxAfHbArD6A1MCHt3MoGMToHz4zabw2Qvn3WyTCSjzICUe8spPCPFpkEIONAW8LGLsahpOAGINoCwMNRtD586c7qH1DZBSiyi/fwtKLkFLEUwVNNErSfHyRnhLYKSF89lPtfl1WpmU38UAyNDQNGSaRiwrhpyz+Wv/PIXRXZzPbj3uZ40mokyWC3kQHV0BCE1Domg8Xy6GOuMpFVFLHNlj8DpOWu8yxiYiZ9IQFz5WQjJFg2L+AsoraimMf8mGXNOJCqICD/bv6LMfOxJgthk10tc5oJDDi9RaFJRm1WbZ2UsxOhV4mvgevPjsw42aDkYPt3gdhw4MsNklzWRyZazj1Xyl7aht37Bjb3Ovsp2J2XSwfTxeCW9ZYvjo7n6OZSydsU+Xqtt+6Dg4zGiJWB3eEvjfy1X3bfwDWdbSEYRfLCcAAAAASUVORK5CYII=',
    'refresh': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABr0lEQVQ4T6WTz0uUQRjHPzOzrVpCkCwbBLW5WuLij6CLEHr1GuSQJw8FgSf/lE5CkAdPySh07aoIXoQsWfHX2hoELYuB4I/admbkfXtf3cJ1F5rbPDOf7/Od78MI/nOJenzGpAYFKnmdjrW8zlfq3ftL4IHpuFNFvQbxFFAXkFgGP7mnS+tBrW8+662ne0MXds8FsiY16pFzwM0IPAJ+AHejfSVxrGYTv5Np2SaHZIuc/Kx3F0KBeyZ9X8HHP7DfcshXRf19MTjreZfJoOysFGpY1Zjq8YXEvMaGAp0m/RZ4EcBt+Md5XQ66n6/A8r8ZrI8VQrZuiDEQwO6n/yRbxUBQczgkkqYFGk25oYOmBEKbkbXQZmQ5tnmVSOjgqpBiOGdS7aeIVRAPgZk9XXoZhjhmUJsiW40vWizO2yWsmtgcLxaDesbcHpG4NxF8aOHRvi59CQX6Tdcz98tNu1O3Ur1WKVVv2AkgGQl+BW4B7dH+UOCeF3T5Q9xQ9JpslxLsxO/tNOk+ENPgn9S83YJ/n8BObeuDb7WZ1J1CzuSSJxwMemylqMtrTX2mRiO77PwMQsyZEd4BDOoAAAAASUVORK5CYII=',
  }

  XPRFeaturesList.prototype.data = '<<<<<<<XPR Content>>>>>>>';

  XPRFeaturesList.prototype.createContainer = function() {

    if (this.$container && this.shown) document.body.removeChild(this.$container);

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
      , $actions = document.createElement('span');

    $header.textContent = ('XPRMNTL Features');
    $actions.className = 'actions';

    function createLink(text, click, src) {
      var $link = document.createElement('a')
        , $img = document.createElement('img')
        , $wrapper = document.createElement('span');

      $link.href = '#';
      if (text) $link.title = text;
      $link.onclick = click;
      $img.src = src;

      $link.appendChild($img);
      $wrapper.appendChild($link);
      $actions.appendChild($wrapper);
    }

    createLink('Refresh', function() {
      window.location.reload();
    }, this.buttons.refresh);
    createLink('Reset', this.reset.bind(this), this.buttons.clear);
    createLink('Close', this.hide.bind(this), this.buttons.close);

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
