var handler = require('../index').handler;
var assert = require('assert');

var CONTEXT = {
  functionName: 'LambdaTest',
  functionVersion: '1',
  invokedFunctionArn: 'arn:aws:lambda:eu-west-1:655240711487:function:LambdaTest:$LATEST'
};

var EVENT = {
  size: 'large',
  hotels: ['hotel:NE.wvHotelPartId.197915','hotel:NE.wvHotelPartId.197941']
};
console.log(' - - - - - - - - - - - - - - - - - - - - TEST SNS MESSAGE:');
console.log(JSON.stringify(EVENT, null, 2));
console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');

describe('hotel image lookup', function () {
  it.only('invoke the lambda function handler', function (done) {
    CONTEXT.succeed = function () {
      console.log(' - - - - - - - - - - - - - - - - - - - - - - - - ');
      console.log(arguments[0]['197915']); // the argument to context.succeed
      assert(arguments[0]['197915'].length > 10);
      done();
    };
    handler(EVENT, CONTEXT);
  });

  it('invoke the lambda function handler', function (done) {
    CONTEXT.invokedFunctionArn = 'arn:aws:lambda:eu-west-1:12345:function:LambdaTest:ci';
    CONTEXT.succeed = function () {
      console.log(' - - - - - - - - - - - - - - - - - - - - - - - - ');
      // console.log(arguments); // the argument to context.succeed
      assert(parseInt(arguments[0], 10) > 1);
      done();
    };
    handler(EVENT, CONTEXT);
  });
});
