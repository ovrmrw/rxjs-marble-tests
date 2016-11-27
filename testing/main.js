/* >>> boilerplate */
var window;
if (!global.Zone) {
  window = global;
  // require('babel-polyfill');
  require('core-js');

  require('zone.js/dist/zone-node');
  require('zone.js/dist/long-stack-trace-zone');
  require('zone.js/dist/proxy');
  require('zone.js/dist/sync-test');
  require('zone.js/dist/async-test');
  require('zone.js/dist/fake-async-test');
  // require('zone.js/dist/jasmine-patch');
  require('zone.js/dist/mocha-patch');
}

require('../spec');
/* <<< boilerplate */
