if (!global.Zone) {
  require('core-js');

  require('zone.js/dist/zone-node');
  require('zone.js/dist/long-stack-trace-zone');
  require('zone.js/dist/proxy');
  require('zone.js/dist/sync-test');
  require('zone.js/dist/async-test');
  require('zone.js/dist/fake-async-test');
  // require('zone.js/dist/mocha-patch');
}
