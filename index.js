var path = require('path');
var img_map = require(path.resolve('./lib/data/ne-hotel-images-map.json'));

exports.handler = function (event, context) {
  console.log('event:', JSON.stringify(event, null, 2));
  var res_map = {};
  if (event.hotels && event.hotels.length > 0) {
    event.hotels.forEach(function (h) {
      var hotel = h.split('.')[2]; // e.g: hotel:NE.wvHotelPartId.197915
      // select the fullscreen images or fallback to "large"
      res_map[h] = img_map[hotel]['1280'] || img_map[hotel]['696'];
    });// see: https://github.com/numo-labs/lambda-ne-hotel-images/issues/1
    return context.succeed(res_map);
  } else {
    context.fail('ERROR Retrieving NE Hotel Images Please supply hotels as array');
  }
};
