(function() {
  'use strict';

  var xpr = window.xpr = window.xpr || {};
  var cookieName = '<<<<<<<XPR CookieName>>>>>>>';
  var featureList = '<<<<<<<XPR Content>>>>>>>';
  var href = window.location.href;
  var docCookies;

  readyCookies();

  xpr.listEx = listEx;

  // var autoToggled = (href.match(/xpr\.[^&]+/g) || []).reduce(function(prev, curr) {
  //   var parts = curr.replace('xpr.','').split('=')
  //     , name = parts[0]
  //     , val = parts[1]
  //     , changed = false;

  //   if (typeof featureList.app.features[name] !== undefined) {
  //     changed = true;
  //     changeVal('app', name, val);
  //   }
  //   if (typeof featureList.shared.features[name] !== undefined) {
  //     changed = true;
  //     changeVal('shared', name, val);
  //   }

  //   return true || changed;
  // }, true);

  // if (autoToggled) {
  //   setCookie();
  // }


  xpr.feature = function(name) {

    var result = featureList.app.features[name] || featureList.shared.features[name] || false;


    console.log(result);

    return result;
  };

  if (~href.split(/[\?\&]/).indexOf('listEx')) listEx();


  function listEx() {
    // var defaultFeatureList = '<<<<<<<Default XPR Content>>>>>>>';

    var $container = document.createElement('div');
    $container.id = 'XPRMNTL-TOGGLERS';

    $container.addEventListener('dblclick', function() {
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


    createHeader();
    createList('app', featureList.app);
    createList('shared', featureList.shared);

    document.body.appendChild($container);

    function createHeader() {
      var $header = document.createElement('h4')
        , $actions = document.createElement('span')
        // , $reset = document.createElement('a')
        , $close = document.createElement('a')
        , $reset = document.createElement('a')
        , $wrapper;

      $header.textContent = ('XPRMNTL Features');

      $actions.className = 'actions';

      $wrapper = document.createElement('span');
      $reset.href = '#';
      $reset.textContent = 'reset';
      $reset.onclick = reseter;
      $wrapper.appendChild($reset);
      $actions.appendChild($wrapper);

      $wrapper = document.createElement('span');
      $close.href = '#';
      $close.textContent = 'close';
      $close.onclick = closer;
      $wrapper.appendChild($close);
      $actions.appendChild($wrapper);

      $header.appendChild($actions);
      $container.appendChild($header);
    }

    function createList(type, items) {
      if (! items) return;

      var $list = document.createElement('ul');

      $list.addEventListener('change', function(event) {
        var target = event.target;

        if (! (target && target.nodeName === 'INPUT')) return;

        changeVal(type, target.name, target.checked);

        setCookie();
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

      $container.appendChild($header);
      $container.appendChild($list);
    }

    function closer() {
      $container.remove();
      return false;
    }

    function reseter() {
      docCookies.removeItem(cookieName);
      window.location.reload();
      return false;
    }
  }

  function changeVal(type, name, val) {
    featureList[type].features[name] = val;
    featureList[type].dirtyFeatures.push(name);
    featureList[type].dirtyFeatures = featureList[type].dirtyFeatures.filter(unique);
  }

  function unique(value, index, self) {
      return self.indexOf(value) === index;
  }

  function setCookie() {
    var value = serializeExps(featureList.app.userId, featureList)
      , date = new Date();

    date.setDate(date.getDate() + 10);
    docCookies.setItem(cookieName, value, date);
  }

  function serializeExps(id, data) {
    var serial = 'u:' + id + '«b:' + data.app.bucket;

    serial += serializeAppData('app', data.app);
    serial += serializeAppData('shared', data.shared);

    return serial;
  }

  function serializeAppData(name, config) {
    var serial = '╣' + name + ':';

    serial += '«s:' + config.stamp;

    var dirty = config.dirtyFeatures.reduce(function(prev, curr) {
      prev[curr] = config.features[curr];

      return prev;
    }, {});

    serial += '«d:' + JSON.stringify(dirty);
    serial += '║';

    return serial;
  }

  /*\
  |*|
  |*|  :: cookies.js ::
  |*|
  |*|  A complete cookies reader/writer framework with full unicode support.
  |*|
  |*|  Revision #1 - September 4, 2014
  |*|
  |*|  https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
  |*|  https://developer.mozilla.org/User:fusionchess
  |*|
  |*|  This framework is released under the GNU Public License, version 3 or later.
  |*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
  |*|
  |*|  Syntaxes:
  |*|
  |*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
  |*|  * docCookies.getItem(name)
  |*|  * docCookies.removeItem(name[, path[, domain]])
  |*|  * docCookies.hasItem(name)
  |*|  * docCookies.keys()
  |*|
  \*/
  function readyCookies() {
    docCookies = {
      getItem: function (sKey) {
        if (!sKey) { return null; }
        return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
      },
      setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
        var sExpires = '';
        if (vEnd) {
          switch (vEnd.constructor) {
            case Number:
              sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
              break;
            case String:
              sExpires = '; expires=' + vEnd;
              break;
            case Date:
              sExpires = '; expires=' + vEnd.toUTCString();
              break;
          }
        }
        document.cookie = encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue) + sExpires + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '') + (bSecure ? '; secure' : '');
        return true;
      },
      removeItem: function (sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '');
        return true;
      },
      hasItem: function (sKey) {
        if (!sKey) { return false; }
        return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
      },
      keys: function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
      }
    };
  }

})();
