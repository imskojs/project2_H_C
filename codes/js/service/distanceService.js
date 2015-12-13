// Input:
//p1, p2, where p1,p2 = {latitude: float, longitude: float}

// Usage
// Distance.between({latitude: 33, longitude: 33}, {latitude: 44, longitude:44});

// Output: distance between two points in meters.
// 20000
(function() {
  'use strict';

  angular.module('app')
    .factory('Distance', Distance);

  Distance.$inject = ['geolib'];

  function Distance(geolib) {

    var service = {
      // between: haversine
      between: geolib.getDistance
    };

    return service;





    // //====================================================
    // //  IMPLEMENTATIONS
    // //====================================================
    // //p1, p2 = {latitude: 33, longitude: 33}
    // function haversine(p1, p2) {
    //     var R = 6371;
    //     var dLat = rad(p2.latitude - p1.latitude);
    //     var dLong = rad(p2.longitude - p1.longitude);

    //     var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    //         Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.latitude)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    //     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //     var d = R * c;

    //     var meters = Math.round(d * 1000);
    //     return meters;
    // }
    // //====================================================
    // //  HELPER
    // //====================================================
    // function rad(x) {
    //     return x * Math.PI / 180;
    // }

  }
})();
