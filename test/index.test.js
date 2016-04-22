var handler = require('../index').handler;
var assert = require('assert');

var CONTEXT = {
  functionName: 'LambdaTest',
  functionVersion: '1',
  invokedFunctionArn: 'arn:aws:lambda:eu-west-1:655240711487:function:LambdaTest:$LATEST'
};

var EVENT = {
  hotels: ['hotel:NE.wvHotelPartId.197915','hotel:NE.wvHotelPartId.197941']
};

describe('hotel image lookup', function () {
  it('invoke the lambda function handler', function (done) {
    CONTEXT.succeed = function () {
      // console.log(' - - - - - - - - - - - - - - - - - - - - - - - - ');
      console.log(arguments[0]); // the argument to context.succeed
      assert(arguments[0]['hotel:NE.wvHotelPartId.197915'].length > 10);
      done();
    };
    handler(EVENT, CONTEXT);
  });

  it('invoke the lambda function handler without hotels', function (done) {
    CONTEXT.fail = function () {
      console.log(' - - - - - - - - - - - - - - - - - - - - - - - - ');
      console.log(arguments); // the argument to context.succeed
      var msg = 'ERROR Retrieving NE Hotel Images Please supply hotels as array';
      assert(arguments[0] === msg);
      done();
    };
    handler({}, CONTEXT);
  });
});
