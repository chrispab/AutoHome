var someProperty = 'Hello bbbbbbbbbbbbbbbbbbbb world!';
function someFunction() {
  console.log('Hello bbbbbbbbbbbbbbbbbbbbfrom your personal library!');
}

module.exports = {
  someProperty,
  someFunction,
  get utils() { return require('./utils.js') },
  get alerting() { return require('./alerting.js') }

};

