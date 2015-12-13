(function() {
  'use strict';

  angular.module('app')
    .controller('LocationController', LocationController);

  LocationController.$inject = ['LocationModel', '$cordovaGeolocation', 'Message', '$scope', 'gpsService'];

  function LocationController(LocationModel, $cordovaGeolocation, Message, $scope, gpsService) {
    var Location = this;
    Location.Model = LocationModel;

    $scope.$on('$ionicView.enter', function() {
      gpsService.checkGPS();
    });
    //====================================================
    //  IMPLEMENTATION
    //====================================================
  }
})();
