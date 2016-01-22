(function() {
  'use strict';

  angular.module('app')
    .factory('LogService', LogService);

  LogService.$inject = [
    '$cordovaDevice', '$window',
    'appStorage', 'Logs'
  ];

  function LogService(
    $cordovaDevice, $window,
    appStorage, Logs
  ) {
    var moment = $window.moment;

    var Service = {
      sendUUID: sendUUID
    };

    return Service;

    //====================================================
    //  Send device UUID if not sent between 00:00 to 23:59:59
    //====================================================
    function sendUUID() {
      var today = moment().hour(0).minute(0).second(0);
      if (!appStorage.loggedDate || moment(appStorage.loggedDate).isBefore(today)) {
        appStorage.loggedDate = new Date().toString();
        return Logs.log({}, {
            deviceId: $cordovaDevice.getUUID()
          }).$promise
          .then(function(data) {
            console.log("---------- data ----------");
            console.log(data);
            appStorage.loggedDate = new Date().toString();
          })
          .catch(function(err) {
            console.log("---------- err ----------");
            console.log(err);
          });
      }
    }
  }
})();
