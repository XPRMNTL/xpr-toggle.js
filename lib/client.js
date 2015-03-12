(function() {
  'use strict';

  var xpr = window.xpr = window.xpr || {};
  var featureList = '<<<<<<<XPR Content>>>>>>>';
  var href = window.location.href;

  xpr.listEx = listEx;

  xpr.feature = function(name) {

    var result = featureList.app.features[name] || featureList.shared.features[name] || false;

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
        xpr.saveExps(featureList.app.userId, featureList);
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
      xpr.clearExps();
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

})();
