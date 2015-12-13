(function() {
  'use strict';

  angular.module('app')
    .factory('gpsService', gpsService);

  gpsService.$inject = ['$cordovaGeolocation', 'Message', '_'];

  function gpsService($cordovaGeolocation, Message, _) {

    function getPosition() {
      console.log('test throttle');
      return $cordovaGeolocation.getCurrentPosition({
          maximumAge: 600000,
          timeout: 7000
        })
        .then(function success(position) {
          console.log(position);
        }, function geoError(error) {
          console.log(error);
          Message.alert(
            '위치 공유가 꺼져있습니다.',
            '위치 공유를 켜주세요.'
          );
        });
    }

    var checkGPS = _.throttle(getPosition, 8000, {
      trailing: false
    });

    var service = {
      checkGPS: checkGPS
    };

    return service;


  }
})();
