module.exports = {
  require: ['ts-node/register', 'test/bootstrap.ts'],
  'full-trace': true,
  recursive: true,
  timeout: 20000000,
  reporter: 'spec'
};
