(function() {
  'use strict';

  var xpr = window.xpr = window.xpr || {};

  var features = new xpr.XPRFeaturesList();

  var pubsub = document.createElement('div');

  xpr.feature = features.get.bind(features);
  xpr.listEx = features.show.bind(features);
  xpr.reload = features.reload.bind(features);

  xpr.on = function(eventName, handler) {
    pubsub.addEventListener(eventName, function(e) {
      handler(e, e.detail);
    }, false);
  };

  xpr.trigger = function(eventName, data) {
    var _event = new CustomEvent('update', { detail: data });

    pubsub.dispatchEvent(_event);
  };

  if (~window.location.href.split(/[\?\&\#]/).indexOf('listEx')) xpr.listEx();

})();
