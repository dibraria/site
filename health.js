const { ok, STORES } = require('./_shared');

exports.handler = async () => ok({
  status: 'ok',
  stores: Object.keys(STORES),
  ts: new Date().toISOString(),
});
