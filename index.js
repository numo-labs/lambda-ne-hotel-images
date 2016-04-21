var img_map = require(require('path').resolve('./lib/data/ne-hotel-images-map.json'));

exports.handler = function (event, context) {
  console.log('event:', JSON.stringify(event, null, 2));
  var res_map = {};
  if (event.hotels && event.hotels.length > 0) {
    event.hotels.forEach(function (h) {
      var hotel = h.split('.')[2]; // e.g: hotel:NE.wvHotelPartId.197915
      res_map[hotel] = img_map[hotel]['1280'] || img_map[hotel]['696']; // fallback
    });
    return context.succeed(res_map);
  } else {
    context.fail('Please supply hotels as array');
  }
};
